import { Heading, Stack, Text } from '@ceebee/ui';
import { FintechRecipe } from '../../../components/recipes/fintech';

export default function FintechPage() {
  return (
    <Stack gap={5}>
      <div>
        <Heading level={1}>Fintech mobile</Heading>
        <Text tone="muted">
          Balance card, sparkline, split-bill dialog, and a transaction history. The money is
          formatted by `Intl.NumberFormat` in the app, not by the library — currency is a product
          decision, and a design system that formats it will format it wrong for somebody.
        </Text>
      </div>
      <FintechRecipe />
    </Stack>
  );
}
