'use client';

import { Surface, Text } from '@ceebee/ui';
import { Calendar } from '@ceebee/ui/client';
import { Demo } from '../../../components/demo';

export function CalendarDayContentDemo() {
  return (
    <Demo
      layout="block"
      code={`<Calendar
  disabledDate={(date) => date.getDay() === 0}
  renderDay={({ date, today }) => <Text size="sm">{today ? 'Today' : date.getDate()}</Text>}
/>`}
    >
      <Surface padding="sm">
        <Calendar
          disabledDate={(date) => date.getDay() === 0}
          renderDay={({ date, today }) => <Text size="sm">{today ? 'Today' : date.getDate()}</Text>}
        />
      </Surface>
    </Demo>
  );
}
