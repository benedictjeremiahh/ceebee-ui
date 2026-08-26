import { render, screen } from '@testing-library/react';
import { encode } from 'uqr';
import { describe, expect, it } from 'vitest';
import { QRCode } from './qr-code.js';

describe('QRCode', () => {
  it('renders the encoder matrix as one accessible crisp SVG path', () => {
    const value = 'https://ceebee.dev/docs';
    const expected = encode(value, { ecc: 'M', boostEcc: true, border: 4 });
    const { container } = render(<QRCode value={value} label="Open Ceebee documentation" />);
    const image = screen.getByRole('img', { name: 'Open Ceebee documentation' });

    expect(image).toHaveAttribute('viewBox', `0 0 ${expected.size} ${expected.size}`);
    expect(image).toHaveAttribute('shape-rendering', 'crispEdges');
    expect(container.querySelectorAll('.cb-qr-code__modules')).toHaveLength(1);
    expect(container.querySelector('.cb-qr-code__modules')?.getAttribute('d')).toContain('M');
  });

  it('keeps a four-module light quiet zone on every matrix edge', () => {
    const matrix = encode('Ceebee quiet zone', { ecc: 'M', boostEcc: true, border: 4 }).data;
    const size = matrix.length;

    for (let offset = 0; offset < 4; offset += 1) {
      expect(matrix[offset]!.every((module) => module === false)).toBe(true);
      expect(matrix[size - 1 - offset]!.every((module) => module === false)).toBe(true);
      expect(matrix.every((row) => row[offset] === false)).toBe(true);
      expect(matrix.every((row) => row[size - 1 - offset] === false)).toBe(true);
    }
  });

  it('keeps encoded data out of accessible and data attributes', () => {
    const secret = 'otpauth://totp/Ceebee:member?secret=EXAMPLE';
    const { container } = render(<QRCode value={secret} label="Set up an authenticator" />);
    expect(container.innerHTML).not.toContain(secret);
    expect(screen.getByRole('img')).not.toHaveAttribute('data-value');
  });

  it('supports every standard error-correction level and Token size', () => {
    const { rerender } = render(<QRCode value="Ceebee" label="Ceebee code" size="sm" errorCorrection="L" />);
    expect(screen.getByRole('img')).toHaveClass('cb-qr-code--sm');

    for (const level of ['M', 'Q', 'H'] as const) {
      rerender(<QRCode value="Ceebee" label="Ceebee code" size="lg" errorCorrection={level} />);
      expect(screen.getByRole('img')).toHaveClass('cb-qr-code--lg');
    }
  });

  it('rejects empty content and inaccessible labels', () => {
    expect(() => render(<QRCode value="" label="Empty code" />)).toThrow(RangeError);
    expect(() => render(<QRCode value="content" label="  " />)).toThrow(RangeError);
  });
});
