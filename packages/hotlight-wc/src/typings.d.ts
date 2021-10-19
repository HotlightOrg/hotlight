export type Context = {
  query: string;
  level: number;
  parents: Action[];
  actions: Action[];
  activeActionIndex: number;
}

export type Source = (query: string) => Promise<Actions>;

export type Config = {
  isOpen?: boolean;
  //stayOpened?: boolean;
  query?: string;
  maxHits?: number;

  placeholder?: string;

  sources?: {
    [name: string]: Source;
  }

  debug?: boolean;
  //log?: boolean;

  //token?: string;
}

export type Trigger = ((query: string, context: Context) => void) | string;

export type Action = {
  title: string;
  alias?: string;
  description?: string;
  hotkeys?: string;
  category?: string;
  trigger: Trigger; // if it's a url it will be redirected
  parentTitle?: string; // if this is a sub page
}
export type Actions = Action[];
