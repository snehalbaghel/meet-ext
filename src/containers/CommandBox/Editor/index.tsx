import React from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

interface PMEditorViewProps {
  /**
   * EditorState instance to use.
   */
  editorState: EditorState;

  /**
   * Called when EditorView produces new EditorState.
   */
  onEditorState: (state: EditorState) => any;

  execute: any;
}

/**
 * Author: andreypopp (https://discuss.prosemirror.net/t/using-with-react/904)
 * This wraps ProseMirror's EditorView into React component.
 */
class ProseMirrorEditorView extends React.Component<PMEditorViewProps> {
  _editorView: EditorView | undefined;

  constructor(props: PMEditorViewProps) {
    super(props);
  }

  _createEditorView = (element: HTMLDivElement | null) => {
    if (element != null) {
      this._editorView = new EditorView(element, {
        state: this.props.editorState,
        dispatchTransaction: this.dispatchTransaction,
      });
    }
  };

  dispatchTransaction = (tx: Transaction) => {
    // In case EditorView makes any modification to a state we funnel those
    // modifications up to the parent and apply to the EditorView itself.
    const execute = tx.getMeta('action') === 'execute';
    if (execute) {
      tx.setMeta('exec', this.props.execute);
    }

    const editorState = this.props.editorState.apply(tx);

    if (this._editorView != null) {
      this._editorView.updateState(editorState);
    }
    this.props.onEditorState(editorState);
  };

  focus() {
    if (this._editorView) {
      this._editorView.focus();
    }
  }

  // TODO: Change this
  componentWillReceiveProps(nextProps: PMEditorViewProps) {
    // In case we receive new EditorState through props — we apply it to the
    // EditorView instance.
    if (this._editorView) {
      if (nextProps.editorState !== this.props.editorState) {
        this._editorView.updateState(nextProps.editorState);
        this._editorView.focus();
      }
    }
  }

  componentDidMount() {
    this.focus();
    if (this._editorView) {
      this.dispatchTransaction(
        this._editorView.state.tr.setMeta('action', 'recalculate')
      );
    }
  }

  componentWillUnmount() {
    if (this._editorView) {
      this._editorView.destroy();
    }
  }

  shouldComponentUpdate() {
    // Note that EditorView manages its DOM itself so we'd rather don't mess
    // with it.
    return false;
  }

  render() {
    // Render just an empty div which is then used as a container for an
    // EditorView instance.
    return (
      <div data-gramm_editor="false" id="editor" ref={this._createEditorView} />
    );
  }
}

export default ProseMirrorEditorView;
