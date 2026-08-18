import { describe, expect, it } from 'vitest';
import { filterCommands, groupCommands, rankCommand, type Command } from './command.util.js';

const COMMANDS: Command[] = [
  { id: 'new', label: 'New invoice', group: 'Create' },
  { id: 'invite', label: 'Invite a teammate', group: 'Create' },
  { id: 'signout', label: 'Sign out', keywords: ['logout', 'exit'], group: 'Account' },
  { id: 'settings', label: 'Open settings', group: 'Account' },
];

describe('rankCommand', () => {
  it('ranks an exact label above a prefix, a word start, and a bare substring', () => {
    const exact = rankCommand({ id: 'a', label: 'New' }, 'new');
    const prefix = rankCommand({ id: 'b', label: 'New invoice' }, 'new');
    const wordStart = rankCommand({ id: 'c', label: 'Create new invoice' }, 'new');
    const contains = rankCommand({ id: 'd', label: 'Renew plan' }, 'new');
    expect(exact).toBeGreaterThan(prefix);
    expect(prefix).toBeGreaterThan(wordStart);
    expect(wordStart).toBeGreaterThan(contains);
  });

  it('finds a command by a keyword it does not say out loud', () => {
    expect(rankCommand(COMMANDS[2]!, 'logout')).toBeGreaterThan(0);
  });

  it('keeps everything when the query is empty', () => {
    expect(filterCommands(COMMANDS, '   ')).toHaveLength(COMMANDS.length);
  });
});

describe('filterCommands', () => {
  it('drops what does not match at all', () => {
    expect(filterCommands(COMMANDS, 'zzz')).toEqual([]);
  });

  it('keeps the caller order between equally good matches, so a curated list stays curated', () => {
    const ranked = filterCommands(
      [
        { id: 'a', label: 'Invite a teammate' },
        { id: 'b', label: 'Invite a customer' },
      ],
      'invite',
    );
    expect(ranked.map((command) => command.id)).toEqual(['a', 'b']);
  });
});

describe('groupCommands', () => {
  it('groups in first-seen order, so headings do not shuffle as the ranking changes', () => {
    const groups = groupCommands(filterCommands(COMMANDS, ''));
    expect(groups.map((group) => group.group)).toEqual(['Create', 'Account']);
    expect(groups[0]!.items).toHaveLength(2);
  });
});
