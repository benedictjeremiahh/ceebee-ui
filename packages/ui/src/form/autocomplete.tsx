'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLabels } from '../lib/labels.js';
import { cn, type Size } from '../lib/cn.js';
import { useFieldWiring } from './field.js';

export interface ComboboxOption {
  value: string;
  /* A string, not a ReactNode: this is what the input shows once the row is
     chosen, and an element cannot be typed into a text field. It is the one
     place Select and AutoComplete cannot agree, and the reason is the text input. */
  label: string;
  description?: ReactNode;
  disabled?: boolean;
}

/**
 * Fetches the options for a query. Receiving one puts the AutoComplete in async mode:
 * the built-in match is switched off, because whatever answered the query has
 * already decided what matches and filtering the reply again would drop rows whose
 * label does not happen to contain what was typed.
 *
 * The `signal` aborts when a newer query supersedes this one. Replies are also
 * discarded by sequence, so a slow "a" landing after a fast "abc" cannot overwrite
 * the newer list — the failure that makes an async picker show the wrong rows.
 */
export type ComboboxLoader = (query: string, signal: AbortSignal) => Promise<ComboboxOption[]>;

export interface ComboboxProps {
  /** The whole list, filtered in the browser. Omit when `loadItems` is given. */
  items?: ComboboxOption[];
  /** Asks somewhere else for the options instead of holding them all (ADR 0006). */
  loadItems?: ComboboxLoader;
  /** How long typing has to stop before `loadItems` is asked. */
  loadDelay?: number;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  /** Shown when the query matches nothing. */
  emptyMessage?: ReactNode;
  /** Shown while `loadItems` is outstanding. */
  loadingMessage?: ReactNode;
  /** Shown when `loadItems` rejects. */
  errorMessage?: ReactNode;
  size?: Size;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

/**
 * A Select you can type into. Reach for it past roughly a dozen options — below that, scanning a
 * list is faster than typing, and Select is the simpler component.
 */
export function AutoComplete({
  items,
  loadItems,
  loadDelay = 250,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Search…',
  emptyMessage = 'Nothing matched',
  loadingMessage = 'Searching…',
  errorMessage = 'Could not search',
  size = 'md',
  disabled,
  invalid,
  name,
  id,
  className,
}: ComboboxProps) {
  const field = useFieldWiring();
  const labels = useLabels();
  const async = Boolean(loadItems);
  /* The list hangs off the whole control, not off the input inside it. Left to
     anchor itself the popup measured the bare input — narrower than the box a
     person sees and inset from its left edge, so the list looked like it
     belonged to something else. */
  const shell = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  /* The chosen option, kept apart from the list it came from. In async mode the
     list is replaced by every new query, so a selection made two queries ago is
     no longer in it — and looking the value up in the current list would blank the
     input of a field that is, in fact, still set. */
  const [chosen, setChosen] = useState<ComboboxOption | null>(null);

  /* Open is held here so the list can be closed by something other than a
     click. See the note on `modal` below: the page lock it brings does not
     apply on a touch device, and there the page can still scroll out from
     under an open list. */
  const [open, setOpen] = useState(false);

  const available = async ? loaded : (items ?? []);

  /* Base UI works in whole items, not in ids. Handing it a bare string makes the input show the
     id — "id" instead of "Indonesia" — and hands the caller an object back on selection. The
     mapping happens here so the public API can stay a plain value. */
  const optionFor = (candidate: string | null | undefined) => {
    if (candidate == null) return null;
    if (chosen?.value === candidate) return chosen;
    return available.find((item) => item.value === candidate) ?? null;
  };

  /* One counter for every request this instance makes. A reply is only allowed to
     write state while it is still the newest one asked for. */
  const asked = useRef(0);
  const inFlight = useRef<AbortController | null>(null);

  const search = useCallback((query: string) => {
    if (!loadItems) return;
    const seq = asked.current + 1;
    asked.current = seq;
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    setLoading(true);
    setFailed(false);

    loadItems(query, controller.signal).then(
      (next) => {
        if (seq !== asked.current) return;
        setLoaded(next);
        setLoading(false);
      },
      () => {
        if (seq !== asked.current || controller.signal.aborted) return;
        setLoaded([]);
        setFailed(true);
        setLoading(false);
      },
    );
  }, [loadItems]);

  const [query, setQuery] = useState('');
  useEffect(() => {
    if (!async) return undefined;
    const id = setTimeout(() => search(query), loadDelay);
    return () => clearTimeout(id);
  }, [async, query, loadDelay, search]);

  /* Nothing outstanding once this instance goes away: a reply arriving after
     unmount would set state on a component that is gone. */
  useEffect(() => () => {
    asked.current += 1;
    inFlight.current?.abort();
  }, []);

  /* The page scrolling closes the list.
  
     `modal` locks the page while the list is open, which settles this on a
     pointer device — but on a touch device Base UI deliberately leaves the page
     scrollable, matching how a native picker behaves there. So on a phone the
     anchor can still slide away under whatever chrome is stuck to the top of
     the page, and the popup, being a dropdown, is drawn over that chrome. There
     is no z-index that fixes it: a dropdown opened FROM sticky chrome has to be
     above it, and one whose anchor has scrolled under it must not be.
  
     Only the page's own scroll counts. `scroll` does not bubble, so this listens
     in the capture phase and then checks what actually scrolled — the list
     inside the popup is a scroller too, and scrolling it must not close it. */
  useEffect(() => {
    if (!open) return undefined;
    const onScroll = (event: Event) => {
      const target = event.target;
      if (target === document || target === document.documentElement || target === document.body) {
        setOpen(false);
      }
    };
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => window.removeEventListener('scroll', onScroll, { capture: true });
  }, [open]);

  return (
    <BaseCombobox.Root
      items={available}
      /* Whatever answered the query already decided what matches; matching the
         reply again in the browser is how a server-side search loses rows. */
      filter={async ? null : undefined}
      onInputValueChange={async ? (next: string) => setQuery(next) : undefined}
      value={value === undefined ? undefined : optionFor(value)}
      defaultValue={defaultValue === undefined ? undefined : optionFor(defaultValue)}
      onValueChange={(next) => {
        const option = next as ComboboxOption | null;
        setChosen(option);
        onValueChange?.(option?.value ?? null);
      }}
      /* Modal, the way Select already is by default and this was not.
      
         The popup follows its anchor, and a page that scrolls takes the anchor
         with it. Measured at 390px against the app's sticky masthead: 180px of
         scroll put the field behind the header while the popup, at
         z-index: dropdown, went on being drawn over it. Base UI marks the
         anchor hidden only once it has left the viewport entirely, so there is
         a whole band of scroll where the list floats over the page chrome.
      
         Locking the page while the list is open removes the situation instead
         of styling around it, and makes the two controls that look identical in
         a filter row behave identically too. */
      modal
      open={open}
      onOpenChange={setOpen}
      isItemEqualToValue={(a: ComboboxOption, b: ComboboxOption) => a?.value === b?.value}
      itemToStringLabel={(item: ComboboxOption | string) => (typeof item === 'string' ? item : item.label)}
      disabled={disabled}
      name={name}
    >
      <div
        ref={shell}
        className={cn('cb-autocomplete', `cb-autocomplete--${size}`, className)}
        data-disabled={disabled || undefined}
      >
        <BaseCombobox.Input
          className="cb-autocomplete__input"
          placeholder={placeholder}
          id={id ?? field?.controlId}
          aria-describedby={field?.describedBy}
          aria-invalid={invalid ?? field?.invalid ? true : undefined}
        />
        <BaseCombobox.Clear className="cb-autocomplete__clear" aria-label={labels.clear}>
          <X size={14} />
        </BaseCombobox.Clear>
        <BaseCombobox.Trigger className="cb-autocomplete__trigger" aria-label={labels.open}>
          <ChevronsUpDown size={16} />
        </BaseCombobox.Trigger>
      </div>

      <BaseCombobox.Portal>
        <BaseCombobox.Positioner anchor={shell} sideOffset={6} className="cb-autocomplete__positioner">
          <BaseCombobox.Popup className="cb-autocomplete__popup">
            {/* Said, not left blank. An async list is empty while it is being
                fetched and empty when nothing matched, and those are different
                answers — showing "nothing matched" during the wait is a wrong
                one that arrives before the right one. */}
            {loading ? (
              <p className="cb-autocomplete__status" role="status">{loadingMessage}</p>
            ) : failed ? (
              <p className="cb-autocomplete__status" role="alert">{errorMessage}</p>
            ) : (
              <BaseCombobox.Empty className="cb-autocomplete__empty">{emptyMessage}</BaseCombobox.Empty>
            )}
            <BaseCombobox.List>
              {(item: ComboboxOption) => (
                <BaseCombobox.Item
                  key={item.value}
                  value={item}
                  disabled={item.disabled}
                  className="cb-autocomplete__item"
                >
                  <span className="cb-autocomplete__check">
                    <BaseCombobox.ItemIndicator>
                      <Check size={14} />
                    </BaseCombobox.ItemIndicator>
                  </span>
                  <span className="cb-autocomplete__text">
                    <span className="cb-autocomplete__label">{item.label}</span>
                    {item.description ? <span className="cb-autocomplete__description">{item.description}</span> : null}
                  </span>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}
