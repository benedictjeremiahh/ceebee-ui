"use client";

import { Annotation, Compartment, EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { useEffect, useRef } from 'react';
import { expressionLanguage } from './expression-language.js';

export interface ExpressionEditorProps {
  value: string;
  onChange: (value: string) => void;
  variables: readonly string[];
  constants?: readonly string[];
  id?: string;
  label: string;
  describedBy?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  maxLength?: number;
}

const externalChange = Annotation.define<boolean>();
const emptyNames: readonly string[] = [];

/** CodeMirror owns editing, selection, composition, history and caret behavior. */
export function ExpressionEditor({ value, onChange, variables, constants = emptyNames,
  id, label, describedBy, required = false, disabled = false, invalid = false, maxLength,
}: ExpressionEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorView | null>(null);
  const latest = useRef({ onChange });
  latest.current = { onChange };
  const config = useRef(new Compartment());
  const language = useRef(new Compartment());
  const limit = useRef(new Compartment());
  const names = JSON.stringify([variables, constants]);

  useEffect(() => {
    if (!host.current) return;
    const view = new EditorView({ parent: host.current, state: EditorState.create({
      doc: value,
      extensions: [history(), keymap.of([...defaultKeymap, ...historyKeymap]), EditorView.lineWrapping,
        language.current.of(expressionLanguage(variables, constants)), config.current.of([]), limit.current.of([]),
        EditorView.updateListener.of(update => {
          if (update.docChanged && !update.transactions.some(transaction => transaction.annotation(externalChange))) {
            latest.current.onChange(update.state.doc.toString());
          }
        }),
      ],
    }) });
    editor.current = view;
    return () => { view.destroy(); editor.current = null; };
  }, []);

  useEffect(() => {
    const view = editor.current;
    if (view && view.state.doc.toString() !== value) view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value }, annotations: externalChange.of(true),
    });
  }, [value]);

  useEffect(() => {
    editor.current?.dispatch({ effects: language.current.reconfigure(expressionLanguage(variables, constants)) });
  }, [names]);

  useEffect(() => {
    editor.current?.dispatch({ effects: config.current.reconfigure([
      EditorState.readOnly.of(disabled), EditorView.editable.of(!disabled),
      EditorView.contentAttributes.of({ role: 'textbox', 'aria-multiline': 'true', 'aria-label': label,
        'aria-required': String(required), 'aria-invalid': String(invalid), 'aria-disabled': String(disabled),
        ...(id ? { id } : {}), ...(describedBy ? { 'aria-describedby': describedBy } : {}),
      }),
    ]) });
  }, [id, label, describedBy, required, invalid, disabled]);

  useEffect(() => {
    editor.current?.dispatch({ effects: limit.current.reconfigure(EditorState.transactionFilter.of(transaction =>
      transaction.docChanged && maxLength !== undefined && transaction.newDoc.length > maxLength ? [] : transaction)) });
  }, [maxLength]);

  return <div ref={host} className="cb-expression-editor" data-invalid={invalid || undefined} data-disabled={disabled || undefined} />;
}
