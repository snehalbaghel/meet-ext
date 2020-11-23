import { Plugin, PluginKey } from 'prosemirror-state';
import { Token, ParsedCommand } from '../types';
import { Meta } from '../tokens';
import RootTokenGroups from '../tokens';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

/**
 * Plugins state
 */
export interface CommandState {
  text: string;
  rootCommand: string;
  popup: boolean;
  cursorPos: number;
  activeSelection: {
    to: number;
    from: number;
  };
  activeSelectionIndex: number;
  suggestions: Token<Meta>[];
  prevTrigger: string | null;
  token: string;
}

/**
 * Reset plugin state
 */
function resetState() {
  return {
    text: '',
    popup: false,
    cursorPos: 0,
    activeSelection: {
      to: 0,
      from: 0,
    },
    activeSelectionIndex: 0,
    suggestions: RootTokenGroups.flatMap((tg) => {
      return tg.match('', 'root');
    }),
    rootCommand: '',
    prevTrigger: null,
    token: '',
  };
}

const lastTokenRegex = /(?<rest>.*?)(?<trigger>\s{2}|[\s:,]{0,1})(?<token>(?<=[:,])\w+[\s\w(.@-]+\)?|\w+)?$/;

/**
 * Basically the middleware responsible for reacting to text and creating nodes accordingly
 * API: https://prosemirror.net/docs/ref/#state.Plugin_System
 */
