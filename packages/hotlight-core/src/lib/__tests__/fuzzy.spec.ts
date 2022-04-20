import { F, isMatch, nestedProp, firstLetterIndexes, nearestIndexesFor } from "../../fuzzy";

describe('nestedProp', () => {
  it('finds nested prop', () => {
    const o = { my: { obj: "hello" } };
    expect(nestedProp(o, "my.obj")).toEqual(["hello"]);
  });

  it('finds nested prop deep down', () => {
    const o = { my: { obj: { is: { deep: "down" } } } };
    expect(nestedProp(o, "my.obj.is.deep")).toEqual(["down"]);
  });
});

describe("firstLetterIndexes", () => {
  it("returns the first first matching letter indexes", () => {
    const x = firstLetterIndexes("jonas writes cool", "onas writes code");
    expect(x).toEqual([1, 14, 15]);
  })
});

describe("isMatch", () => {
  // sorts matches by match score ascending, ie 1 before 2
  it("matches exact", () => {
    expect(isMatch("jonte", "jonte")).toEqual(1);
  });

  it("weights close letters low", () => {
    expect(isMatch("title", "tle")).toEqual(4);
    expect(isMatch("title", "ttl")).toEqual(5);

    expect(isMatch("Kategorier", "ko")).toEqual(7);
    expect(isMatch("Kommentarer", "ko")).toEqual(3);
  });

  it("weights same number of close matches the same", () => {
    expect(isMatch("title", "tit")).toEqual(4);
    expect(isMatch("title", "tle")).toEqual(4);
  });

  it("weights more matches high", () => {
    expect(isMatch("title", "itl")).toEqual(4);
    expect(isMatch("title", "itle")).toEqual(5);
  });

  it("returns lowest first matching letter", () => {
    expect(isMatch("this sentence matches", "sent")).toEqual(5);
    expect(isMatch("sentence matches", "sent")).toEqual(5);
    expect(isMatch("yo bo", "bo")).toEqual(3);
    expect(isMatch("how does this work", "ths work")).toEqual(10);
  });

  it("does not match", () => {
    expect(isMatch("how does this work", "ths works")).toEqual(false);
    expect(isMatch("my title", "no match here")).toEqual(false);
  });
});

describe("nearestIndexesFor", () => {
  it("finds lowest indexes where two strings matches", () => {
    expect(nearestIndexesFor("title", "ile")).toEqual([1, 3, 4]);
    expect(nearestIndexesFor("test", "s")).toEqual([2]);
    expect(nearestIndexesFor("test this", "s")).toEqual([2]);
    expect(nearestIndexesFor("test this", "ts")).toEqual([0, 2]);
    expect(nearestIndexesFor("test", "se")).toEqual(false);
  });
});

describe.only("F", () => {
  it("scores hits sensibly", () => {
    const s = F([
      { title: "kategorier" },
      { title: "kommentarer" }
    ], ["title", "aliases"]);

    expect(s.search("ko")).toEqual([
      { title: "kommentarer" },
      { title: "kategorier" }
    ]);
  });
});
