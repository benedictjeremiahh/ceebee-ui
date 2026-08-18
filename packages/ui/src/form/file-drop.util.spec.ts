import { describe, expect, it } from 'vitest';
import { describeAccept, matchesAccept, partitionFiles } from './file-drop.util.js';

// The size has to be real: File.size comes from the content, so a fixture that truncates it
// silently makes every size assertion pass.
const file = (name: string, type = 'application/pdf', size = 1024) =>
  new File(['x'.repeat(size)], name, { type });

describe('matchesAccept', () => {
  it('matches by extension, by MIME type, and by wildcard', () => {
    expect(matchesAccept(file('report.pdf'), ['.pdf'])).toBe(true);
    expect(matchesAccept(file('photo.png', 'image/png'), ['image/*'])).toBe(true);
    expect(matchesAccept(file('report.pdf'), ['application/pdf'])).toBe(true);
    expect(matchesAccept(file('report.pdf'), ['.csv'])).toBe(false);
  });

  it('accepts everything when no rule is given', () => {
    expect(matchesAccept(file('anything.bin', 'application/octet-stream'), undefined)).toBe(true);
  });
});

describe('partitionFiles', () => {
  it('says why each rejection happened instead of dropping files silently', () => {
    const { accepted, rejected } = partitionFiles(
      [
        file('ok.pdf', 'application/pdf', 50),
        file('wrong.png', 'image/png'),
        file('huge.pdf', 'application/pdf', 99_999),
      ],
      [],
      { accept: ['.pdf'], maxSize: 100 },
    );
    expect(accepted.map((f) => f.name)).toEqual(['ok.pdf']);
    expect(rejected.map((entry) => entry.reason)).toEqual(['type', 'size']);
  });

  it('counts what is already held against maxFiles', () => {
    const { accepted, rejected } = partitionFiles([file('b.pdf'), file('c.pdf')], [file('a.pdf')], { maxFiles: 2 });
    expect(accepted).toHaveLength(1);
    expect(rejected[0]!.reason).toBe('count');
  });

  it('treats multiple={false} as a limit of one', () => {
    const { accepted, rejected } = partitionFiles([file('a.pdf'), file('b.pdf')], [], { multiple: false });
    expect(accepted).toHaveLength(1);
    expect(rejected).toHaveLength(1);
  });
});

describe('describeAccept', () => {
  it('says nothing when there is nothing to say', () => {
    expect(describeAccept({})).toBe('');
  });

  it('spells out the rules that exist', () => {
    expect(describeAccept({ accept: ['.pdf'], maxSize: 5 * 1024 * 1024 })).toBe(' — .pdf up to 5 MB');
  });
});
