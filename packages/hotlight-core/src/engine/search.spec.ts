import { Actions } from "./typings";
import engine from "./search";

const slow = (q) => new Promise(r => setTimeout(() => r([{ title: q, trigger: "/" }]), 1000));

const actions: Actions = [{
  title: "My action",
  trigger: "https://atest.com"
},{
  title: "Second long action herre to test fuzzy",
  trigger: "https://second.com"
},{
  title: "funk",
  trigger: (query: string) => console.log(query)
}];

const config = {
  sources: {
    "local": () => actions
  }
};

describe("Search", () => {
  jest.useFakeTimers();

  describe("finds fuzzy", () => {
    let e;
    beforeEach(() => {
      e = engine(config);
    });
    it("finds something relevant", async () => {
      const results = await e.search("ma");
      expect(results.length).toBe(1);
      expect(results[0].title).toEqual("My action");
    });

    it("finds multiple actions", async () => {
      const results = await e.search("action");
      expect(results.length).toBe(2);
    });

    it("finds nothing", async () => {
      const results = await e.search("nothing will be found");
      expect(results.length).toEqual(0);
    });

    it('finds fuzzy as long as characters are in the same order', async () => {
      expect((await e.search("macn"))[0].title).toEqual("My action");
      expect((await e.search("scndtstfuy"))[0].title).toEqual("Second long action herre to test fuzzy");
    })

    it("returns maximum maxHits amount of hits", async () => {
      const count = 1;
      const e = engine({
        maxHits: count,
        ...config
      });
      expect((await e.search("a")).length).toEqual(count);
    });

    describe("async sources", () => {
    });
  });

  describe("activates index", () => {
    it("only if index is within range", async () => {
      const e = engine(config);
      expect((await e.search("")).length).toEqual(3);
      expect(e.activateActionIndex(1)).toEqual(true);
      expect(e.activateActionIndex(5)).toEqual(false);
    });
  });

  describe("picks actions", () => {
    it("redirects to a trigger that is a string", async () => {
      const { location } = window;
      const setHrefSpy = jest.fn(href => href);
      delete window.location;
      window.location = {};
      Object.defineProperty(window.location, 'href', {
        //get: getHrefSpy,
        set: setHrefSpy,
      });
      const e = engine(config);
      await e.search("");
      e.pick();
      expect(setHrefSpy).toHaveBeenCalledWith("https://atest.com");
      window.location = location; // reset it...
    });

    it("calls the trigger with query if the trigger is a function", async () => {
      const trigger = jest.fn();
      const a = [{
        title: "first",
        trigger
      }];

      const e = engine({
        sources: {
          source: () => a
        }
      });
      await e.search("first");
      e.activateActionIndex(1);
      e.pick();
      expect(trigger.mock.calls[0][0]).toEqual("");
    });

    xit("indicates loading slow triggers", async () => {
      const trigger = (q) => new Promise(r => setTimeout(() => r([{ title: q, trigger: "/" }]), 1000));
      const e = engine({
        sources: {
          source: () => [{
            title: "yo",
            trigger: () => actions
          }]
        }
      })
      e.search("yo");
      jest.advanceTimersByTime(2000);
      e.pick();
      expect(e.context.loading).toBe(true);
    });
  });

  describe.skip("goes back up a level", () => {});

  describe("context", () => {
    describe("loading", () => {
      it("indicates loading while resolving a source promise", async () => {
        const slow = async (query) => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve([]);
            }, 1000);
          });
        }

        const e = engine({
          sources: {
            slow
          }
        });

        e.search("yo");
        expect(e.context.loading).toBe(false);
        jest.advanceTimersByTime(201);
        expect(e.context.loading).toBe(true);
        jest.advanceTimersByTime(2000);
        //jest.runAllTimers();
        expect(e.context.loading).toBe(false);
      });
    });

    it("is available", () => {
      const e = engine(config);
      expect(e.context).toEqual({ loading: false, actions: [], activeActionIndex: 0, level: 0, parents: [], query: "" });
    });
  });
});
