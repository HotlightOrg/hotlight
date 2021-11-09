import { config } from "./config";

describe("Config", () => {
  describe("custom", () => {
    it("returns a default config", () => {
      const c = config();
      expect(c.initialQuery).toEqual("");
      expect(c.maxHits).toEqual(20);
    });

    it("merges a custom config", () => {
      const c = config({
        maxHits: 100
      });
      expect(c.maxHits).toEqual(100);
    });
  });
  
});
