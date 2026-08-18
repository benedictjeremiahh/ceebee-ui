'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { filterCommands, groupCommands, type Command } from './command.util.js';

export interface PaletteCommand extends Command {
  icon?: ReactNode;
  onRun: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: PaletteCommand[];
  placeholder?: string;
  emptyMessage?: ReactNode;
  className?: string;
}

/**
 * Search over actions. The list is the app's — the palette ranks, renders, and runs, and knows
 * nothing about what a command does.
 */
export function CommandPalette({
  open,
  onOpenChange,
  commands,
  placeholder = 'Type a command…',
  emptyMessage = 'No matching command',
  className,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => filterCommands(commands, query), [commands, query]);
  const groups = useMemo(() => groupCommands(results), [results]);

  // Reopening should not resume someone else's half-typed query.
  useEffect(() => {
    if (!open) {
      setQuery('');
      setActive(0);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const run = (command: PaletteCommand) => {
    onOpenChange(false);
    command.onRun();
  };

  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="cb-dialog__backdrop" />
        <BaseDialog.Popup className={cn('cb-palette', className)} aria-label="Command palette">
          <div className="cb-palette__search">
            <Search size={16} className="cb-palette__search-icon" />
            <input
              className="cb-palette__input"
              value={query}
              placeholder={placeholder}
              autoFocus
              role="combobox"
              aria-expanded
              aria-controls="cb-palette-list"
              aria-activedescendant={results[active] ? `cb-palette-${results[active]!.id}` : undefined}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  setActive((index) => Math.min(index + 1, results.length - 1));
                  event.preventDefault();
                }
                if (event.key === 'ArrowUp') {
                  setActive((index) => Math.max(index - 1, 0));
                  event.preventDefault();
                }
                if (event.key === 'Enter' && results[active]) {
                  run(results[active]!);
                  event.preventDefault();
                }
              }}
            />
          </div>

          <div className="cb-palette__list" id="cb-palette-list" role="listbox">
            {results.length === 0 ? (
              <p className="cb-palette__empty">{emptyMessage}</p>
            ) : (
              groups.map((group) => (
                <div className="cb-palette__group" key={group.group ?? 'ungrouped'}>
                  {group.group ? <p className="cb-palette__group-label">{group.group}</p> : null}
                  {group.items.map((command) => {
                    const index = results.indexOf(command);
                    return (
                      <div
                        key={command.id}
                        id={`cb-palette-${command.id}`}
                        role="option"
                        aria-selected={index === active}
                        className="cb-palette__item"
                        data-active={index === active || undefined}
                        onMouseMove={() => setActive(index)}
                        onClick={() => run(command)}
                      >
                        <span className="cb-palette__icon">{command.icon}</span>
                        <span className="cb-palette__label">{command.label}</span>
                        {command.shortcut ? <kbd className="cb-palette__shortcut">{command.shortcut}</kbd> : null}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
