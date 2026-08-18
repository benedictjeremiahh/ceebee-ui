import { Heading, Stack, Text } from '@ceebee/ui';
import { GamifiedRecipe } from '../../../components/recipes/gamified';

export default function GamifiedPage() {
  return (
    <Stack gap={5}>
      <div>
        <Heading level={1}>Gamified learning</Heading>
        <Text tone="muted">
          Progress rings, streak badges, per-topic bars, and a leaderboard — the pins that made the
          board look playful. Every colour here is a decorative hue rather than a semantic tone,
          which is the distinction that keeps green meaning &quot;good&quot; elsewhere in the product.
        </Text>
      </div>
      <GamifiedRecipe />
    </Stack>
  );
}
