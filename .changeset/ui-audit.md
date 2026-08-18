---
'@ceebee/ui': patch
---

Tidy-up pass over the whole surface.

The Switch was built from hand-tuned numbers and its thumb sat off-centre; its geometry is now
derived from the track's own dimensions, so the insets are equal on all four sides. NumberInput's
value was centred between two steppers while every other control's text starts at the same left
edge — the steppers moved to the trailing edge and the value lines up with the rest of a form.

Colour and focus rings are fully tokenised: the dialog scrim, the coachmark spotlight, and the
warning button's foreground were literal `oklch()` values, and five different `outline-offset`
numbers are now two tokens (`--cb-focus-offset` and `--cb-focus-offset-inset`).

The neutral text ramp failed WCAG AA in light mode — hint and description text measured 2.89:1
against its surface. Muted and subtle are re-spread and now measure 7.16:1 and 4.70:1 in light,
9.25:1 and 5.41:1 in dark. List items and `<kbd>` elements the library renders gained margin
resets, so a host app's typography can no longer inflate them, and the Donut now honours reduced
motion like the ProgressRing already did.
