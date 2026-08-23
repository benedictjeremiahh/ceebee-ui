import { Heading, Text, Flex } from '@ceebee/ui';
import { AstraDashboard } from '../../../components/astra-dashboard';

export default function AstraRecipePage() {
  return (
    <Flex gap={5}>
      <div>
        <Heading level={1}>Astra dashboard</Heading>
        <Text tone="muted">
          The reference board's signature screen, rebuilt from the library alone: tinted Surfaces, two
          ProgressRings, StatCards, and a task list. Nothing here is exported by the package — a
          Recipe proves the library, it is not shipped by it. Toggle the loading state to watch the
          Skeletons hold the exact layout the data lands into.
        </Text>
      </div>
      <AstraDashboard />
    </Flex>
  );
}
