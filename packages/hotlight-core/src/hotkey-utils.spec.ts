import { getHintCharacters, depthNeeded } from "./hotkey-utils";

describe("indexToHint", () => {
  it("returns a hint based on index", () => {
    const hintCharacters = "asdfjklqwerzxc";
    expect(getHintCharacters(0, 2, hintCharacters)).toEqual("aa");
    expect(getHintCharacters(1, 2, hintCharacters)).toEqual("sa");
    expect(getHintCharacters(2, 2, hintCharacters)).toEqual("da");
    expect(getHintCharacters(2, 1, hintCharacters)).toEqual("d");
    expect(getHintCharacters(28, 2, hintCharacters)).toEqual("ad");
    expect(getHintCharacters(52, 2, hintCharacters)).toEqual("rf");
  });

});

describe("depthNeeded", () => {
  it("returns minimum number of characters needed in each hint without hints colliding, based on available characters", () => {
    const available = "abcd";
    expect(depthNeeded(available, 100)).toEqual(4);
    expect(depthNeeded(available, 4)).toEqual(1);
    expect(depthNeeded(available, 16)).toEqual(2);
    expect(depthNeeded(available, 17)).toEqual(3);
    expect(depthNeeded(available, 17)).toEqual(3);
  });
});
