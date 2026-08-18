'use client';

import { Upload, X } from 'lucide-react';
import { useRef, useState, type DragEvent, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useFieldWiring } from './field.js';
import { describeAccept, partitionFiles, type FileRules } from './file-drop.util.js';

export interface FileDropProps extends FileRules {
  onFilesChange: (files: File[]) => void;
  files?: File[];
  /** Rejections are surfaced rather than swallowed — a file that vanishes silently reads as a bug. */
  onReject?: (rejections: Array<{ file: File; reason: string }>) => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

export function FileDrop({
  onFilesChange,
  files = [],
  onReject,
  accept,
  maxSize,
  maxFiles,
  multiple = true,
  disabled,
  children,
  className,
}: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const field = useFieldWiring();
  const rules: FileRules = { accept, maxSize, maxFiles, multiple };

  const take = (incoming: FileList | null) => {
    if (!incoming) return;
    const { accepted, rejected } = partitionFiles(Array.from(incoming), files, rules);
    if (accepted.length > 0) onFilesChange([...files, ...accepted]);
    if (rejected.length > 0) onReject?.(rejected);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOver(false);
    if (!disabled) take(event.dataTransfer.files);
  };

  return (
    <div className={cn('cb-filedrop', className)}>
      <div
        className="cb-filedrop__zone"
        data-over={over || undefined}
        data-disabled={disabled || undefined}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        {/* The input stays a real file input: drag and drop is an addition, never the only way in. */}
        <input
          ref={inputRef}
          type="file"
          className="cb-visually-hidden"
          id={field?.controlId}
          accept={accept?.join(',')}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={field?.describedBy}
          onChange={(event) => {
            take(event.target.files);
            event.target.value = '';
          }}
        />
        <span className="cb-filedrop__icon" aria-hidden="true">
          <Upload size={20} />
        </span>
        <button
          type="button"
          className="cb-filedrop__button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Choose {multiple ? 'files' : 'a file'}
        </button>
        <p className="cb-filedrop__hint">or drop {multiple ? 'them' : 'it'} here{describeAccept(rules)}</p>
        {children}
      </div>

      {files.length > 0 ? (
        <ul className="cb-filedrop__list">
          {files.map((file, index) => (
            <li className="cb-filedrop__file" key={`${file.name}-${index}`}>
              <span className="cb-filedrop__name">{file.name}</span>
              <span className="cb-filedrop__size">{formatSize(file.size)}</span>
              <button
                type="button"
                className="cb-filedrop__remove"
                aria-label={`Remove ${file.name}`}
                onClick={() => onFilesChange(files.filter((_, i) => i !== index))}
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
