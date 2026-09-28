# Schedule fullscreen retains the reading context

The opt-in `Schedule.fullscreen` follows the element-level native API from ADR 0024, without
adding pan/zoom canvas behavior to a calendar. Its toolbar, footer, menus and inline item dialogs
belong inside the promoted root. Returning inline preserves the consumer's controlled view and
item expansion; the substrate may rebuild its axis when the available width changes.

Schedule additionally supports an isolated application-window view when the native API is absent
or denied. It is labelled **Expand view**, not **Fullscreen**, and says that Escape returns inline.
The fallback temporarily makes outside siblings inert and restores them and the trigger's focus
on exit. This is a Schedule-specific reading contract, not a new general-purpose overlay primitive,
and does not change PanZoomCanvas's unsupported-browser behavior. Body-portal dialogs must be
rendered inline inside Schedule (`getContainer={false}`) to remain visible in native fullscreen.
