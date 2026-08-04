// The main content area beside the sidebar — full width/height of whatever
// space it has, flush against the browser window's top/right/bottom edges
// (no margin, no padding, no rounded corners). Not a floating card: the
// only edge that needs visual separation is the left one, where the sidebar
// sits underneath it, so the shadow is one-sided — a plain `box-shadow`
// with a negative x-offset and no y-offset, which only reads as a shadow
// against the sidebar to its left. The top/right/bottom edges are the
// viewport's own edges, so there's nothing there for a shadow to fall on
// even if it bled that way (a small negative spread keeps it from bleeding
// there in the first place). Disabled entirely in dark mode, not dimmed —
// same card-idiom convention as everywhere else in this system (design.txt
// §5); the hairline border on the sidebar's own right edge is what still
// separates the two there.
//
// Deliberately a plain div, not a `Squircle` — the earlier floating-card
// version wrapped this in `Squircle` for the rounded corners, whose
// `ResizeObserver` recomputes and repaints an SVG path on every frame of
// the sidebar's width transition. Combined with a `drop-shadow` filter
// (required for a `Squircle`, see §4) repainting on the same frames, that
// was real, avoidable per-frame cost stacked directly on top of the
// sidebar's own layout-triggering width transition — a likely contributor
// to the animation reading as jittery. A plain rectangle has no shape to
// redraw and a `box-shadow` is far cheaper to repaint than a filter, so
// removing the card here is a performance fix as much as a visual one.
const LEFT_SHADOW = "shadow-[-12px_0_24px_-12px_rgba(28,29,33,0.18)] dark:shadow-none";

// `pt-14` on mobile only: `Sidebar`'s hamburger trigger is `fixed top-3
// left-3`, which otherwise sits directly on top of whatever the page
// renders first — not a "content has padding" exception, the trigger
// itself needs somewhere to be that isn't on top of a heading. Gone at
// `md`, where the trigger doesn't render at all.
export function ContentPane({ children }: { children: React.ReactNode }) {
	return <main className={`h-full min-w-0 flex-1 overflow-y-auto bg-[#fefefe] pt-14 md:pt-0 dark:bg-[#121212] ${LEFT_SHADOW}`}>{children}</main>;
}
