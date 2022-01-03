import Store from "./store";

describe("Store", () => {
  let store;
  let actions;
  let mutations;
  let state;

  beforeAll(() => {
    actions = {
      action1: (context, payload) => {
        context.commit("action1", payload);
      }
    }

    mutations = {
      action1: (state, payload) => {
        state.loading = payload;
        return state;
      }
    }

    state = {
      loading: false
    }

    store = new Store({
      state,
      actions,
      mutations
    });
  });

  it("rests by default", () => {
    expect(store.status).toEqual("resting");
  });

  it("takes mutations, actions and initial state", () => {
    expect(store.mutations.action1).toBeDefined();
    expect(store.actions.action1).toBeDefined();
  });

  it("modifies state with a dispatch event", () => {
    store.dispatch("action1", true);
    expect(store.state.loading).toEqual(true);
  });

  it("calls the action with a context and payload", () => {
    const mockFn = jest.fn();
    store.actions.action1 = mockFn;
    store.dispatch("action1", true);
    const context = {
      status: "action",
      mutations,
      actions,
      state,
      events: expect.any(Object)
    }
    expect(mockFn).toHaveBeenCalledWith(context, true);
  });

});
