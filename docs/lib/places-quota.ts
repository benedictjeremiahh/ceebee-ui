/**
 * Quota-aware boundary for Places API (New) requests.
 *
 * A production QuotaStore must reserve every bucket atomically. An in-memory
 * store is provided only for local development and a single process.
 */
export type PlacesOperation =
  | 'autocomplete'
  | 'getPhotoMedia'
  | 'getPlace'
  | 'searchNearby'
  | 'searchText';

export type QuotaWindow = 'minute' | 'day';

export interface PlacesQuotaLimit {
  readonly perMinute: number;
  readonly perDay: number;
}

export const PLACES_API_QUOTAS: Readonly<Record<PlacesOperation, PlacesQuotaLimit>> = {
  autocomplete: { perMinute: 12_000, perDay: 175_000 },
  getPhotoMedia: { perMinute: 600, perDay: 175_000 },
  getPlace: { perMinute: 600, perDay: 125_000 },
  searchNearby: { perMinute: 600, perDay: 75_000 },
  searchText: { perMinute: 600, perDay: 75_000 },
};

export interface QuotaBucket {
  readonly key: string;
  readonly limit: number;
  readonly expiresAt: Date;
  readonly operation: PlacesOperation;
  readonly window: QuotaWindow;
}

export interface QuotaReservation {
  readonly accepted: boolean;
  readonly retryAt?: Date;
}

/**
 * The store is intentionally injected: a durable, shared implementation
 * (for example Redis or a database transaction) is required in production.
 */
export interface QuotaStore {
  reserve(buckets: readonly QuotaBucket[], now: Date): Promise<QuotaReservation>;
}

export class PlacesQuotaExceededError extends Error {
  readonly operation: PlacesOperation;
  readonly retryAt?: Date;

  constructor(operation: PlacesOperation, retryAt?: Date) {
    super(`Places API quota is exhausted for ${operation}.`);
    this.name = 'PlacesQuotaExceededError';
    this.operation = operation;
    this.retryAt = retryAt;
  }
}

/**
 * Reserves quota before a request reaches Google. Failed upstream requests are
 * deliberately not refunded: retrying them must also respect the quota.
 */
export class PlacesQuotaHarness {
  constructor(
    private readonly store: QuotaStore,
    private readonly limits: Readonly<Record<PlacesOperation, PlacesQuotaLimit>> = PLACES_API_QUOTAS,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async call<T>(operation: PlacesOperation, request: () => Promise<T>): Promise<T> {
    const now = this.now();
    const reservation = await this.store.reserve(this.bucketsFor(operation, now), now);

    if (!reservation.accepted) {
      throw new PlacesQuotaExceededError(operation, reservation.retryAt);
    }

    return request();
  }

  bucketsFor(operation: PlacesOperation, now = this.now()): readonly QuotaBucket[] {
    const limit = this.limits[operation];
    const minuteStart = new Date(now);
    minuteStart.setUTCSeconds(0, 0);
    const minuteEnd = new Date(minuteStart.getTime() + 60_000);
    const day = losAngelesDate(now);

    return [
      {
        key: `places:${operation}:minute:${minuteStart.toISOString()}`,
        limit: limit.perMinute,
        expiresAt: minuteEnd,
        operation,
        window: 'minute',
      },
      {
        key: `places:${operation}:day:${day}`,
        limit: limit.perDay,
        expiresAt: nextLosAngelesMidnight(now),
        operation,
        window: 'day',
      },
    ];
  }
}

/** A process-local store for tests and local development only. */
export class InMemoryQuotaStore implements QuotaStore {
  private readonly counts = new Map<string, { count: number; expiresAt: Date }>();

  async reserve(buckets: readonly QuotaBucket[], now: Date): Promise<QuotaReservation> {
    for (const bucket of buckets) {
      const current = this.counts.get(bucket.key);
      const count = current && current.expiresAt > now ? current.count : 0;
      if (count >= bucket.limit) return { accepted: false, retryAt: bucket.expiresAt };
    }

    for (const bucket of buckets) {
      const current = this.counts.get(bucket.key);
      const count = current && current.expiresAt > now ? current.count : 0;
      this.counts.set(bucket.key, { count: count + 1, expiresAt: bucket.expiresAt });
    }

    return { accepted: true };
  }
}

function losAngelesDate(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((entry) => entry.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function nextLosAngelesMidnight(now: Date): Date {
  const [year, month, day] = losAngelesDate(now).split('-').map(Number);
  const calendarTomorrow = new Date(Date.UTC(year!, month! - 1, day! + 1));
  const nextYear = calendarTomorrow.getUTCFullYear();
  const nextMonth = calendarTomorrow.getUTCMonth() + 1;
  const nextDay = calendarTomorrow.getUTCDate();
  const noonAtNextLocalDate = new Date(Date.UTC(nextYear, nextMonth - 1, nextDay, 12));
  const offset = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'longOffset',
  }).formatToParts(noonAtNextLocalDate).find((part) => part.type === 'timeZoneName')?.value;

  return new Date(Date.UTC(nextYear, nextMonth - 1, nextDay) - parseOffsetMinutes(offset ?? ''));
}

function parseOffsetMinutes(value: string): number {
  const match = /^GMT([+-])(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error(`Unexpected time-zone offset: ${value}`);
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === '+' ? minutes : -minutes;
}
