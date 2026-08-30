import { describe, expect, it, vi } from 'vitest';
import {
  InMemoryQuotaStore,
  PlacesQuotaExceededError,
  PlacesQuotaHarness,
  type QuotaStore,
} from './places-quota';

describe('PlacesQuotaHarness', () => {
  it('reserves both an endpoint minute and Los Angeles daily bucket before calling Google', async () => {
    const reserve = vi.fn<QuotaStore['reserve']>().mockResolvedValue({ accepted: true });
    const request = vi.fn().mockResolvedValue({ places: [] });
    const now = new Date('2026-08-29T08:31:45.000Z');
    const harness = new PlacesQuotaHarness({ reserve }, undefined, () => now);

    await expect(harness.call('searchText', request)).resolves.toEqual({ places: [] });

    expect(reserve).toHaveBeenCalledWith([
      expect.objectContaining({ key: 'places:searchText:minute:2026-08-29T08:31:00.000Z', limit: 600, window: 'minute' }),
      expect.objectContaining({ key: 'places:searchText:day:2026-08-29', limit: 75_000, window: 'day' }),
    ], now);
    expect(request).toHaveBeenCalledOnce();
  });

  it('does not send the request when either quota bucket is rejected', async () => {
    const retryAt = new Date('2026-08-29T08:32:00.000Z');
    const request = vi.fn().mockResolvedValue(undefined);
    const harness = new PlacesQuotaHarness({ reserve: vi.fn().mockResolvedValue({ accepted: false, retryAt }) });

    await expect(harness.call('getPlace', request)).rejects.toEqual(
      expect.objectContaining<Partial<PlacesQuotaExceededError>>({ operation: 'getPlace', retryAt }),
    );
    expect(request).not.toHaveBeenCalled();
  });

  it('stops at the configured local development minute limit', async () => {
    const now = new Date('2026-08-29T08:31:45.000Z');
    const harness = new PlacesQuotaHarness(
      new InMemoryQuotaStore(),
      { autocomplete: { perMinute: 1, perDay: 2 }, getPhotoMedia: { perMinute: 1, perDay: 1 }, getPlace: { perMinute: 1, perDay: 1 }, searchNearby: { perMinute: 1, perDay: 1 }, searchText: { perMinute: 1, perDay: 1 } },
      () => now,
    );

    await harness.call('searchText', async () => undefined);
    await expect(harness.call('searchText', async () => undefined)).rejects.toBeInstanceOf(PlacesQuotaExceededError);
  });
});
