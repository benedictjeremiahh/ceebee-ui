"use client";

import { Popover as BasePopover } from '@base-ui/react/popover';
import { type ChangeEvent, type KeyboardEvent, type ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useFieldWiring } from '../field.js';
import { MentionsSkeleton } from './mentions.skeleton.js';

export interface MentionOption {
  /** Stable text inserted after the trigger character. */
  value: string;
  label: ReactNode;
  searchText?: string;
  disabled?: boolean;
}

export interface MentionsProps {
  options: MentionOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  trigger?: string;
  separator?: string;
  placeholder?: string;
  rows?: number;
  name?: string;
  disabled?: boolean;
  motion?: boolean;
}

interface MentionQuery {
  start: number;
  end: number;
  text: string;
}

function queryAtCaret(value: string, caret: number, trigger: string): MentionQuery | null {
  const prefix = value.slice(0, caret);
  const triggerIndex = prefix.lastIndexOf(trigger);
  if (triggerIndex < 0) return null;
  const beforeTrigger = prefix.slice(0, triggerIndex);
  const text = prefix.slice(triggerIndex + trigger.length);
  if ((beforeTrigger && !/\s$/.test(beforeTrigger)) || /\s/.test(text)) return null;
  return { start: triggerIndex, end: caret, text };
}

function normalizeTrigger(trigger: string) {
  if (Array.from(trigger).length !== 1) {
    throw new RangeError('Mentions trigger must be exactly one character.');
  }
  return trigger;
}

function validateOptions(options: MentionOption[]) {
  const values = new Set<string>();
  for (const option of options) {
    if (values.has(option.value)) throw new RangeError('Mentions options require unique values.');
    values.add(option.value);
  }
}

function matchingOptions(options: MentionOption[], query: MentionQuery | null) {
  if (!query) return [];
  const needle = query.text.toLocaleLowerCase();
  return options.filter((option) => (option.searchText ?? option.value).toLocaleLowerCase().includes(needle));
}

/** Inline textarea editing with an anchored mention-list contract, not a text-field combobox. */
function MentionsRoot({
  options,
  value,
  defaultValue = '',
  onValueChange,
  trigger = '@',
  separator = ' ',
  placeholder,
  rows = 3,
  name,
  disabled = false,
  motion = true,
}: MentionsProps) {
  const field = useFieldWiring();
  const listboxId = useId();
  const normalizedTrigger = normalizeTrigger(trigger);
  validateOptions(options);
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const text = controlled ? value : internalValue;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState<MentionQuery | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const isComposingRef = useRef(false);

  const matches = useMemo(() => matchingOptions(options, query), [options, query]);
  const enabledMatches = useMemo(() => matches.filter((option) => !option.disabled), [matches]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query?.start, query?.text, matches.length]);

  useEffect(() => {
    if (!disabled) return;
    setOpen(false);
    setQuery(null);
  }, [disabled]);

  const updateText = (next: string) => {
    if (!controlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const updateQuery = (nextText = text, caret = textareaRef.current?.selectionStart ?? nextText.length) => {
    if (disabled || isComposingRef.current) {
      setQuery(null);
      setOpen(false);
      return;
    }
    const nextQuery = queryAtCaret(nextText, caret, normalizedTrigger);
    setQuery(nextQuery);
    setOpen(Boolean(matchingOptions(options, nextQuery).some((option) => !option.disabled)));
  };

  const selectOption = (option: MentionOption) => {
    if (disabled || !query || option.disabled) return;
    const inserted = `${normalizedTrigger}${option.value}${separator}`;
    const next = `${text.slice(0, query.start)}${inserted}${text.slice(query.end)}`;
    const caret = query.start + inserted.length;
    updateText(next);
    setQuery(null);
    setOpen(false);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(caret, caret);
    });
  };

  const moveActive = (amount: number) => {
    if (enabledMatches.length === 0) return;
    setActiveIndex((current) => (current + amount + enabledMatches.length) % enabledMatches.length);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    updateText(next);
    if (disabled || isComposingRef.current) return;
    const nextQuery = queryAtCaret(next, event.target.selectionStart, normalizedTrigger);
    setQuery(nextQuery);
    setOpen(Boolean(nextQuery && options.some((option) => !option.disabled && (option.searchText ?? option.value).toLocaleLowerCase().includes(nextQuery.text.toLocaleLowerCase()))));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposingRef.current || event.nativeEvent.isComposing) return;
    if (!open) return;
    if (event.key === 'Tab') {
      // Let the browser advance focus through the document; close the portalled list first so
      // its implementation focus guards cannot become part of the textarea's Tab sequence.
      setOpen(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === 'Enter') {
      const active = enabledMatches[activeIndex];
      if (active) {
        event.preventDefault();
        selectOption(active);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  };

  const activeOption = enabledMatches[activeIndex];

  return (
    <BasePopover.Root open={open} onOpenChange={setOpen}>
      <div ref={anchorRef} className={`cb-mentions${!motion ? ' cb-mentions--motionless' : ''}`} data-disabled={disabled || undefined}>
        <textarea
          ref={textareaRef}
          className="cb-mentions__textarea"
          id={field?.controlId}
          name={name}
          value={text}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          required={field?.required}
          aria-describedby={field?.describedBy}
          aria-invalid={field?.invalid || undefined}
          aria-autocomplete="list"
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={open && activeOption ? `${listboxId}-option-${matches.indexOf(activeOption)}` : undefined}
          onChange={handleChange}
          onSelect={() => updateQuery()}
          onFocus={() => updateQuery()}
          onCompositionStart={() => {
            isComposingRef.current = true;
            setQuery(null);
            setOpen(false);
          }}
          onCompositionEnd={(event) => {
            isComposingRef.current = false;
            updateQuery(event.currentTarget.value, event.currentTarget.selectionStart);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
      <BasePopover.Portal>
        <BasePopover.Positioner anchor={anchorRef} side="bottom" align="start" className="cb-mentions__positioner">
          <BasePopover.Popup className={`cb-mentions__popup${!motion ? ' cb-mentions__popup--motionless' : ''}`} initialFocus={false} finalFocus={false}>
            <div className="cb-mentions__list" id={listboxId} role="listbox" aria-label="Mention suggestions">
              {matches.map((option, matchIndex) => {
                const index = enabledMatches.indexOf(option);
                const active = index === activeIndex;
                return (
                  <button
                    type="button"
                    role="option"
                    id={`${listboxId}-option-${matchIndex}`}
                    key={`${option.value}-${matchIndex}`}
                    className="cb-mentions__option"
                    disabled={option.disabled}
                    tabIndex={-1}
                    aria-selected={active}
                    data-active={active || undefined}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

export const Mentions = Object.assign(MentionsRoot, { Skeleton: MentionsSkeleton });
