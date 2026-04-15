import { randomBytes } from 'node:crypto';

const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghjkmnpqrstuvwxyz';
const DIGITS = '23456789';
const SPECIAL = '!@#$%&*';

function pickRandom(charset: string): string {
  const index = randomBytes(1)[0] % charset.length;
  return charset[index];
}

export function generateTemporaryPassword(length = 12): string {
  const mandatory = [
    pickRandom(UPPERCASE),
    pickRandom(LOWERCASE),
    pickRandom(DIGITS),
    pickRandom(SPECIAL),
  ];

  const allChars = UPPERCASE + LOWERCASE + DIGITS + SPECIAL;
  const remaining = Array.from({ length: length - mandatory.length }, () =>
    pickRandom(allChars),
  );

  const combined = [...mandatory, ...remaining];

  for (let i = combined.length - 1; i > 0; i--) {
    const j = randomBytes(1)[0] % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join('');
}
