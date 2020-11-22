import schema from './Editor/schema';
import React from 'react';
import getCommandPlugin from './Editor/commandPlugin';
import { Transaction } from 'prosemirror-state';
import { EditorState } from 'prosemirror-state';
import { Meta } from './tokens';
import { Token, ParsedCommand } from './types';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import PMEditorView from './Editor';
import { connect } from 'react-redux';
// import { RootState } from '../../store/types';
// import { setCommand } from '../../store/actions';

interface CommandLineProps {
  popup: (open: boolean, suggestions?: Token<Meta>[], i?: number) => any;
  updateSelection: (i: number) => any;
  execute: (stack: ParsedCommand, cmd: string) => boolean;
  commandAry: string[] | undefined;
  setCommand: (cmd: string[] | undefined) => any;
}

// TODO: type
const mapStateToProps = (state: any) => ({
  commandAry: [],
});

const mapDispatchToProps = (dispatch: any) => ({
  setCommand: (cmd: string[] | undefined) => {
    // TODO: dispatch
    // dispatch(setCommand(cmd));
  },
});

let resetFlag = false;

class RichTextEditor extends React.Component<CommandLineProps> {
  state: { editorState: EditorState };
  view: any;

  constructor(props: CommandLineProps) {
    super(props);
    this.state = {
      editorState: EditorState.create({
        schema,
        plugins: [
          getCommandPlugin(this.props.popup, this.props.updateSelection),
          history(),
          keymap({
            'Mod-z': undo,
            'Mod-Shift-z': redo,
            'Shift-Enter': this.executeTr,
            'Mod-Space': this.recalculateSuggestions,
            'Mod-u': this.resetState,
          }),
        ],
      }),
    };
    this.view = React.createRef();
  }

  componentDidUpdate() {
    if (this.props.commandAry) {
      const cmd = this.props.commandAry;
      const tr = this.state.editorState.tr;

      if (!resetFlag) {
        tr.deleteRange(0, this.state.editorState.doc.content.size).setMeta(
          'action',
          'reset'
        );
        resetFlag = true;
        this.dispatchTransaction(tr);
      } else if (cmd.length) {
        if (cmd[0] === ';') {
          this.dispatchTransaction(
            this.state.editorState.tr.setMeta('action', 'execute')
          );

          this.dispatchTransaction(this.resetCmd(this.state.editorState));

          resetFlag = false;
          this.props.setCommand(undefined);
          return;
        }

        tr.insertText(cmd[0]);

        this.dispatchTransaction(tr);

        cmd.splice(0, 1);

        if (cmd.length) {
          this.props.setCommand(cmd);
        } else {
          resetFlag = false;
          this.props.setCommand(undefined);
        }
      }
    }
  }

  recalculateSuggestions(
    state: EditorState,
    dispatch: ((tr: Transaction) => void) | undefined
  ): boolean {
    const recalculateTr = state.tr.setMeta('action', 'recalculate');
    dispatch && dispatch(recalculateTr);
    return true;
  }

  executeTr<S extends Schema = any>(
    state: EditorState<S>,
    dispatch: ((tr: Transaction<S>) => void) | undefined
  ): boolean {
    if (dispatch) {
      const exTr = state.tr.setMeta('action', 'execute');
      dispatch(exTr);

      // Reset state
      const resetTr = state.tr
        .deleteRange(0, state.doc.content.size)
        .setMeta('action', 'reset');

      dispatch(resetTr);
    }
    return true;
  }

  resetState<S extends Schema = any>(
    state: EditorState<S>,
    dispatch: ((tr: Transaction<S>) => void) | undefined
  ): boolean {
    const resetTr = state.tr
      .deleteRange(0, state.doc.content.size)
      .setMeta('action', 'reset');

    dispatch && dispatch(resetTr);

    return true;
  }

  resetCmd(state: EditorState): Transaction {
    return state.tr
      .deleteRange(0, state.doc.content.size)
      .setMeta('action', 'reset');
  }

  // Use with menus
  dispatchTransaction = (tx: any) => {
    const execute = tx.getMeta('action') === 'execute';
    if (execute) {
      tx.setMeta('exec', this.props.execute);
    }

    const editorState = this.state.editorState.apply(tx);
    this.setState({ editorState });
  };

  onEditorStateChange = (editorState: EditorState) => {
    this.setState({ editorState });
  };

  render() {
    const { editorState } = this.state;
    return (
      <PMEditorView
        ref={this.view}
        editorState={editorState}
        onEditorState={this.onEditorStateChange}
        execute={this.props.execute}
      ></PMEditorView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RichTextEditor);
