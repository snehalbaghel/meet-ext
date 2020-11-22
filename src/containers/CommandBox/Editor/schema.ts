import { Schema } from 'prosemirror-model';

/**
 * This is the schema of each individual type of node we are using with ProseMirror
 */
const commandSchema = new Schema({
  topNode: 'token',
  nodes: {
    text: { inline: true },
    token: {
      content: '(tokenGroup | text)* ',
    },
    root: {
      inline: true,
      content: 'text*',
      group: 'tokenGroup',
      attrs: {
        raw: { default: '' },
        token: {},
      },
      toDOM: (node) => {
        return ['span', { class: 'root' }, node.attrs.raw];
      },
      parseDOM: [{ tag: 'span.root' }],
    },
    key: {
      inline: true,
      group: 'tokenGroup',
      content: 'text*',
      attrs: {
        raw: { default: '' },
        token: {},
      },
      toDOM: (node) => {
        return ['span', { class: 'key' }, node.attrs.raw];
      },
      parseDOM: [{ tag: 'span.key' }],
    },
    value: {
      inline: true,
      group: 'tokenGroup',
      content: 'text*',
      attrs: {
        raw: { default: '' },
        token: {},
      },
      toDOM: (node) => {
        return ['span', { class: 'value' }, node.attrs.raw];
      },
      parseDOM: [{ tag: 'span.value' }],
    },
  },
  marks: {
    invalid: {
      toDOM() {
        return ['span', { class: 'invalid' }, 0];
      },
      parseDOM: [{ tag: 'span.invalid' }],
    },
  },
});

export default commandSchema;
