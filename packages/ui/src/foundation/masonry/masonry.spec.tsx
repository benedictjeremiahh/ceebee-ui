import { Fragment } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Masonry } from './masonry.js';

describe('Masonry', () => {
  it('preserves child semantics and normalizes empty children', () => {
    const { container, getByRole } = render(
      <Masonry columns={4} gap={3}>
        <button type="button">Action</button>
        <Fragment><span>One</span>{null}{false}<Fragment><a href="/two">Two</a></Fragment><Fragment /></Fragment>
      </Masonry>,
    );

    const root = container.firstElementChild;
    expect(root).toHaveClass('cb-masonry');
    expect(root).toHaveAttribute('data-columns', '4');
    expect(root).toHaveAttribute('data-gap', '3');
    expect(root?.querySelectorAll('.cb-masonry__item')).toHaveLength(3);
    expect(getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Two' })).toBeInTheDocument();
  });

  it('does not create a layout item for an empty Fragment', () => {
    const { container } = render(
      <Masonry>
        <Fragment />
        <span>Visible</span>
      </Masonry>,
    );

    expect(container.querySelectorAll('.cb-masonry__item')).toHaveLength(1);
    expect(container.querySelector('.cb-masonry__item')).toHaveTextContent('Visible');
  });

  it('does not impose an interaction role on the layout root', () => {
    const { container } = render(<Masonry><span>Content</span></Masonry>);

    expect(container.firstElementChild).not.toHaveAttribute('role');
    expect(container.firstElementChild).not.toHaveAttribute('tabindex');
  });

  it('renders ragged geometry placeholders with the same structural contract', () => {
    const { container } = render(<Masonry.Skeleton items={5} columns={2} gap={2} />);
    const root = container.querySelector('.cb-masonry--skeleton');

    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('data-columns', '2');
    expect(root).toHaveAttribute('data-gap', '2');
    expect(root?.querySelectorAll('.cb-masonry__item')).toHaveLength(5);
    expect(root?.querySelectorAll('.cb-masonry__skeleton-item')).toHaveLength(5);
  });
});
