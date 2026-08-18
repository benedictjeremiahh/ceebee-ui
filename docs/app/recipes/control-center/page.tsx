import { Heading, Stack, Text } from '@ceebee/ui';
import { ControlCenterRecipe } from '../../../components/recipes/control-center';

export default function ControlCenterPage() {
  return (
    <Stack gap={5}>
      <div>
        <Heading level={1}>Glass control center</Heading>
        <Text tone="muted">
          The frosted-panel pin, rebuilt from `Surface variant=&quot;glass&quot;`, `Switch`, `Badge`, and
          `Avatar`. The blur has something to blur because the coloured field behind it belongs to
          the page, not the library — glass is a surface treatment, and it needs a background to be
          worth anything.
        </Text>
      </div>
      <ControlCenterRecipe />
    </Stack>
  );
}
