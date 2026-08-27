'use client';

import { Flex, Grid, Leaderboard, Surface, Text } from '@ceebee/ui';
import { Image } from '@ceebee/ui/client';
import { Demo } from './demo';

const LEADERS = [
  { id: '1', name: 'Ada Putri', score: '2,480', detail: '12 modules', delta: { value: '▲2', direction: 'up' as const } },
  { id: '2', name: 'Rio Hakim', score: '2,150', detail: '11 modules', delta: { value: '▼1', direction: 'down' as const } },
  { id: '3', name: 'Sarah Chen', score: '1,990', detail: '10 modules' },
  { id: '4', name: 'Benedict J', score: '1,840', detail: '9 modules', you: true },
  { id: '5', name: 'Citra Dewi', score: '1,610', detail: '8 modules' },
];

export function LeaderboardDemo() {
  return (
    <Demo layout="block" code={`<Leaderboard
  label="Weekly leaders"
  entries={[
    { id: '1', name: 'Ada Putri', score: '2,480', detail: '12 modules' },
    { id: '4', name: 'Benedict J', score: '1,840', you: true },
  ]}
/>`}>
      <Surface padding="md" radius="lg">
        <Leaderboard label="Weekly leaders" entries={LEADERS} />
      </Surface>
    </Demo>
  );
}

// A 20-byte SVG stands in for the tiny blurred placeholder a build step would generate.
const BLUR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="%237c5cff"/><circle cx="1" cy="1" r="1.6" fill="%2340c9c0"/></svg>',
  );

const PHOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%237c5cff"/><stop offset="1" stop-color="%2340c9c0"/></linearGradient></defs><rect width="400" height="300" fill="url(%23g)"/><circle cx="120" cy="110" r="60" fill="rgba(255,255,255,0.35)"/><rect x="40" y="200" width="320" height="18" rx="9" fill="rgba(255,255,255,0.5)"/></svg>',
  );

export function ImageDemo() {
  return (
    <Demo layout="block" code={`<Image
  src={photo.url}
  alt="Abstract gradient"
  aspectRatio={4 / 3}
  blurDataUrl={photo.blur}
  radius="lg"
/>`}>
      <Grid minItemWidth="14rem" gap={4}>
        <Flex gap={2}>
          <Image src={PHOTO} alt="Abstract gradient" placeholder={<img src={BLUR} alt="" />} style={{ borderRadius: 'var(--cb-radius-lg)' }} />
          <Text size="xs" tone="subtle">with a blur placeholder</Text>
        </Flex>
        <Flex gap={2}>
          <Image src={PHOTO} alt="Abstract gradient" style={{ background: 'var(--cb-bg-subtle)', borderRadius: 'var(--cb-radius-lg)' }} />
          <Text size="xs" tone="subtle">flat background, no blur</Text>
        </Flex>
        <Flex gap={2}>
          <Image src="/does-not-exist.png" alt="A photo that never loads" fallback={BLUR} style={{ borderRadius: 'var(--cb-radius-lg)' }} />
          <Text size="xs" tone="subtle">broken source — the placeholder stays</Text>
        </Flex>
      </Grid>
    </Demo>
  );
}

const PREVIEW_PHOTOS = [
  { id: 'one', src: PHOTO, alt: 'Purple and teal abstract landscape', aspectRatio: 4 / 3 },
  { id: 'two', src: PHOTO, alt: 'Second abstract landscape', aspectRatio: 4 / 3, caption: 'Alternate view' },
];

export function ImagePreviewDemo() {
  return (
    <Demo layout="block" code={`<Image.PreviewGroup
  items={photos}
  label="Site visit photos"
/>`}>
      <Image.PreviewGroup>
        {PREVIEW_PHOTOS.map((photo) => (
          <Image key={photo.id} src={photo.src} alt={photo.alt} width={200} />
        ))}
      </Image.PreviewGroup>
    </Demo>
  );
}
