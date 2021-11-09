import engine from "./fuzzy";
import { underscore, triggerIcon, truncate, truncatePath } from "./utils";

const actions = [{
  title: "My action",
  trigger: "https://atest.com"
},{
  title: "Second long action herre to test fuzzy",
  trigger: "https://second.com"
}]

describe('search', () => {
  it('finds fuzzy', () => {
    const e = engine(actions);
    expect(e.search("act")[0].title).toEqual(actions[0].title);
    expect(e.search("o").length).toEqual(2);
  })

  it('returns top 20 actions by default', () => {
    const action = { title: "action title", trigger: "https://test-domain.com" };
    const actions = Array.from(new Array(100)).map(_ => action);
    const e = engine(actions);
    expect(e.search("a").length).toEqual(20);
  })

  it('finds fuzzy as long as characters are in the same order', () => {
    const e = engine(actions);
    expect(e.search("macn")[0].title).toEqual("My action");
    expect(e.search("scndtstfuy")[0].title).toEqual("Second long action herre to test fuzzy");
  })

  it('excludes actions with parents', () => {
    const e = engine([{ title: "action", parentTitle: "parent" }]);
    expect(e.search("a").length).toEqual(0);
  });

  it('prioritizes actions that has hotkeys first', () => {
    const e = engine([
      { title: "action" },
      { title: "action", hotkeys: "a" },
      { title: "action" },
    ]);

    expect(e.search("a")[0].hotkeys).toEqual("a");
  });

  describe('context', () => {
    it('picks an action and returns the context', () => {
      const actions = [
        { title: "action", trigger: () => {} },
        { title: "action", hotkeys: "a", trigger: () => {} },
        { title: "action", trigger: () => {} },
      ]
      const e = engine(actions);
      const { context } = e.pick(actions[0], "ac");
      expect(context.level).toEqual(0);
      expect(context.parents).toEqual([]);
      expect(context.actions).toEqual(actions);
    })

    it('picks a parent action and goes one level down to the child in the context', () => {
      const actions = [
        { title: "parent", trigger: () => {} },
        { title: "child", parentTitle: "parent", trigger: () => {} },
        { title: "childchild", parentTitle: "child", trigger: () => {} },
      ];
      const e = engine(actions);

      expect(e.pick(actions[0]).levelHits).toEqual([actions[1]]);
      expect(e.pick(actions[1]).levelHits).toEqual([actions[2]]);
    });

    it('returns keepOpen if the modal should be kept open and children are present', () => {
      const actions = [
        { title: "parent", trigger: () => {} },
        { title: "child", parentTitle: "parent", trigger: () => {} },
        { title: "childchild", trigger: () => {} },
      ];
      const e = engine(actions);

      expect(e.pick(actions[0]).keepOpen).toEqual(true);
      expect(e.pick(actions[2]).keepOpen).toEqual(false);
    });

    it('goes back up one level', () => {
      const actions = [
        { title: "parent", trigger: () => {} },
        { title: "child", parentTitle: "parent", trigger: () => {} },
        { title: "childchild", parentTitle: "child", trigger: () => {} },
      ];

      const e = engine(actions);
      e.pick(actions[0]);

      expect(e.pick(actions[1]).context.parents.length).toEqual(2);
      expect(e.getContext().level).toEqual(2);
      e.back()
      expect(e.getContext().level).toEqual(1);
      expect(e.pick(actions[1]).context.parents.length).toEqual(2);
      expect(e.getContext().level).toEqual(2);
    });
    
  });

});

describe('underscore', () => {
  it('undersores overlapping characters', () => {
    expect(underscore('hlowd', 'hello world')).toEqual('<span class="u">h</span>e<span class="u">l</span>l<span class="u">o</span> <span class="u">w</span>orl<span class="u">d</span>');
    expect(underscore('x', 'hello world')).toEqual('hello world');
    expect(underscore('H', 'hel')).toEqual('<span class="u">h</span>el');
    expect(underscore('hl', 'hell')).toEqual('<span class="u">h</span>e<span class="u">l</span>l');
    expect(underscore('svelte', 'hotlight and svelte')).toEqual('hotlight and <span class="u">s</span><span class="u">v</span><span class="u">e</span><span class="u">l</span><span class="u">t</span><span class="u">e</span>');
  });
});

describe('triggerIcon', () => {
  it('returns an icon that indicates action', () => {
    expect(triggerIcon(() => {})).toEqual({ icon: "action", path: null });
  });
  it('returns an icon that indicates external link', () => {
    expect(triggerIcon("https://external-domain.com/x")).toEqual({ icon: "external", path: "external-domain.com/x" });
  });
  it('returns icon that indicates internal link', () => {
    expect(triggerIcon("/x")).toEqual({ icon: "internal", path: "/x" });
    expect(triggerIcon("http://testing.stenciljs.com/x")).toEqual({ icon: "internal", path: "/x" }); // local host during test
  })
});

describe('truncate', () => {
  it('truncates by default', () => {
    const str = "this is a sentence of about x2 characters";
    expect(truncate(str)).toEqual("thi...ters");
  });
  it('truncates by default', () => {
    const str = "this is a sentence of about x2 characters";
    expect(truncate(str, 15)).toEqual("this i...acters");
  })
});

describe('truncate pathname', () => {
  it('truncates paths and shows last suffix path', () => {
    const path = "/first/second/third/fourth";
    expect(truncatePath(path, 15)).toEqual("/first/../../fourth");
    expect(truncatePath(path, 10)).toEqual("/../../../fourth");
    expect(truncatePath(path, 30)).toEqual("/first/second/third/fourth");
  });
})
