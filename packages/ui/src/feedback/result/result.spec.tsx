import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Result, type ResultStatus } from './result.js';
import { ResultSkeleton } from './result.skeleton.js';

describe('Result', () => {
  it.each<[ResultStatus, string]>([
    ['success', 'success'],
    ['info', 'info'],
    ['warning', 'warning'],
    ['error', 'danger'],
    ['404', 'neutral'],
    ['403', 'warning'],
    ['500', 'danger'],
  ])('maps %s to the semantic %s tone', (status, tone) => {
    render(<Result status={status} title="Finished" />);
    const result = document.querySelector('.cb-result');
    expect(result).toHaveAttribute('data-status', status);
    expect(result).toHaveAttribute('data-tone', tone);
  });

  it('composes description, extra actions, and children without owning their interaction', () => {
    render(
      <Result title="Done" description="Your export is ready" extra={<button type="button">Download</button>}>
        <span>Reference: 123</span>
      </Result>,
    );
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Your export is ready')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(screen.getByText('Reference: 123')).toBeInTheDocument();
  });

  it('renders a decorative status visual and keeps the result presentational', () => {
    render(<Result title="No access" status="403" icon={<span>!</span>} />);
    expect(screen.getByText('!')).toBeInTheDocument();
    expect(document.querySelector('.cb-result__icon')).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelector('.cb-result')).not.toHaveAttribute('tabindex');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('uses status-specific decorative marks without making colour the only visual distinction', () => {
    const { rerender } = render(<Result title="Finished" status="success" />);
    expect(document.querySelector('.cb-result__mark')).toHaveTextContent('✓');
    rerender(<Result title="Finished" status="error" />);
    expect(document.querySelector('.cb-result__mark')).toHaveTextContent('×');
  });

  it('exposes the matching Skeleton compound export', () => {
    render(<Result.Skeleton />);
    expect(document.querySelector('.cb-result--skeleton')).toBeInTheDocument();
  });
});

describe('ResultSkeleton', () => {
  it('matches the Result anatomy with an aria-hidden placeholder', () => {
    const { container } = render(<ResultSkeleton />);
    expect(container.firstElementChild).toHaveClass('cb-result', 'cb-result--skeleton');
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('.cb-skeleton')).toHaveLength(5);
  });
});
