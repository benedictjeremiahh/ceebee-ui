/** Date arithmetic for the picker. Pure, and dealing only in local calendar days. */

export interface DayCell {
  date: Date;
  /** False for the leading and trailing days that belong to the neighbouring months. */
  inMonth: boolean;
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Six weeks of cells, always. A fixed grid height means the popover does not resize when a
 * month happens to span five weeks instead of six.
 */
export function monthMatrix(year: number, month: number, weekStartsOn: 0 | 1 = 1): DayCell[][] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = new Date(year, month, 1 - offset);

  const weeks: DayCell[][] = [];
  for (let week = 0; week < 6; week += 1) {
    const cells: DayCell[] = [];
    for (let day = 0; day < 7; day += 1) {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + week * 7 + day);
      cells.push({ date, inMonth: date.getMonth() === month });
    }
    weeks.push(cells);
  }
  return weeks;
}

/**
 * Reads what a person typed. ISO first, then day-first with `/`, `-`, or `.` — day-first because
 * that is what most of the world writes, and an ambiguous `03/04` has to pick a side.
 */
export function parseDateInput(input: string): Date | null {
  const text = input.trim();
  if (!text) return null;

  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text);
  if (iso) return build(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const dayFirst = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/.exec(text);
  if (dayFirst) {
    const year = Number(dayFirst[3]);
    return build(year < 100 ? 2000 + year : year, Number(dayFirst[2]), Number(dayFirst[1]));
  }
  return null;
}

function build(year: number, month: number, day: number): Date | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  // Rejects 31 February rather than letting it roll into March.
  if (date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export function formatISO(date: Date | null): string {
  if (!date) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isOutOfRange(date: Date, min?: Date, max?: Date): boolean {
  if (min && startOfDay(date) < startOfDay(min)) return true;
  if (max && startOfDay(date) > startOfDay(max)) return true;
  return false;
}
