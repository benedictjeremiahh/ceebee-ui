import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './card.js';

describe('Card contract', () => {
  it('renders stable cover, header, tabs, body, and actions regions without becoming a control', () => {
    const { container } = render(
      <Card
        title="Project"
        extra={<a href="/project">Open</a>}
        cover={<img src="cover.jpg" alt="" />}
        tabs={<div role="tablist">Tabs own this region</div>}
        actions={<button type="button">Archive</button>}
        hoverable
      >
        Body
      </Card>,
    );

    const root = container.firstElementChild;
    expect(root).toHaveClass('cb-card', 'cb-card--hoverable');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
    expect(container.querySelector('.cb-card__cover')).toBeInTheDocument();
    expect(container.querySelector('.cb-card__header')).toBeInTheDocument();
    expect(container.querySelector('.cb-card__tabs')).toContainElement(screen.getByRole('tablist'));
    expect(container.querySelector('.cb-card__body')).toHaveTextContent('Body');
    expect(container.querySelector('.cb-card__actions')).toContainElement(screen.getByRole('button'));
  });

  it('does not guess a heading level for title content', () => {
    render(<Card title="Plain title">Body</Card>);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Plain title')).toHaveClass('cb-card__title');
  });

  it('replaces only the body with matching loading content and announces the busy region', () => {
    const { container } = render(
      <Card title="Account" actions={<button type="button">Edit</button>} loading>
        Loaded account
      </Card>,
    );

    expect(screen.queryByText('Loaded account')).not.toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(container.querySelector('.cb-card__body')).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelectorAll('.cb-skeleton').length).toBeGreaterThan(0);
  });

  it('keeps Meta and Grid non-interactive while exposing their anatomy', () => {
    const { container } = render(
      <Card>
        <Card.Meta avatar={<span>A</span>} title="Ada" description="Engineer" />
        <Card.Grid columns={2}>
          <span>One</span>
          <span>Two</span>
        </Card.Grid>
      </Card>,
    );

    expect(container.querySelector('.cb-card-meta__avatar')).toHaveTextContent('A');
    expect(container.querySelector('.cb-card-meta__title')).toHaveTextContent('Ada');
    expect(container.querySelector('.cb-card-meta__description')).toHaveTextContent('Engineer');
    expect(container.querySelector('.cb-card-grid')).toHaveStyle('--cb-grid-columns: 2');
    expect(container.querySelector('.cb-card-meta')).not.toHaveAttribute('role');
    expect(container.querySelector('.cb-card-grid')).not.toHaveAttribute('role');
  });
});

describe('Card.Skeleton', () => {
  it('uses the same Surface, size, radius, and zero-padding geometry as Card', () => {
    const { container: real } = render(<Card size="lg">Content</Card>);
    const { container: placeholder } = render(<Card.Skeleton size="lg" withCover withActions />);

    const geometry = (root: HTMLElement) =>
      Array.from(root.firstElementChild!.classList)
        .filter((name) => name.startsWith('cb-card') || name.startsWith('cb-radius') || name.startsWith('cb-pad'))
        .filter((name) => name !== 'cb-card--skeleton')
        .sort();

    expect(geometry(placeholder)).toEqual(geometry(real));
    expect(placeholder.querySelector('.cb-card__skeleton-cover')).toBeInTheDocument();
    expect(placeholder.querySelector('.cb-card__skeleton-actions')).toBeInTheDocument();
  });
});
