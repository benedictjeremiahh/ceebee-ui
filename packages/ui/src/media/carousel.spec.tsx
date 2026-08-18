import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Carousel } from './carousel.js';

describe('Carousel', () => {
  it('is an announced region with a name and per-slide grouping', () => {
    render(
      <Carousel label="Featured work">
        <Carousel.Slide>One</Carousel.Slide>
        <Carousel.Slide>Two</Carousel.Slide>
      </Carousel>,
    );

    const region = screen.getByRole('region', { name: 'Featured work' });
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    expect(screen.getAllByRole('group')).toHaveLength(2);
  });

  it('names its arrows, because an icon-only button is unlabelled', () => {
    render(
      <Carousel label="Featured work">
        <Carousel.Slide>One</Carousel.Slide>
      </Carousel>,
    );
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument();
  });

  it('gives the Skeleton the same track geometry as the real carousel (ADR 0009)', () => {
    const { container: real } = render(
      <Carousel label="Featured work" slideWidth="20rem" gap={5}>
        <Carousel.Slide>One</Carousel.Slide>
      </Carousel>,
    );
    const { container: placeholder } = render(<Carousel.Skeleton slideWidth="20rem" gap={5} />);

    const geometry = (root: HTMLElement) => {
      const node = root.querySelector('.cb-carousel') as HTMLElement;
      return [node.style.getPropertyValue('--cb-carousel-slide'), node.style.getPropertyValue('--cb-carousel-gap')];
    };

    expect(geometry(placeholder)).toEqual(geometry(real));
  });

  it('hides the placeholder from assistive technology', () => {
    const { container } = render(<Carousel.Skeleton />);
    expect(container.querySelector('.cb-carousel')).toHaveAttribute('aria-hidden', 'true');
  });
});
