import { writable } from 'svelte/store';

type ValueOf<T> = T[keyof T];
type Config = {
  placeholder: string;
  hidden: boolean;
  debug: boolean;
  transitions: boolean;
  theme: "light" | "dark" | "auto";
}

function createConfig() {
  const { subscribe, update } = writable<Config>({
    placeholder: "Yo",
    hidden: true,
    debug: true,
    transitions: true,
    theme: "auto"
  });

  return {
    subscribe,
    setEntry: (key: keyof Config, value: ValueOf<Config>) => update(obj => ({ ...obj, [key]: value })),
    show: () => update(obj => ({ ...obj, hidden: false })),
    hide: () => update(obj => ({ ...obj, hidden: true }))
  };
}

export const config = createConfig();


type SearchState = {
  query: string;
  results: any[];
  index: number;
  action: any; // current action?
  loading: boolean;
}
function createSearch() {
  const initialState = {
    query: "",
    results: [{
      title: "testing",
      trigger: () => {
        location.href = "https://fkw.se"
      }
    },{
      title: "testing2",
      trigger: () => {
        location.href = "https://fkw.se"
      }
    }],
    index: -1,
    action: null,
    loading: false
  };

  const { subscribe, set, update } = writable<SearchState>({
    ...initialState
  });

  return {
    subscribe,
    search: (value: string) => update(obj => ({ ...obj, query: value })),
    choose: (index: number) => update(obj => index < obj.results.length && index > -1 ? ({ ...obj, index }) : obj),
    reset: () => set({ ...initialState }),
    set
  };
}

export const search = createSearch();
