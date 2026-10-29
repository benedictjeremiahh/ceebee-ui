import { HighlightStyle, StreamLanguage, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

/** Cosmetic tokenization only. The caller owns expression grammar and validation. */
export function expressionLanguage(variables: readonly string[], constants: readonly string[]) {
  const variableNames = new Set(variables);
  const constantNames = new Set(constants);
  return [StreamLanguage.define({
    tokenTable: { variable: tags.variableName, namedConstant: tags.constant(tags.name), invalid: tags.invalid },
    token(stream) {
      if (stream.eatSpace()) return null;
      if (stream.match(/(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)/)) return 'number';
      if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*/)) {
        const name = stream.current();
        return variableNames.has(name) ? 'variable' : constantNames.has(name) ? 'namedConstant' : 'invalid';
      }
      if (stream.match(/[+*/−-]/)) return 'operator';
      if (stream.match(/[()]/)) return 'paren';
      stream.next();
      return 'invalid';
    },
  }), syntaxHighlighting(HighlightStyle.define([
    { tag: tags.variableName, class: 'cb-expression-editor__variable' },
    { tag: [tags.number, tags.constant(tags.name)], class: 'cb-expression-editor__constant' },
    { tag: [tags.operator, tags.paren], class: 'cb-expression-editor__operator' },
    { tag: tags.invalid, class: 'cb-expression-editor__invalid' },
  ]))];
}
