import TokenGroup from './Editor/TokenGroup';

export interface Token<M> {
  props: M; // Props to autocomplete
  nodeType: string; // schema
  leaf: boolean; // should it fallback to prev item's match()
  next: TokenGroup[]; // List your token groups here for magic or use match function
  parse: (raw: string, props: M) => any; // Shift + enter
  match: (matchStr: string, nodeType?: string | undefined) => Token<M>[]; // ctrl + space ?
}

export interface ParsedCommand {
  cmd: string;
  keyVals: {
    key: string;
    val: any;
    entity: string;
  }[];
  flags: string[];
}
