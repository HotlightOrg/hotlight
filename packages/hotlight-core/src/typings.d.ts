declare global {
	interface Window {
		HOTLIGHT_DEBUG: boolean;
	}
}

type ObjectKeys<T> = 
  T extends object ? (keyof T)[] :
  T extends number ? [] :
  T extends Array<any> | string ? string[] :
  never;

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>
}

export type State = {
  query: string;
  level: number;
  parents: Action[];
  actions: Action[];
  activeActionIndex: number;
  loading: boolean;
  config: Config;
}

export type Context = {
  query: string;
  level: number;
  parents: Action[];
  actions: Action[];
  activeActionIndex: number;
  loading: boolean;
}

type Payload = {
  [kye: string]: any;  
} | number | string | boolean;


type SourceResult = {
  [key: string]: any
}
type SourceResults = SourceResult[];

type RequestFunction = (query?: string, context?: Context) => Promise<Actions> | Actions;// | string;

export type Source = RequestFunction;//{
  //request?: RequestFunction | string;
  //category?: string;
  //transformResults?: (query?: string, res?: SourceResults) => Promise<Actions> | Actions;
//} ;

export type Config = {
  isOpen: boolean;
  initialQuery: string;
  maxHits: number;

  placeholder: string;

  sources: {
    [name: string]: Source;
  }

  debug?: boolean;

  //token?: string;
}

interface ActionBase {
  title: string;
  alias?: string;
  description?: string;
  arguments?: Argument[];
  hotkeys?: string;
  category?: string;
  parentTitle?: string;
  trigger: Trigger;
  [key: string]: any;
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


type TriggerFunction = (query: string, arguments: ArgumentResult, context: Context) => Promise<Actions> | Actions | [string | null, string | null] | void;
type TriggerRedirectUrl = string;
type Trigger = TriggerFunction | TriggerRedirectUrl;

type SuccessMessage = {
  headline: string;
  subHeadline: string;
}
//type Card = HTMLTemplateElement | any;

type Engine = {
  pick: () => void;
  search: (query: string) => void;
  context: Context;
  back: () => void;
}
