"use client";

// The component-showcase layout used by every page under `(main)/components/`
// — explicitly NOT the bordered/shadowed "card" grid from the reference
// screenshot. Each row of up to 3 tiles is treated like one of the marketing
// hero's stacked sections: a `HorizontalLine` above it, `VerticalLine`s
// scoped to its own height for column dividers, the same dashed look
// throughout. No `bg-*`/`border`/`shadow` anywhere in this file — the grid
// lines *are* the only visual separation, on purpose.
//
// Not a blind copy of hero.tsx, though — two real differences:
// 1. Every line here is `animate={false}`. Hero's `whileInView` grow-in
//    entrance depends on an `IntersectionObserver` watching the real
//    browser viewport, which is correct for hero (a normal top-level
//    scrolling page) but not for this grid — it renders inside the app
//    shell's *nested* `overflow-y-auto` content pane (see
//    `app/(main)/_components/content-pane.tsx`), and `whileInView`
//    doesn't reliably fire/complete against that nested scroll container.
//    Lines were getting stuck a few px into their grow animation — full
//    width/height never reached — which is exactly what read as "missing"
//    dividers. `animate={false}` renders the fully-grown state directly, no
//    observer involved.
// 2. Circles go on all 4 outer corners of the grid (hero only needed 2, for
//    one decorative accent on an elongated single column) — see `corner`
//    on `GridCircle`.
// Every row divider and column divider is real and always-on, not
// conditionally present depending on scroll timing.

import { cn } from "@/lib/utils";
import { Text } from "@/components/typography/text-styles";
import { VerticalLine, HorizontalLine, GridCircle } from "@/components/layout/grid-lines";

// Baseline styling for each demo's own top-level trigger button — applied
// via `[&>button]`, a *direct-child-only* selector. Verified against all 19
// transitions-dev components before relying on this: every one of them
// either renders its trigger as a direct sibling of whatever it's mounted
// inside (a bare React Fragment — `<><button>Animate</button><div>...</div
// ></>` — so the button becomes a direct child of this stage div) or IS the
// returned root element itself (icon-swap, notification-badge). Buttons
// nested a level deeper — a modal's "Close", a dropdown's menu items — are
// never direct children, so this rule never touches them; those get their
// own explicit selectors per tile instead. Without this, every demo's
// trigger renders as a bare unstyled browser `<button>`, since these are
// self-contained snippets with no styling of their own beyond the specific
// transition they demonstrate.
//
// `order-last` is what actually unifies every trigger's *position*, not
// just its look: several of these vendor snippets render the button before
// their content in the Fragment (`<button>Animate</button><div>...</div>`),
// a couple render it after — `order-last` sorts the button to the end of
// its flex column regardless of that DOM order, so every demo reads as
// "content, then the button that plays it" (the error-shake tile is the
// reference). This only works paired with `flex-col` on the tile — never
// `flex-col-reverse`, which would flip the already-sorted sequence and put
// the button back on top.
export const DEFAULT_TRIGGER_STYLE =
	"[&>button]:order-last [&>button]:rounded-full [&>button]:bg-[#f0f0f0] [&>button]:px-3 [&>button]:py-1.5 [&>button]:text-xs [&>button]:font-medium [&>button]:text-[#1d1d1d] [&>button]:transition-colors [&>button]:duration-200 [&>button]:hover:bg-[#e5e5e5] dark:[&>button]:bg-[#171717] dark:[&>button]:text-[#f0f0f0] dark:[&>button]:hover:bg-[#1f1f1f]";

export type ShowcaseTileDef = {
	title: string;
	description: string;
	children: React.ReactNode;
	/** Overrides the demo stage's default `min-h-48` — some demos (a modal, a multi-step slide) need more room than a static icon-swap does. */
	stageClassName?: string;
	/** Extra classes for the stage wrapper — used to reach into a demo's own hardcoded internal class names (e.g. `[&_.t-resize]:bg-...`) for the handful that render an otherwise-invisible or unstyled element. */
	stageExtraClassName?: string;
	/** Takes 2 of the row's 3 columns instead of 1 — for a demo that's genuinely wider than a third of the grid (a search bar, a wide slide), not a default to reach for. Counts as 2 toward each row's 3-slot budget, so a `span: 2` tile pairs with exactly one `span: 1` tile per row. */
	span?: 2;
};

