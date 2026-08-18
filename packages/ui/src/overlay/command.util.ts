/** Command matching and ranking. Pure — search that ranks badly is a bug you can only see in a test. */

export interface Command {
  id: string;
  label: string;
  /** Extra words that should find this command, e.g. ['logout', 'exit'] for "Sign out". */
  keywords?: string[];
  group?: string;
  shortcut?: string;
}

export interface RankedCommand<T extends Command = Command> {
  command: T;
  score: number;
}

/**
 * Ranks by how the query matched, not by string distance:
 * an exact label wins, then a label prefix, then a word start, then anything containing it,
 * then a keyword hit. Ties keep the order the caller supplied, so a curated list stays curated.
 */
export function rankCommand(command: Command, query: string): number {
  const needle = query.trim().toLowerCase();
  if (!needle) return 1;

  const label = command.label.toLowerCase();
  if (label === needle) return 100;
  if (label.startsWith(needle)) return 80;
  if (label.split(/\s+/).some((word) => word.startsWith(needle))) return 60;
  if (label.includes(needle)) return 40;
  if (command.keywords?.some((keyword) => keyword.toLowerCase().includes(needle))) return 20;
  return 0;
}

export function filterCommands<T extends Command>(commands: T[], query: string): T[] {
  return commands
    .map((command, index) => ({ command, score: rankCommand(command, query), index }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => (b.score === a.score ? a.index - b.index : b.score - a.score))
    .map((entry) => entry.command);
}

/** Groups in first-seen order, so a ranked list does not shuffle its own headings. */
export function groupCommands<T extends Command>(commands: T[]): Array<{ group: string | undefined; items: T[] }> {
  const groups: Array<{ group: string | undefined; items: T[] }> = [];
  for (const command of commands) {
    const existing = groups.find((entry) => entry.group === command.group);
    if (existing) existing.items.push(command);
    else groups.push({ group: command.group, items: [command] });
  }
  return groups;
}
