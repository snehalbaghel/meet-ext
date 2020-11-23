import { Token } from '../types';
import { Meta } from '../tokens';

export interface TokenGroupArgs<M> {
  nodeType: string;
  leaf?: boolean;
  parse?: ((raw: string, props: M) => any) | undefined;
  tokens?: M[] | undefined;
  next?: TokenGroup[];
  match?: (matchStr: string, nodeType?: string) => M[];
}

/**
 * Our ProseMirror plugin talks in terms of tokens. The user talks in terms of Metas (or props)
 * This class bridges the gap.
 *
 * Represents a group of tokens that shares the same parsing/matching logic and gives the plugin
 * tokens to work with.
 */
export default class TokenGroup {
  nodeType: string;
  leaf: boolean;
  parse: (raw: string, props: Meta) => any;
  tokens: Token<Meta>[] = [];
  next: TokenGroup[] | undefined;
  match: (matchStr: string, nodeType?: string) => Token<Meta>[];

  constructor({
    nodeType,
    leaf = false,
    parse,
    tokens,
    next,
    match,
  }: TokenGroupArgs<Meta>) {
    this.nodeType = nodeType;

    this.leaf = leaf;
    this.next = next;

    if (!leaf && !next) {
      throw new Error("Non-leaf node must provide 'next' property");
    }
    this.match = match ? this.transformMatch(match) : this.defaultMatch;
    this.parse = parse ? parse : this.defaultParse;

    if (tokens) {
      tokens.map((t) => this.addToken(t));
    }
  }

  /**
   * If user has provided a cutom mathing function bind it to use this class's
   * properties to create tokens
   */
  transformMatch(
    match: (matchStr: string, nodeType?: string | undefined) => Meta[]
  ) {
    return (matchStr: string, nodeType?: string | undefined) => {
      const metas = match(matchStr, nodeType);

      return metas.map((props) => this.createToken(props));
    };
  }

  /**
   * Default matching logic. Simply looks if the name if the token starts with
   * the input (and nodeType if provided)
   */
  defaultMatch(matchInput: string, nodeType?: string): Token<Meta>[] {
    if (!nodeType || nodeType === this.nodeType) {
      return this.tokens
        .filter((token) => {
          return token.props.name.toLowerCase().startsWith(matchInput);
        })
        .map((token) => token);
    }

    return [];
  }

  defaultParse(raw: string, props: Meta) {
    return raw;
  }

  createToken(props: Meta) {
    const newToken: Token<Meta> = {
      props,
      nodeType: this.nodeType,
      leaf: this.leaf,
      parse: this.parse,
      match: this.match,
      next: this.next ? this.next : [],
    };

    return newToken;
  }

  addToken(props: Meta) {
    const newToken = this.createToken(props);
    this.tokens.push(newToken);
  }
}
