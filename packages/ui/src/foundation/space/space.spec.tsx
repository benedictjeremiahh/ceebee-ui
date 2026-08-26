import { render } from '@testing-library/react';
import { Fragment } from 'react';
import { describe, expect, it } from 'vitest';
import { Space } from './space.js';

describe('Space', () => {
  it('separates children into layout items without changing their semantics', () => {
    const { container, getByRole } = render(
      <Space size={3} split="/">
        <button type="button">One</button>
        <a href="/two">Two</a>
      </Space>,
    );

    expect(container.firstElementChild).toHaveClass('cb-space', 'cb-space--horizontal');
    expect(container.querySelectorAll('.cb-space__item')).toHaveLength(2);
    expect(getByRole('button', { name: 'One' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Two' })).toBeInTheDocument();
    expect(container.querySelectorAll('.cb-space__split')).toHaveLength(1);
    expect(container.querySelector('.cb-space__split')?.parentElement).toBe(container.firstElementChild);
  });

  it('ignores empty and conditional children when placing separators', () => {
    const { container } = render(
      <Space split="/">
        <Fragment><span>One</span>{false}{null}<Fragment>{null}</Fragment></Fragment>
        {null}
        <span>Two</span>
      </Space>,
    );

    expect(container.querySelectorAll('.cb-space__item')).toHaveLength(2);
    expect(container.querySelectorAll('.cb-space__split')).toHaveLength(1);
  });

  it('supports vertical wrapping and token aliases', () => {
    const { container } = render(
      <Space direction="vertical" size="large" align="baseline" wrap>
        <span>One</span>
        <span>Two</span>
      </Space>,
    );

    expect(container.firstElementChild).toHaveClass(
      'cb-space--vertical',
      'cb-space--align-baseline',
      'cb-space--wrap',
    );
    expect(container.querySelectorAll('.cb-space__item')).toHaveLength(2);
  });

  it('places vertical splits as their own flex children', () => {
    const { container } = render(
      <Space direction="vertical" split={<span data-testid="split">·</span>}>
        <span>One</span>
        <span>Two</span>
      </Space>,
    );

    const root = container.firstElementChild;
    expect(root).toHaveClass('cb-space--vertical');
    expect(root?.children).toHaveLength(3);
    expect(root?.children[1]).toHaveClass('cb-space__split');
    expect(root?.querySelector('[data-testid="split"]')).toBeInTheDocument();
  });

  it('keeps Compact layout-only and preserves child button semantics', () => {
    const { container } = render(
      <>
        <Space.Compact direction="vertical">
          <button type="button">One</button>
          <button type="button">Two</button>
        </Space.Compact>
      </>,
    );

    expect(container.querySelector('.cb-space-compact')).toHaveClass('cb-space-compact--vertical');
    expect(container.querySelectorAll('button')).toHaveLength(2);
    expect(container.querySelectorAll('button:not([disabled])')).toHaveLength(2);
  });

  it('renders a token-sized skeleton with explicit hidden semantics', () => {
    const { container } = render(<Space.Skeleton items={2} />);

    expect(container.querySelectorAll('.cb-space--skeleton .cb-skeleton')).toHaveLength(2);
    expect(container.querySelector('.cb-space--skeleton')).toHaveClass('cb-space--align-center');
    expect(container.querySelector('.cb-space--skeleton')).toHaveAttribute('aria-hidden', 'true');
  });
});
