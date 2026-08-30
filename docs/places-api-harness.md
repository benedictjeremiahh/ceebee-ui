# Places API quota harness

All server-side calls to Places API (New) must go through `PlacesQuotaHarness` from
`docs/lib/places-quota.ts`. It reserves both the operation's minute bucket and daily
bucket before the request is sent. A quota rejection must be surfaced or queued for
`retryAt`; it must not be retried immediately.

The current limits for Google Cloud project `woven-amulet-467905-v0` were read from
the Maps Platform console on 2026-08-29:

| Operation | Per minute | Per day |
| --- | ---: | ---: |
| Autocomplete | 12,000 | 175,000 |
| Place details (`GetPlace`) | 600 | 125,000 |
| Photo media | 600 | 175,000 |
| Text search | 600 | 75,000 |
| Nearby search | 600 | 75,000 |

The daily key uses `America/Los_Angeles`, matching Google Maps Platform's quota day.
The in-memory store is only for tests or one local process. Deployments must inject a
shared store whose `reserve` operation is atomic across both buckets; otherwise
concurrent server instances can exceed the project quota.

```ts
const places = new PlacesQuotaHarness(sharedQuotaStore);

const response = await places.call('searchText', () =>
  fetch('https://places.googleapis.com/v1/places:searchText', request).then((result) => result.json()),
);
```

Do not retry `PlacesQuotaExceededError` before `error.retryAt`. Failed upstream
requests are not refunded, because repeating them can create a quota-throttling loop.
