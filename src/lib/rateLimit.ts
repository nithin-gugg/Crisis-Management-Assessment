// In-memory rate limiting map
// Keys are IP addresses, tracking multiple concurrent hits globally across requests

type RateLimitData = {
  count: number;
  resetTime: number;
};

const rateLimitMap = new Map<string, RateLimitData>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;      // 5 requests per 1 minute window

export function checkRateLimit(ip: string): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const currentData = rateLimitMap.get(ip);

  // Expire obsolete windows dynamically to prevent memory leak
  if (currentData && currentData.resetTime < now) {
    rateLimitMap.delete(ip);
  }

  const existingData = rateLimitMap.get(ip);

  if (!existingData) {
    // First request
    const resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, { count: 1, resetTime });
    return { success: true, limit: MAX_REQUESTS_PER_WINDOW, remaining: MAX_REQUESTS_PER_WINDOW - 1, reset: resetTime };
  }

  if (existingData.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit hit
    return { success: false, limit: MAX_REQUESTS_PER_WINDOW, remaining: 0, reset: existingData.resetTime };
  }

  // Increment counter
  existingData.count += 1;
  return { 
    success: true, 
    limit: MAX_REQUESTS_PER_WINDOW, 
    remaining: MAX_REQUESTS_PER_WINDOW - existingData.count, 
    reset: existingData.resetTime 
  };
}
