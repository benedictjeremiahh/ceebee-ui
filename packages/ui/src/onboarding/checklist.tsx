'use client';

import { Check, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { Progress } from 'antd';

export interface ChecklistTask {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  done?: boolean;
  onSelect?: () => void;
}

export interface ChecklistProps {
  title?: ReactNode;
  tasks: ChecklistTask[];
  /** Rendered once every task is done — the reason the checklist can go away. */
  completeSlot?: ReactNode;
  className?: string;
}

/**
 * Getting-started tasks with progress. Which tasks are done is the app's knowledge, passed in —
 * the library does not track anyone's account state, the same rule the Seen Store follows
 *.
 */
export function Checklist({ title = 'Get started', tasks, completeSlot, className }: ChecklistProps) {
  const done = tasks.filter((task) => task.done).length;
  const complete = tasks.length > 0 && done === tasks.length;

  return (
    <section className={cn('cb-checklist', className)} aria-label={typeof title === 'string' ? title : 'Checklist'}>
      <header className="cb-checklist__head">
        <p className="cb-checklist__title">{title}</p>
        <span className="cb-checklist__count">
          {done} of {tasks.length}
        </span>
      </header>

      <Progress
        percent={(done / Math.max(tasks.length, 1)) * 100}
        size="small"
        showInfo={false}
        aria-label={`${done} of ${tasks.length} tasks done`}
      />

      {complete && completeSlot ? (
        <div className="cb-checklist__complete">{completeSlot}</div>
      ) : (
        <ul className="cb-checklist__list">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                className="cb-checklist__task"
                data-done={task.done || undefined}
                onClick={task.onSelect}
                disabled={!task.onSelect}
              >
                <span className="cb-checklist__marker" aria-hidden="true">
                  {task.done ? <Check size={12} strokeWidth={3} /> : null}
                </span>
                <span className="cb-checklist__text">
                  <span className="cb-checklist__label">
                    {task.label}
                    <span className="cb-visually-hidden">{task.done ? ' (done)' : ''}</span>
                  </span>
                  {task.description ? <span className="cb-checklist__description">{task.description}</span> : null}
                </span>
                {task.onSelect && !task.done ? <ChevronRight size={16} className="cb-checklist__chevron" /> : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
