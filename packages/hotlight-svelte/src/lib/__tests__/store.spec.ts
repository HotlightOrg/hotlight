import { get } from "svelte/store";
import { config, search } from "../../store";

describe("Config store", () => {
  it("opens", () => {
    config.open();
    expect(get(config).hidden).toEqual(false);
  });

  it("closes", () => {
    config.close()
    const values = get(config);
    expect(values.hidden).toEqual(true);
    expect(get(search).query).toEqual("");
  });

  it("setEntry", () => {
    config.setEntry("maxHits", 10);
    expect(get(config).maxHits).toEqual(10);
  });
});

describe("Search store", () => {
  it("search", () => {
    search.search("test")
    expect(get(search).query).toEqual("test");
  })
});
