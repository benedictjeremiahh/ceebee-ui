import { Fragment } from 'react';

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/** Hand-written for now; generating these from the .d.ts is a later slice. */
export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <table className="props">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Fragment key={row.name}>
            <tr>
              <td>{row.name}</td>
              <td>{row.type}</td>
              <td>{row.default ?? '—'}</td>
              <td>{row.description}</td>
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

export function Guidance({ do: doText, dont }: { do: string; dont: string }) {
  return (
    <div className="guidance">
      <div className="guidance__item" data-kind="do">
        <p className="guidance__kind">Do</p>
        <p>{doText}</p>
      </div>
      <div className="guidance__item" data-kind="dont">
        <p className="guidance__kind">Don&apos;t</p>
        <p>{dont}</p>
      </div>
    </div>
  );
}
