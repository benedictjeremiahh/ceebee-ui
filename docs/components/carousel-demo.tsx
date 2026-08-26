'use client';

import { useState } from 'react';
import { Carousel } from '@ceebee/ui/client';
import { Surface, Text, Heading, Flex } from '@ceebee/ui';
import { Button } from '@ceebee/ui/client';
import { Demo } from './demo';

const CARDS = [
  { title: 'Onboarding', hue: 'violet', body: 'Tours, checklists, empty states.' },
  { title: 'Billing', hue: 'blue', body: 'Invoices, plans, payment methods.' },
  { title: 'Insights', hue: 'teal', body: 'Rings, sparklines, stat tiles.' },
  { title: 'Workspace', hue: 'amber', body: 'Members, roles, invitations.' },
  { title: 'Audit', hue: 'rose', body: 'Every change, who and when.' },
] as const;

export function CarouselDemo({ autoplay = false }: { autoplay?: boolean }) {
  const [loading, setLoading] = useState(false);

  return (
    <Demo layout="block" code={`<Carousel label="Product areas" slideWidth="16rem" autoplay={3000} loop>
  {areas.map((area) => (
    <Carousel.Slide key={area.title}>
      <AreaCard area={area} />
    </Carousel.Slide>
  ))}
</Carousel>

<Carousel.Skeleton slides={4} slideWidth="16rem" slideHeight="9rem" />`}>
      <Flex gap={4}>
        <Flex direction="row" justify="between" align="center">
          <Text size="xs" tone="subtle">
            {autoplay ? 'Autoplay every 3s — hover or focus it and it stops' : 'Drag, arrows, dots, or arrow keys'}
          </Text>
          <Button size="sm" variant="outline" tone="neutral" onClick={() => setLoading((v) => !v)}>
            Toggle loading
          </Button>
        </Flex>

        {loading ? (
          <Carousel.Skeleton slides={4} slideWidth="16rem" slideHeight="9rem" />
        ) : (
          <Carousel label="Product areas" slideWidth="16rem" autoplay={autoplay ? 3000 : undefined} loop={autoplay}>
            {CARDS.map((card) => (
              <Carousel.Slide key={card.title}>
                <Surface variant="tinted" hue={card.hue} padding="md" radius="lg" className="carousel-card">
                  <Heading level={3} size="lg">
                    {card.title}
                  </Heading>
                  <Text size="sm" tone="muted">
                    {card.body}
                  </Text>
                </Surface>
              </Carousel.Slide>
            ))}
          </Carousel>
        )}
      </Flex>
    </Demo>
  );
}
