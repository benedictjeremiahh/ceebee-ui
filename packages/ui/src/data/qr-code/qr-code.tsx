import { encode } from 'uqr';
import type { Size } from '../../lib/cn.js';

export type QRCodeErrorCorrection = 'L' | 'M' | 'Q' | 'H';

export interface QRCodeProps {
  /** Text or URL encoded into the matrix. Must not be empty. */
  value: string;
  /** Accessible description of what scanning the code does. */
  label: string;
  size?: Size;
  errorCorrection?: QRCodeErrorCorrection;
  /** Raises error correction when the same QR version has spare capacity. */
  boostErrorCorrection?: boolean;
}

/**
 * Server-safe SVG QR image. uqr owns standards-compliant matrix encoding; Ceebee owns only the
 * accessible SVG and Token-based presentation.
 */
export function QRCode({
  value,
  label,
  size = 'md',
  errorCorrection = 'M',
  boostErrorCorrection = true,
}: QRCodeProps) {
  if (value.length === 0) throw new RangeError('QRCode value must not be empty.');
  if (label.trim().length === 0) throw new RangeError('QRCode label must not be empty.');

  const matrix = encode(value, {
    ecc: errorCorrection,
    boostEcc: boostErrorCorrection,
    // Four light modules are the ISO quiet-zone recommendation. This is encoding geometry,
    // not visual spacing, so it intentionally does not use a CSS Token.
    border: 4,
  });

  return (
    <svg
      className={`cb-qr-code cb-qr-code--${size}`}
      viewBox={`0 0 ${matrix.size} ${matrix.size}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="cb-qr-code__background" width={matrix.size} height={matrix.size} />
      <path className="cb-qr-code__modules" d={matrixPath(matrix.data)} />
    </svg>
  );
}

function matrixPath(data: boolean[][]) {
  const commands: string[] = [];
  for (let row = 0; row < data.length; row += 1) {
    for (let column = 0; column < data[row]!.length; column += 1) {
      if (data[row]![column]) commands.push(`M${column} ${row}h1v1h-1z`);
    }
  }
  return commands.join('');
}