// Packs tiles into rows of up to 3 *slots*, where a `span: 2` tile consumes
// 2 slots — not a simple `items.length / 3` chunk, since a wide tile changes
// how many tiles fit in its own row.
function chunkBySlots(items: ShowcaseTileDef[], slotsPerRow: number): ShowcaseTileDef[][] {
	const rows: ShowcaseTileDef[][] = [];
	let current: ShowcaseTileDef[] = [];
	let used = 0;
	for (const item of items) {
		const weight = item.span ?? 1;
		if (used + weight > slotsPerRow) {
			rows.push(current);
			current = [];
			used = 0;
		}
		current.push(item);
		used += weight;
	}
	if (current.length) rows.push(current);
	return rows;
}

export function ShowcaseGrid({ tiles }: { tiles: ShowcaseTileDef[] }) {
	const rows = chunkBySlots(tiles, 3);

	return (
		<div className="relative w-full">
			<VerticalLine side="left" animate={false} />
			<VerticalLine side="right" animate={false} />
			{/* All 4 corners live on the outer wrapper, not per-row/per-tile —
			    a partial last row (fewer than 3 tiles) still needs the bottom
			    corners at the *grid's* actual right/bottom edge, not wherever
			    the last real tile's own cell happens to end. */}
			<GridCircle corner="top-left" />
			<GridCircle corner="top-right" className="hidden md:block" />
			<GridCircle corner="bottom-left" className="hidden md:block" />
			<GridCircle corner="bottom-right" />

			{rows.map((row, rowIndex) => {
				// A row lighter than 3 slots (the last row of a group, usually)
				// still needs its remaining column boundaries drawn — otherwise
				// the last real tile's right edge just looks like the divider was
				// forgotten, when actually there was never a cell rendered there
				// to hang it off of. Phantom cells carry nothing but the left
				// divider that completes the row to a full 3 columns.
				const usedSlots = row.reduce((sum, tile) => sum + (tile.span ?? 1), 0);
				const phantomCount = Math.max(0, 3 - usedSlots);

				return (
					<div key={rowIndex} className="relative w-full">
						<HorizontalLine animate={false} />

						<div className="grid grid-cols-1 md:grid-cols-3">
							{row.map((tile, colIndex) => {
								return (
									<div
										key={tile.title}
										className={cn("relative flex flex-col gap-4 p-6 md:p-8", tile.span === 2 && "md:col-span-2")}
									>
										{/* Column divider — scoped to this cell's own height, same
										    `side="left"` idiom hero.tsx uses for its outer frame,
										    just repeated per row. Hidden below `md`: at 1 column
										    there's no side-by-side neighbor to divide from. */}
										{colIndex > 0 && <VerticalLine side="left" animate={false} className="hidden md:block" />}
										{/* Row separator for the 1-column mobile layout, where
										    items 2/3 stack under item 1 instead of beside it —
										    the row-level `HorizontalLine` above only separates
										    whole rows, not individual stacked tiles. */}
										{colIndex > 0 && <HorizontalLine animate={false} className="md:hidden" />}

										<div className="flex flex-col gap-1">
											<Text variant="title" className="text-base">
												{tile.title}
											</Text>
											<Text variant="secondary" className="text-sm">
												{tile.description}
											</Text>
										</div>

										<div
											className={cn(
												"relative flex flex-1 items-center justify-center",
												tile.stageClassName ?? "min-h-48",
												DEFAULT_TRIGGER_STYLE,
												tile.stageExtraClassName,
											)}
										>
											{tile.children}
										</div>
									</div>
								);
							})}
							{Array.from({ length: phantomCount }, (_, i) => (
								<div key={`phantom-${i}`} aria-hidden className="relative hidden md:block">
									<VerticalLine side="left" animate={false} />
								</div>
							))}
						</div>
					</div>
				);
			})}

			<HorizontalLine animate={false} />
		</div>
	);
}
