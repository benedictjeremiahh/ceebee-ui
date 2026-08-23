'use client';

/* Aliased: the glyph and the component now want the same name. */
import { Upload as UploadGlyph, X } from 'lucide-react';
import { useState, type DragEvent, type ReactNode } from 'react';
import { useLabels } from '../lib/labels.js';
import { cn } from '../lib/cn.js';
import { useFieldWiring } from './field.js';
import { describeAccept, partitionFiles, type FileRules } from './upload.util.js';

export interface UploadProps extends FileRules {
  onFilesChange: (files: File[]) => void;
  files?: File[];
  /** Rejections are surfaced rather than swallowed — a file that vanishes silently reads as a bug. */
  onReject?: (rejections: Array<{ file: File; reason: string }>) => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

export function Upload({
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
}: UploadProps) {
  const [over, setOver] = useState(false);
  const field = useFieldWiring();
  const labels = useLabels();
  const rules: FileRules = { accept, maxSize, maxFiles, multiple };

  const take = (incoming: FileList | null) => {
    if (!incoming) return;
    const { accepted, rejected } = partitionFiles(Array.from(incoming), files, rules);
    if (accepted.length > 0) onFilesChange([...files, ...accepted]);
    if (rejected.length > 0) onReject?.(rejected);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setOver(false);
    if (!disabled) take(event.dataTransfer.files);
  };

  return (
    <div className={cn('cb-filedrop', className)}>
      <label
        className="cb-filedrop__zone"
        data-over={over || undefined}
        data-disabled={disabled || undefined}
        onDragOver={(event: DragEvent<HTMLLabelElement>) => {
          event.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        {/* The input stays a real file input: drag and drop is an addition, never the only way in. */}
        <input
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
          <UploadGlyph size={20} />
        </span>
        <span className="cb-filedrop__button">{multiple ? labels.chooseFiles : labels.chooseFile}</span>
        <p className="cb-filedrop__hint">
          {multiple ? labels.dropFilesHere : labels.dropFileHere}
          {describeAccept(rules)}
        </p>
        {children}
      </label>

      {files.length > 0 ? (
        <ul className="cb-filedrop__list">
          {files.map((file, index) => (
            <li className="cb-filedrop__file" key={`${file.name}-${index}`}>
              <span className="cb-filedrop__name">{file.name}</span>
              <span className="cb-filedrop__size">{formatSize(file.size)}</span>
              <button
                type="button"
                className="cb-filedrop__remove"
                aria-label={labels.removeFile(file.name)}
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
