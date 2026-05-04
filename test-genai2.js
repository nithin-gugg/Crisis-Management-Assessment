const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const responseSchema = {
        type: SchemaType.OBJECT,
        properties: {
            text: { type: SchemaType.STRING },
            follow_up_question: { type: SchemaType.STRING },
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
        required: ["text", "follow_up_question", "cta"]
    };

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // Using 2.5 flash
        systemInstruction: "You are a helpful assistant.",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.2,
        }
    });

    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage("Hello");
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
run();
