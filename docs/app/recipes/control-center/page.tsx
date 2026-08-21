import { Heading, Stack, Text } from '@ceebee/ui';
import { ControlCenterRecipe } from '../../../components/recipes/control-center';

export default function ControlCenterPage() {
  return (
    <Stack gap={5}>
      <div>
        <Heading level={1}>Glass control center</Heading>
        <Text tone="muted">
          An elevated control layer built from `Surface variant=&quot;glass&quot;`, `Switch`, `Badge`, and
          `Avatar`. The coloured field belongs to the page so the material has real content to react
          to. Keep this treatment selective: the controls float in glass while the content remains
          on its own plane.
        </Text>
      </div>
      <ControlCenterRecipe />
    </Stack>
  );
}
