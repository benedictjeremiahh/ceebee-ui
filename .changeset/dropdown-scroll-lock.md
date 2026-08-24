---
"@ceebee/ui": patch
---

**An open `AutoComplete` list no longer rides over the page's sticky chrome.**

The popup follows its anchor, and a page that scrolls takes the anchor with it.
Measured at 390px against a sticky masthead, stepping the scroll:

```
scrollY  anchorTop  overlapsHeader  anchorHidden
    120         23           false         false
    180        -37            TRUE         false
    240        -97            TRUE          true
```

The anchor slides under the header while the popup, at `--cb-z-dropdown`, goes
on being painted above it. Base UI marks the anchor hidden only once it has left
the viewport entirely, so there is a band of scroll where nothing knows anything
is wrong.

No z-index settles it — a dropdown opened *from* sticky chrome has to be above
it, and one whose anchor has scrolled under it must not be — so the fix is
behavioural. `AutoComplete` is modal now, which is what Base UI already makes a
`Select` by default: the page is held still while the list is open and the
situation cannot arise. On a touch device Base UI deliberately leaves the page
scrollable (matching a native picker), so there the list closes on a page scroll
instead. Scrolling the list itself does not close it.

No API change. If you were relying on being able to scroll the page with an
`AutoComplete` open, that is what changes.
