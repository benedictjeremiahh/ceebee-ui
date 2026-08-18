/** File acceptance rules, kept pure: what gets rejected and why is worth asserting. */

export interface FileRules {
  /** Extensions or MIME types, e.g. ['.pdf', 'image/*']. */
  accept?: string[];
  /** Bytes. */
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
}

export interface Rejection {
  file: File;
  reason: string;
}

export function matchesAccept(file: File, accept: string[] | undefined): boolean {
  if (!accept || accept.length === 0) return true;
  const name = file.name.toLowerCase();
  return accept.some((pattern) => {
    const rule = pattern.trim().toLowerCase();
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
}

/**
 * Splits an incoming batch against the rules and what is already held. Every rejection carries
 * a reason, because a file that disappears without explanation reads as a broken uploader.
 */
export function partitionFiles(
  incoming: File[],
  existing: File[],
  rules: FileRules,
): { accepted: File[]; rejected: Rejection[] } {
  const accepted: File[] = [];
  const rejected: Rejection[] = [];
  const limit = rules.multiple === false ? 1 : rules.maxFiles;

  for (const file of incoming) {
    if (!matchesAccept(file, rules.accept)) {
      rejected.push({ file, reason: 'type' });
      continue;
    }
    if (typeof rules.maxSize === 'number' && file.size > rules.maxSize) {
      rejected.push({ file, reason: 'size' });
      continue;
    }
    if (typeof limit === 'number' && existing.length + accepted.length >= limit) {
      rejected.push({ file, reason: 'count' });
      continue;
    }
    accepted.push(file);
  }

  return { accepted, rejected };
}

/** The " — PDF up to 5 MB" tail under the drop zone. Empty when there is nothing to say. */
export function describeAccept(rules: FileRules): string {
  const parts: string[] = [];
  if (rules.accept?.length) parts.push(rules.accept.join(', '));
  if (typeof rules.maxSize === 'number') parts.push(`up to ${Math.round(rules.maxSize / (1024 * 1024))} MB`);
  return parts.length > 0 ? ` — ${parts.join(' ')}` : '';
}
