// Shared content max-width across the marketing route's header/hero/footer —
// the one thing tying them together visually. Keep every full-bleed section
// (a colored bar spanning the viewport) built as an outer full-width element
// wrapping an inner element constrained to this, so header/hero/footer all
// line up at the same edges.
export const MARKETING_MAX_WIDTH = "max-w-[1200px]";
