import { ADJECTIVES, NOUNS, type Adjective, type Noun } from "./types";

export function generatePseudonym(): string {
  const randomAdjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)] as Adjective;
  const randomNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)] as Noun;
  return `${randomAdjective}_${randomNoun}`;
}
