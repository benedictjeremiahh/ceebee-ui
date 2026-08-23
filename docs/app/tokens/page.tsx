import { Heading, Flex, Surface, Text } from '@ceebee/ui';

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
