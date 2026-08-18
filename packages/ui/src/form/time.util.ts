/** Time-of-day parsing and formatting. Pure, like the date maths next to it. */

export interface TimeValue {
  hours: number;
  minutes: number;
}

/**
 * Reads what a person typed: `9`, `9:30`, `0930`, `9.30`, `9 pm`, `21:05`. Returns null rather
 * than guessing when the result would not be a real time.
 */
export function parseTime(input: string): TimeValue | null {
  const text = input.trim().toLowerCase().replace(/\s+/g, '');
  if (!text) return null;

  const suffix = text.endsWith('am') ? 'am' : text.endsWith('pm') ? 'pm' : null;
  const body = suffix ? text.slice(0, -2) : text;

  let hours: number;
  let minutes = 0;

  const separated = /^(\d{1,2})[:.](\d{1,2})$/.exec(body);
  const compact = /^(\d{3,4})$/.exec(body);
  const hourOnly = /^(\d{1,2})$/.exec(body);

  if (separated) {
    hours = Number(separated[1]);
    minutes = Number(separated[2]);
  } else if (compact) {
    const digits = compact[1]!.padStart(4, '0');
    hours = Number(digits.slice(0, 2));
    minutes = Number(digits.slice(2));
  } else if (hourOnly) {
    hours = Number(hourOnly[1]);
  } else {
    return null;
  }

  if (suffix === 'pm' && hours < 12) hours += 12;
  if (suffix === 'am' && hours === 12) hours = 0;
  if (hours > 23 || minutes > 59) return null;
  return { hours, minutes };
}

export function formatTime({ hours, minutes }: TimeValue): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function timeToMinutes({ hours, minutes }: TimeValue): number {
  return hours * 60 + minutes;
}

/** Every selectable time between two bounds, at `step` minutes. Bounds are inclusive. */
export function timeOptions(step: number, min?: TimeValue, max?: TimeValue): TimeValue[] {
  const safeStep = step > 0 ? step : 30;
  const from = min ? timeToMinutes(min) : 0;
  const to = max ? timeToMinutes(max) : 24 * 60 - 1;
  const options: TimeValue[] = [];
  for (let value = from; value <= to; value += safeStep) {
    options.push({ hours: Math.floor(value / 60) % 24, minutes: value % 60 });
  }
  return options;
}

export function isTimeOutOfRange(value: TimeValue, min?: TimeValue, max?: TimeValue): boolean {
  const minutes = timeToMinutes(value);
  if (min && minutes < timeToMinutes(min)) return true;
  if (max && minutes > timeToMinutes(max)) return true;
  return false;
}
