const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = ALPHABET.length;

export function encode(n: number): string {
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('Must be a non-negative safe integer');
  if (n === 0) return ALPHABET[0] || "";
  let out = '';
  while (n > 0) {
    out = ALPHABET[n % BASE] + out;
    n = Math.floor(n / BASE);
  }
  return out;
}

export function decode(code: string): number | null {
  if (!/^[0-9a-zA-Z]+$/.test(code)) return null;
  let n = 0;
  for (const ch of code) {
    n = n * BASE + ALPHABET.indexOf(ch);
    if (!Number.isSafeInteger(n)) return null;
  }
  return n;
}
