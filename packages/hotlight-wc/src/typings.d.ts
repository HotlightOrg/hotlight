export type Context = {
  query: string;
  level: number;
  parents: Action[];
  actions: Action[];
  activeActionIndex: number;
}

type SourceResult = {
  [key: string]: any
}
type SourceResults = SourceResult[];

type RequestFunction = (query?: string, context?: Context) => Promise<Actions> | Actions | string;
export type Source = {
  request?: RequestFunction | string;
  category?: string;
  transformResults?: (query?: string, res?: SourceResults) => Promise<Actions> | Actions;
} | RequestFunction;

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

interface ActionBase {
  title: string;
  alias?: string;
  description?: string;
  arguments?: Argument[];
  hotkeys?: string;
  category?: string;
  parentTitle: string;
  trigger: Trigger;
}

export type Action = ActionBase; //ActionWithParent | ActionWithTrigger;// | (ActionWithTrigger & ActionWithParent);
export type Actions = Action[];

export type ActionResults = Promise<Action[]> | Action[] | SuccessMessage; // Card;

type OptionsFunction = (query: string) => Option[] | Promise<Option[]>;
type Option = {
  label: string;
  value: string | boolean | number;
}
type Options = Option[] | OptionsFunction;

type ArgumentValidator = (value: string) => [string | null, string | null];

type ArgumentObject = {
  placeholder: string;
  key?: string;
  validator?: ArgumentValidator;
  options?: Options;
}
type ArgumentFunction = (query: string) => ArgumentObject;
type ArgumentName = string;
type Argument = ArgumentObject | ArgumentFunction | ArgumentName;
type ArgumentResult = {
  [key: string]: string | number | boolean;
}


type TriggerFunction = (query: string, arguments: ArgumentResult, context: Context) => Action[] | [string | null, string | null];
type TriggerRedirectUrl = string;
type Trigger = TriggerFunction | TriggerRedirectUrl;

type SuccessMessage = {
  headline: string;
  subHeadline: string;
}
//type Card = HTMLTemplateElement | any;


