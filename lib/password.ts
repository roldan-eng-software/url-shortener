import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  if (passwordHash.startsWith('$2')) {
    return bcrypt.compare(password, passwordHash);
  }

  return (await legacySha256(password)) === passwordHash;
}

export function needsPasswordRehash(passwordHash: string) {
  return !passwordHash.startsWith('$2');
}

async function legacySha256(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
