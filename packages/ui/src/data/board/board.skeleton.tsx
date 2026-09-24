import './board.css';

export interface BoardSkeletonProps {
  /** How many columns to stand in for — the same shape the real board will draw. */
  columns?: number;
  /** Cards per column. */
  cards?: number;
  /** Stand in for the columns' add-a-card footer, so the board grows no row when the real one arrives. */
  addCard?: boolean;
  label?: string;
}

/**
 * The board's placeholder, built from the same geometry as the board itself, so the page does not
 * reflow when the real columns arrive.
 */
export function BoardSkeleton({ columns = 3, cards = 3, addCard = false, label = 'Loading board' }: BoardSkeletonProps) {
  return (
    <div className="cb-board" aria-busy="true" aria-label={label}>
      <div className="cb-board__surface">
        {Array.from({ length: columns }, (_, column) => (
          <section className="cb-board__column" key={column}>
            <header className="cb-board__head">
              <span className="cb-board__ghost cb-board__ghost cb-board__ghost--name" />
              <span className="cb-board__ghost cb-board__ghost cb-board__ghost--count" />
            </header>
            <ol className="cb-board__list">
              {Array.from({ length: cards }, (_, card) => (
                <li className="cb-board__card cb-board__ghost-card" key={card} />
              ))}
            </ol>
            {addCard ? <span className="cb-board__ghost cb-board__ghost--add" /> : null}
          </section>
        ))}
      </div>
    </div>
  );
}
