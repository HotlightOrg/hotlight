
const SECONDARY = "abcdefghijklmnopqrstuvxyz";

export const availableCharacters = (preferred: string, taken: string[]): string => {
  let available = preferred.split("").filter(c => !taken.includes(c));
  let availableSecondary = SECONDARY.split("").filter(c => !taken.includes(c) && !preferred.includes(c))

  if(available.length >= 8) return available.join("");

  do {
    available.push(availableSecondary.shift());
  } while (available.length < 8);
  
  return available.join("");
}

export const depthNeeded = (available: string, foundCount: number): number => {
  return Math.ceil(Math.log(foundCount) / Math.log(available.length));
}

export const getHintCharacters = (index: number, numHintDigits: number, characters: string) => {
  const base = characters.length;
  let hint = [];
  let remainder = 0;

  do {
    remainder = index % base;

    hint.unshift(characters[remainder]);

    index -= remainder;
    index /= base;
  } while (index > 0);

  for (let i = 0; i < numHintDigits - hint.length; i++)
    hint.unshift(characters[0]);

  return hint.reverse().join("");
}

