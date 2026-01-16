
import { PasswordOptions, StrengthLevel, StrengthInfo } from '../types';

const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed I, O for similarity check defaults
const LOWERCASE = 'abcdefghijkmnopqrstuvwxyz'; // Removed l, o
const NUMBERS = '23456789'; // Removed 1, 0
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Full sets including "similar" characters
const SIMILAR_UPPERCASE = 'IO';
const SIMILAR_LOWERCASE = 'l';
const SIMILAR_NUMBERS = '10';

export const generatePassword = (options: PasswordOptions): string => {
  let charset = '';
  
  const uppers = options.includeUppercase ? (options.excludeSimilar ? UPPERCASE : UPPERCASE + SIMILAR_UPPERCASE) : '';
  const lowers = options.includeLowercase ? (options.excludeSimilar ? LOWERCASE : LOWERCASE + SIMILAR_LOWERCASE) : '';
  const numbers = options.includeNumbers ? (options.excludeSimilar ? NUMBERS : NUMBERS + SIMILAR_NUMBERS) : '';
  const symbols = options.includeSymbols ? SYMBOLS : '';

  charset = uppers + lowers + numbers + symbols;

  if (charset.length === 0) return '';

  const passwordArray = new Uint32Array(options.length);
  window.crypto.getRandomValues(passwordArray);

  let result = '';
  for (let i = 0; i < options.length; i++) {
    result += charset.charAt(passwordArray[i] % charset.length);
  }

  return result;
};

export const calculateStrength = (password: string, options: PasswordOptions): StrengthInfo => {
  if (!password) return { level: StrengthLevel.WEAK, score: 0, color: 'bg-red-500', entropy: 0 };

  let charsetSize = 0;
  if (options.includeUppercase) charsetSize += 26;
  if (options.includeLowercase) charsetSize += 26;
  if (options.includeNumbers) charsetSize += 10;
  if (options.includeSymbols) charsetSize += SYMBOLS.length;

  // Bits of entropy: log2(charsetSize ^ length) = length * log2(charsetSize)
  const entropy = password.length * Math.log2(charsetSize || 1);
  
  let level: StrengthLevel;
  let score: number;
  let color: string;

  if (entropy < 40) {
    level = StrengthLevel.WEAK;
    score = Math.min(25, (entropy / 40) * 25);
    color = 'bg-red-500';
  } else if (entropy < 60) {
    level = StrengthLevel.FAIR;
    score = 25 + ((entropy - 40) / 20) * 25;
    color = 'bg-orange-500';
  } else if (entropy < 80) {
    level = StrengthLevel.GOOD;
    score = 50 + ((entropy - 60) / 20) * 25;
    color = 'bg-yellow-500';
  } else if (entropy < 100) {
    level = StrengthLevel.STRONG;
    score = 75 + ((entropy - 80) / 20) * 20;
    color = 'bg-green-500';
  } else {
    level = StrengthLevel.UNBREAKABLE;
    score = 100;
    color = 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]';
  }

  return { level, score, color, entropy };
};
