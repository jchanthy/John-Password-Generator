
export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

export enum StrengthLevel {
  WEAK = 'Weak',
  FAIR = 'Fair',
  GOOD = 'Good',
  STRONG = 'Strong',
  UNBREAKABLE = 'Unbreakable'
}

export interface StrengthInfo {
  level: StrengthLevel;
  score: number; // 0 to 100
  color: string;
  entropy: number;
}
