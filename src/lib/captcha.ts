/**
 * Validates a given Cloudflare Turnstile token via their secure endpoints natively
 */
export async function verifyCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY environment variable is missing.');
    // If not configured, we might allow it depending on environment structure, 
    // but in a production-grade secure application, block execution gracefully.
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('reCAPTCHA verification error:', err);
    return false;
  }
}
