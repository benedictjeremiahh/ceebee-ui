import { Flex, Heading, Surface, Text } from '@ceebee/ui';

const COLOUR_TOKENS = [
  '--cb-bg',
  '--cb-bg-subtle',
  '--cb-surface',
  '--cb-border',
  '--cb-fg',
  '--cb-fg-muted',
  '--cb-brand-300',
  '--cb-brand-500',
  '--cb-brand-700',
  '--cb-tone-info',
  '--cb-tone-success',
  '--cb-tone-warning',
  '--cb-tone-danger',
  '--cb-decor-violet',
  '--cb-decor-blue',
  '--cb-decor-teal',
  '--cb-decor-green',
  '--cb-decor-amber',
  '--cb-decor-rose',
];

const SPACE_STEPS = [1, 2, 3, 4, 5, 6, 7, 8];
const RADII = ['sm', 'md', 'lg', 'xl', 'full'];
const DURATIONS = ['instant', 'fast', 'base', 'slow', 'deliberate'];
const CONTROL_HEIGHTS = ['sm', 'md', 'lg'];

export default function TokensPage() {
  return (
    <Flex gap={5}>
      <div>
        <Heading level={1}>Tokens</Heading>
        <Text tone="muted">
          Every value a component may use. Structure tokens (spacing, radius, timing) are stable
          across brands; skin tokens (colour, elevation, texture) are what a Skin rewrites. A
          component never writes a hex and never writes a duration.
        </Text>
      </div>

      <div>
        <Heading level={2} size="xl">Colour</Heading>
        <div className="token-grid">
          {COLOUR_TOKENS.map((token) => (
            <div className="token-swatch" key={token}>
              <div className="token-swatch__chip" style={{ background: `var(${token})` }} />
              <p className="token-swatch__name">{token}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Heading level={2} size="xl">Spacing</Heading>
        <Flex gap={2}>
          {SPACE_STEPS.map((step) => (
            <Flex direction="row" gap={3} align="center" key={step}>
              <Text size="xs" tone="subtle" className="cb-numeric">
                --cb-space-{step}
              </Text>
              <div
                style={{
                  height: '0.75rem',
                  width: `var(--cb-space-${step})`,
                  background: 'var(--cb-brand-400)',
                  borderRadius: 'var(--cb-radius-sm)',
                }}
              />
            </Flex>
          ))}
        </Flex>
      </div>

      <div>
        <Heading level={2} size="xl">Control heights</Heading>
        <Text tone="muted">
          The height a form control is drawn at: <code>sm</code> 2rem (32px), <code>md</code> 2.5rem
          (40px), <code>lg</code> 3rem (48px). Each is <code>max()</code> of a preferred step
          (<code>--cb-control-height-base-*</code>) and the active pointer floor, so a density scale
          can retune the ladder but never take a control under its floor.
        </Text>
        <Text tone="muted">
          On a coarse pointer — a touch screen — <code>--cb-control-floor</code> becomes
          <code> --cb-control-floor-coarse</code> (2.75rem, 44px), so <code>sm</code> and{' '}
          <code>md</code> both reach 44px and <code>lg</code> keeps its 48px, with no per-control CSS.
          A pointer that hovers keeps <code>--cb-control-floor-fine</code> (2rem, 32px).
        </Text>
        <Text tone="muted">
          The 2026 SaaS convention is a tighter ladder — <code>xs</code> 24 / <code>sm</code> 28 /{' '}
          <code>md</code> 36 / <code>lg</code> 44 / <code>xl</code> 52. Ceebee starts higher (its{' '}
          <code>sm</code> 32 is already above that convention&apos;s <code>sm</code> 28) and its{' '}
          <code>md</code> is 40 because the library is drawn at a roomier base than a dense admin
          table. The top is <code>lg</code> 48; there is no <code>xl</code> control. A consumer that
          wants the convention&apos;s tighter steps retunes <code>--cb-control-height-base-*</code>,
          and the floor still holds.
        </Text>
        <Flex direction="row" gap={4} align="end">
          {CONTROL_HEIGHTS.map((step) => (
            <Flex key={step} direction="column" gap={1} align="center">
              <div
                style={{
                  inlineSize: '3.5rem',
                  blockSize: `var(--cb-control-height-${step})`,
                  background: 'var(--cb-tone-brand)',
                  borderRadius: 'var(--cb-radius-sm)',
                }}
              />
              <Text size="xs" tone="subtle">--cb-control-height-{step}</Text>
            </Flex>
          ))}
        </Flex>
      </div>

      <div>
        <Heading level={2} size="xl">Radius</Heading>
        <Flex direction="row" gap={3} wrap>
          {RADII.map((radius) => (
            <Surface key={radius} radius={radius === 'full' ? 'xl' : (radius as 'sm' | 'md' | 'lg' | 'xl')} padding="sm">
              <Text size="xs" tone="muted">--cb-radius-{radius}</Text>
            </Surface>
          ))}
        </Flex>
      </div>

      <div>
        <Heading level={2} size="xl">Motion</Heading>
        <Text tone="muted">
          Durations and easings are tokens too, so timing stays consistent across components and can
          be retuned in one place.
        </Text>
        <Flex gap={2}>
          {DURATIONS.map((token) => (
            <Text key={token} size="sm" tone="muted">
              <code>--cb-duration-{token}</code>
            </Text>
          ))}
        </Flex>
      </div>
    </Flex>
  );
}
