import { writeCache, readCache, readByQuery } from "./cache";

describe("Cache", () => {
  it("writes and reads results on a source/query key basis", () => {
    writeCache("my source", "my query", [{ title: "yo", trigger: "/" }]);
    expect(readCache("my source", "my query")).toEqual([{ title: "yo", trigger: "/" }]);
  })

  it("returns all results from a source", () => {
    const s1 = [{ title: "yoo", trigger: "/" }]
    const s2 = [{ title: "boo", trigger: "/" }]
    writeCache("source1", "q", s1);
    writeCache("source2", "q", s2);
    expect(readByQuery("q").length).toEqual(2);
    expect(readByQuery("q")).toEqual([...s1, ...s2]);
  });
});