const getCommandPlugin = (
  popup: (open: boolean, suggestions?: Token<Meta>[], i?: number) => any,
  updateSelection: (i: number) => any
) => {
  function getNodeStack(doc: Node) {
    const nodes: Node[] = [];

    doc.descendants((node) => {
      if (!node.isText) {
        nodes.push(node);
      }
    });

    return nodes;
  }

  // If you type a command that is an exact matche and press enter
  // the plugin will apply the node and then try to appy it again when you press
  // space so we just use this flag to say that the node has already
  // been applied so we dont have to do it again
  let applied: boolean = false;

  /**
   * TODO: Move this outside
   * Finds the last relevent token and suggests next tokens
   */
  function getSuggestions(nodeStack: Node[], match: string, trigger?: string) {
    const commandStack: Token<Meta>[] = nodeStack.map((n) => n.attrs.token);
    const lastIndex = commandStack.length - 1;
    let curIndex = lastIndex;
    let token = commandStack[curIndex];
    match = match.toLowerCase();

    // Note: Flags are disabled
    // if (trigger === '~') {
    //   return RootTokenGroups.flatMap((tg) => {
    //     return tg.match(match, 'flag');
    //   });
    // }
    if (curIndex !== -1) {
      if ([',', ':'].includes(trigger!)) {
        token =
          commandStack
            .slice()
            .reverse()
            .find((t) => t.nodeType === 'key') || token;
      } else {
        token = commandStack[0];
      }

      if (token.next.length) {
        return token.next.flatMap((tg) => tg.match(match));
      }
    } else {
      return RootTokenGroups.flatMap((tg) => tg.match(match, 'root'));
    }
  }

  return new Plugin({
    key: new PluginKey('command'),
    view() {
      return {
        update: (view: EditorView, _prevState) => {
          // @ts-ignore
          const pState: CommandState = this.key?.getState(view.state);
          popup(
            pState.popup || false,
            pState.suggestions,
            pState.activeSelectionIndex
          );
          updateSelection(pState.activeSelectionIndex);
        },
      };
    },
    state: {
      init(_config, _instance): CommandState {
        return resetState();
      },
      // apply tr to produce new state
      apply(tr, state: CommandState) {
        const cursorPos = tr.selection.to;
        const text = tr.doc.textBetween(0, cursorPos);
        let newState: Partial<CommandState> = {};
        const commandMatch = text.match(lastTokenRegex);
        newState.cursorPos = cursorPos;
        newState.token = commandMatch?.groups?.token || '';

        const action = tr.getMeta('action');

        /**
         * User actions are coded here
         */
        if (action) {
          if (action === 'execute') {
            /**
             * When you press shift+enter
             * Parse and return
             * TODO: Move this into a function
             */
            const rawValues: any[] = [];
            const triggers: string[] = [];
            const stack = getNodeStack(tr.doc);

            /* Gather all the raw values */
            tr.doc.descendants((node, _pos) => {
              if (node.isText) {
                triggers.push(node.text || '');
              } else {
                rawValues.push(node.attrs.raw);
              }
            });

            const parsed: ParsedCommand = {
              cmd: rawValues[0],
              keyVals: [],
              flags: [],
            };
            /* Remove root command from the stacks */
            stack.splice(0, 1);
            rawValues.splice(0, 1);
            let lastKey: null | number = null;

            /* I know this is not how you do stacks.
            pls forgive me but im not renaming them now */
            stack.forEach((node, i) => {
              const token = node.attrs.token;

              const parsedValue = token.parse(rawValues[i], token.props);
              const nodeType = token.nodeType;

              if (nodeType === 'key') {
                lastKey = parsed.keyVals.length;
                parsed.keyVals.push({
                  key: parsedValue,
                  entity: token.props.entity,
                  val: '',
                });
              } else if (nodeType === 'value') {
                if (lastKey !== null) {
                  const lastKeyValsValObj = parsed.keyVals[lastKey].val;
                  if (triggers[i] === ':') {
                    parsed.keyVals[lastKey].val = [parsedValue];
                  } else if (triggers[i] === ',') {
                    // for multiple values   ^ duh!
                    lastKeyValsValObj.push(parsedValue);
                    parsed.keyVals[lastKey].val = lastKeyValsValObj;
                  }
                } else {
                  parsed.keyVals.push({
                    key: 'unknown',
                    entity: token.props.entity,
                    val: parsedValue,
                  });
                }
              } else if (nodeType === 'flag') {
                lastKey = null;
                parsed.flags.push(parsedValue);
              } else {
                console.error('unknown node type:', nodeType);
              }
            });

            const exec = tr.getMeta('exec');
            exec(parsed, tr.doc.textContent);
          } else if (action === 'recalculate') {
            const trigger = commandMatch?.groups?.trigger;
            const token = commandMatch?.groups?.token;
            const nodeStack = getNodeStack(tr.doc);

            newState.suggestions = getSuggestions(
              nodeStack,
              token || '',
              trigger
            );
            newState.activeSelectionIndex = 0;
          } else if (action === 'reset') {
            newState = resetState();
          }
        } else if (commandMatch) {
          const token = commandMatch?.groups?.token;
          const trigger = commandMatch?.groups?.trigger;

          const nodeStack = getNodeStack(tr.doc);

          /* Set active selection */
          const to = cursorPos;
          const from = to - (token?.length || 0);

          newState.activeSelection = {
            to,
            from,
          };

          newState.suggestions = getSuggestions(
            nodeStack,
            token || '',
            trigger
          );
          newState.activeSelectionIndex = 0;

          newState.prevTrigger = state.prevTrigger === ',' ? ',' : trigger;
        }

        if (newState.suggestions && newState.suggestions.length > 0) {
          newState.popup = true;
        } else {
          newState.popup = false;
        }

        return { ...state, ...newState };
      },
    },
    props: {
      handleKeyDown(view, e) {
        // don't handle if no suggestions or not in active mode
        // @ts-ignore
        const state: CommandState = this.getState(view.state);

        // const newState: CommandState = state;
        if (!state.popup || !state.suggestions.length) {
          return false;
        }

        const enter = e.code === 'Enter';
        const down = e.code === 'ArrowDown';
        const up = e.code === 'ArrowUp';
        const esc = e.code === 'Escape';

        if (up) {
          // Prev
          let i = state.activeSelectionIndex;
          i = (i - 1 + state.suggestions.length) % state.suggestions.length;
          state.activeSelectionIndex = i;

          // TODO: PLEASE REFACTOR THIS FFS!
          // Use NodeView
          updateSelection(state.activeSelectionIndex);

          return true;
        } else if (down) {
          // Next
          let i = state.activeSelectionIndex;
          i = (i + 1 + state.suggestions.length) % state.suggestions.length;
          state.activeSelectionIndex = i;
          updateSelection(state.activeSelectionIndex);

          return true;
        } else if (enter) {
          const token = state.suggestions[state.activeSelectionIndex];
          const nodeType = token.nodeType;
          const node: Node = view.state.schema.nodes[nodeType].create({
            raw: token.props.name,
            token,
          });
          let nextTrigger = '';
          /* Autocomplete triggers */
          if (nodeType === 'key') {
            nextTrigger = ':';
          } else if (['root', 'flag'].includes(nodeType)) {
            nextTrigger = ' ';
          }
          applied = true;
          let tr = view.state.tr.replaceWith(
            state.activeSelection.from,
            state.activeSelection.to,
            node
          );

          tr = tr.insertText(nextTrigger);
          view.dispatch(tr);

          return true;
        } else if (esc) {
          updateSelection(0);
          return true;
        }

        // TODO
        return false;
      },
    },
    appendTransaction(_transactions, oldState, newState) {
      // @ts-ignore
      const state: CommandState = newState[this.key];
      // @ts-ignore
      const prevState = oldState[this.key];

      if (prevState.suggestions && prevState.suggestions.length && !applied) {
        let shouldReplace =
          prevState.token &&
          prevState.suggestions[0].props.name.toLowerCase() ===
            prevState.token.toLowerCase();

        if (
          prevState.suggestions[0].props.freeText &&
          state.prevTrigger !== ',' &&
          !state.token.endsWith(' ')
        ) {
          shouldReplace = false;
        }

        if (state.prevTrigger === ',' && prevState.prevTrigger === ',') {
          if (
            state.token.startsWith(prevState.token) &&
            !state.token.endsWith(' ')
          ) {
            shouldReplace = false;
          }
        }

        if (shouldReplace) {
          const token = prevState.suggestions[0];
          const nodeType = token.nodeType;
          const node: Node = newState.schema.nodes[nodeType].create({
            raw: token.props.name,
            token,
          });
          try {
            const tr = newState.tr.replaceWith(
              prevState.activeSelection.from,
              prevState.activeSelection.to,
              node
            );
            return tr;
          } catch (error) {
            // Range-error
            // Happens for eg when you type and entire token but hit backspace
            // Eg type: 'm''e''e''t'[Backspace]
            // We can just ignore this cause it doesnt affect the behaviour and return nothing

            console.info("Didn't replace token");
          }

          return null;
        }
      }

      applied = false;
    },
  });
};

export default getCommandPlugin;
