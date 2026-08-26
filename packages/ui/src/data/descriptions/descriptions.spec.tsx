import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Descriptions } from './descriptions.js';

describe('Descriptions contract', () => {
  it('renders native description-list semantics with stable item composition', () => {
    const { container } = render(
      <Descriptions title="Project details" extra={<button type="button">Edit</button>} columns={2}>
        <Descriptions.Item label="Name">Ceebee</Descriptions.Item>
        <Descriptions.Item label="Status">Ready</Descriptions.Item>
      </Descriptions>,
    );

    expect(screen.getByText('Project details')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelectorAll('dt')).toHaveLength(2);
    expect(container.querySelectorAll('dd')).toHaveLength(2);
    expect(container.querySelector('.cb-descriptions')).toHaveClass('cb-descriptions--horizontal');
    expect(container.querySelector('.cb-descriptions')).toHaveAttribute('data-columns', '2');
  });

  it('supports vertical layout, spans, and visual props without changing interaction semantics', () => {
    const { container } = render(
      <Descriptions layout="vertical" size="lg" bordered={false} colon={false} columns={3}>
        <Descriptions.Item label="Summary" span={2}>Details</Descriptions.Item>
      </Descriptions>,
    );

    const root = container.querySelector('.cb-descriptions')!;
    expect(root).toHaveClass('cb-descriptions--vertical', 'cb-descriptions--lg', 'cb-descriptions--without-colon');
    expect(container.querySelector('.cb-descriptions__item')).toHaveClass('cb-descriptions__item--span-2');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
  });

  it('publishes the active column count so oversized spans clamp at every responsive width', () => {
    const { container } = render(
      <Descriptions columns={1}>
        <Descriptions.Item label="Summary" span={4}>Details</Descriptions.Item>
      </Descriptions>,
    );

    expect(container.querySelector('.cb-descriptions')).toHaveAttribute('data-columns', '1');
    expect(container.querySelector('.cb-descriptions__item')).toHaveClass('cb-descriptions__item--span-4');
  });
});

describe('Descriptions.Skeleton', () => {
  it('matches the record anatomy and requested geometry', () => {
    const { container } = render(<Descriptions.Skeleton columns={4} size="sm" bordered items={4} />);

    expect(container.querySelector('.cb-descriptions')).toHaveClass('cb-descriptions--sm', 'cb-descriptions--bordered');
    expect(container.querySelector('.cb-descriptions')).toHaveAttribute('data-columns', '4');
    expect(container.querySelectorAll('dt')).toHaveLength(4);
    expect(container.querySelectorAll('dd')).toHaveLength(4);
    expect(container.querySelectorAll('.cb-skeleton')).toHaveLength(8);
    expect(container.querySelector('.cb-descriptions__skeleton-label')).toBeInTheDocument();
    expect(container.querySelector('.cb-descriptions__skeleton-value')).toBeInTheDocument();
  });
});
