import { MIN_EXTRACTED_TEXT_LENGTH } from '@/config/models';

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

export function cleanText(raw: string): string {
  let text = raw;

  // Collapse 3+ consecutive newlines into 2
  text = text.replace(/\n{3,}/g, '\n\n');

  // Collapse 3+ consecutive spaces into 1
  text = text.replace(/ {3,}/g, ' ');

  // Trim leading/trailing whitespace
  text = text.trim();

  if (text.length < MIN_EXTRACTED_TEXT_LENGTH) {
    throw new ParseError(
      'Insufficient text extracted — the file may be image-based or empty. Please upload a text-based document.'
    );
  }

  return text;
}