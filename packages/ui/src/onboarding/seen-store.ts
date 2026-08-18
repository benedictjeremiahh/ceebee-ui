/**
 * How a Tour asks whether someone has already been through it.
 *
 * The library ships this interface and no implementation on purpose (ADR 0006): a library that
 * reaches for localStorage has decided what a user is and where their state lives, and that is
 * the assumption that makes an onboarding library impossible to remove later.
 *
 * A localStorage adapter is four lines; a server-backed one is a fetch. Both are yours.
 */
export interface SeenStore {
  /** Whether this tour has been completed or skipped before. May be async. */
  has: (tourId: string) => boolean | Promise<boolean>;
  /** Records that it has now. Called once, when the tour finishes or is skipped. */
  mark: (tourId: string) => void | Promise<void>;
}
