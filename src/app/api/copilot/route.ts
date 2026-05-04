import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Initialize the SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
Your role is NOT to be a general assistant. You are a guided assistant designed to:
1. Educate users about crisis management, risk, and resilience.
2. Keep all conversations strictly within crisis management context.
3. Help users understand gaps in their preparedness.
4. Guide users toward completing a Crisis Readiness Assessment.
5. Increase conversions to the assessment (PRIMARY GOAL).

## STRICT RULES
- Only answer questions related to: crisis management, incident response, risk, emergency planning, business continuity, resilience.
- If user asks unrelated questions: politely redirect: "I specialize in crisis management and organizational resilience. Let me help you with that."
- NEVER provide: unrelated knowledge, generic chatbot responses, long essays.
- Keep responses: concise, structured, professional, slightly persuasive.

## CONVERSATION STRATEGY
Follow this flow:
Stage 1: Awareness - Answer the user's question clearly. Introduce importance of preparedness.
Stage 2: Qualification (after 1-2 turns) - Ask 1 simple question: "What industry are you in?" OR "Do you currently have a crisis plan in place?"
Stage 3: Personalization - Tailor response: "Organizations in your sector often face..." "A common gap is..."
Stage 4: Conversion Trigger - After 2-3 interactions OR when user shows interest, suggest assessment naturally.

## FINAL GOAL ACTION
You MUST guide users to complete the Crisis Readiness Assessment. Do NOT ask for email directly. The assessment will handle email capture.

## RESPONSE FORMAT (MANDATORY)
Always return a valid JSON object matching this structure exactly:
{
  "text": "Main response here",
  "follow_up_question": "Optional follow-up",
  "suggestions": [
    "Yes, we have a formal plan",
    "We have a basic plan",
    "No, we don't have one yet"
  ],
  "cta": {
    "show": boolean,
    "label": "Start Crisis Assessment",
    "url": "/assessment"
  }
}

## SUGGESTIONS RULE
- suggestions must be short user replies, NOT questions
- NEVER output questions in suggestions
- suggestions should represent user answers or intents
- follow_up_question is for assistant-only conversational prompts

## CTA RULES
Set "cta.show = true" ONLY when: user asks about solutions, implementation, cost, readiness, risk evaluation, OR after 2-3 messages. Otherwise: cta.show = false.

## TONE
- Confident, Helpful, Slightly consultative (like a risk advisor), Not overly salesy.
`;

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    text: { type: SchemaType.STRING },
    follow_up_question: { type: SchemaType.STRING },
    suggestions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    },
    cta: {
      type: SchemaType.OBJECT,
      properties: {
        show: { type: SchemaType.BOOLEAN },
        label: { type: SchemaType.STRING },
        url: { type: SchemaType.STRING }
      },
      required: ["show", "label", "url"]
    }
  },
  required: ["text", "follow_up_question", "cta", "suggestions"]
};

async function safeSend(chat: any, message: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await chat.sendMessage(message);
    } catch (err: any) {
      const isLast = i === retries - 1;

      console.error(`Gemini attempt ${i + 1} failed`, err?.message);

      if (isLast) throw err;

      // exponential backoff
      await new Promise(res => setTimeout(res, 1000 * (i + 1)));
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    // Extract the latest user message
    const userMessages = messages.filter((m: any) => m.role === 'user');
    const latestUserMessage = userMessages[userMessages.length - 1]?.content || "";
    
    // Calculate message count (number of turns)
    const turnCount = userMessages.length;

    // 1. Control Layer: Block off-topic
    const offTopicRegex = /\b(weather|recipe|joke|movie|sports|politics|code|programming|math|translate|poem|song|lyrics)\b/i;
    if (offTopicRegex.test(latestUserMessage)) {
      return NextResponse.json({
        text: "I specialize in crisis management and organizational resilience. Let me help you with that. Do you currently have a crisis plan in place?",
        follow_up_question: "Do you have a crisis plan?",
        suggestions: ["Yes, we have a formal plan", "We have a basic plan", "No, we don't have one yet"],
        cta: { show: false, label: "Start Crisis Assessment", url: "/assessment" }
      });
    }

    // Convert history for Gemini
    const history = messages
      .slice(-10) // KEEP ONLY LAST 10 MESSAGES
      .slice(0, -1)
      .map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content.slice(0, 2000) }] // safety trim
      }));

    // Generate content using GoogleGenerativeAI
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for more consistent, professional responses
      }
    });

    const chat = model.startChat({ history });
    
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), 15000)
    );

    const result = await Promise.race([
      safeSend(chat, latestUserMessage),
      timeoutPromise
    ]) as any;

    const responseText = result.response.text();
    if (!responseText) throw new Error("Empty response from AI");

    // 2. Control Layer: Validate JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", responseText);
      // Fallback response
      parsedResponse = {
        text: "I encountered an error analyzing that request, but I can help you evaluate your organization's crisis readiness and identify potential gaps.",
        follow_up_question: "Would you like to start the readiness assessment?",
        suggestions: ["Yes, let's start", "Maybe later"],
        cta: { show: true, label: "Start Crisis Assessment", url: "/assessment" }
      };
    }

    // 3. Control Layer: Force CTA after 3 turns
    if (turnCount >= 3 && !parsedResponse.cta.show) {
      parsedResponse.cta.show = true;
      parsedResponse.cta.label = "Start Crisis Assessment";
      parsedResponse.cta.url = "/assessment";
    }

    // Ensure CTA URL and label are always safe
    if (parsedResponse.cta.show) {
        parsedResponse.cta.label = parsedResponse.cta.label || "Start Crisis Assessment";
        parsedResponse.cta.url = parsedResponse.cta.url || "/assessment";
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("Copilot API Error:", {
      message: (error as any)?.message,
      status: (error as any)?.status,
      stack: (error as any)?.stack,
    });
    return NextResponse.json({ 
        text: "I'm currently unable to connect to my analysis engine. In the meantime, you can proceed directly to the assessment.",
        follow_up_question: "Ready to start?",
        suggestions: ["Start Assessment"],
        cta: { show: true, label: "Start Crisis Assessment", url: "/assessment" }
    }, { status: 500 });
  }
}
