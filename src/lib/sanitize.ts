import xss from 'xss';

/**
 * Strips out XSS-related markup recursively and encodes malicious strings safely.
 */
export function sanitizeInput(input: unknown): any {
  if (typeof input === 'string') {
    return xss(input);
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitizedObj: any = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitizedObj[key] = sanitizeInput((input as any)[key]);
      }
    }
    return sanitizedObj;
  }
  return input;
}
