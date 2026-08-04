"use client";

// General-purpose app-shell sidebar — a two-state (icon-rail / expanded) nav
// rail on desktop, an off-canvas overlay drawer on mobile. Not a specific
// app's nav content: `items` supplies the pinned top actions, `children` is
// the scrollable dynamic region (a list of docs, chat history, whatever the
// app actually is), `footer` is the pinned bottom slot (account menu, theme
// toggle, etc). None of that is hardcoded here — see design.txt §6's
// recurring question: this component only owns the shape/behavior, never
// the content.
//
// Desktop: NOT a free-drag resize — plain two-state width toggle animated
// via a single `transition-[width]` class on one flex child. A free-drag
// implementation needs a mousemove-driven ref/state loop mirrored across two
// separately-positioned elements (the old reminders sidebar did this) —
// easy for the two to fall a frame out of sync, which is what actually read
// as "jittery" there. A flex layout sidesteps the whole category: the
// content pane is a plain `flex-1` sibling, so it always exactly fills the
// remaining space with zero manual width math, in perfect lockstep with the
// sidebar's own width transition.
//
// Mobile: a persistent icon rail has no useful width to collapse to on a
// phone-sized viewport — there's no room for both a rail and real content.
// Below the `md` breakpoint the sidebar is fully off-canvas by default and
// slides in as a `fixed` overlay (`transform`, not `width` — a GPU-only
// property, no layout recalculation on every frame) with a backdrop, closed
// by tapping the backdrop or navigating.
//
// Labels (the title, each nav item) are a plain conditional render, not an
// `AnimatePresence`/`motion.span` fade — that was an earlier version of
// this file. A Framer Motion exit animation and a CSS `transition-[width]`
// are two independent animation engines with no shared clock; running both
// at once for the same collapse/expand gesture is exactly the kind of
// "two systems that can fall out of step" this file already avoids for
// desktop vs. free-drag resize. Labels now just disappear the instant
// `collapsed` flips, and the width transition alone carries the motion.
//
// Icon centering in the collapsed rail is done with a *constant* padding
// value, the same in both states, not a `collapsed`-conditional one. Two
// earlier versions tried conditional values here — first `justify-center`
// (snaps instantly, since it isn't a value browsers interpolate, so the
// icon jumped straight to the center of whatever width the `<aside>`
// happened to be at that instant rather than easing there), then an
// animated padding change (smoother, but still a real, if small, position
// shift on every toggle). The simplest fix is to not need an animation at
// all: pick one padding value that's already correct for the collapsed
// rail, and just leave it there in the expanded state too, where the extra
// few px of inset makes no visible difference. If nothing about an
// element's position ever changes, there's nothing to animate and nothing
// that can visibly move.
//
// The padding value is chosen to exactly fill the rail's known collapsed
// width, not just "look about centered": `md:w-16` (64px) minus `nav`'s own
// `p-2` (8px × 2) leaves 48px for `SidebarItem`; a 16px icon in `px-4`
// (16px × 2) padding exactly accounts for all 48px, so left/right margins
// are equal by construction, not by eyeballing it. Same idea for the footer
// slot against a 40px icon-sized `Button` (`px-3`, 64 − 12×2 = 40). This
// only holds because the numbers are known constants (rail width, icon
// size) — it isn't a generic centering trick for arbitrary footer content.

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, PanelLeftIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/buttons";
import { useMediaQuery } from "@/hooks/use-media-query";

const COLLAPSED_WIDTH = "md:w-16";
const EXPANDED_WIDTH = "md:w-64";

export type SidebarNavItem = {
	icon: LucideIcon;
	label: string;
	href: string;
};

type SidebarProps = {
	/** Pinned top actions (icon + label rows) — e.g. Home, Search, New. */
	items?: SidebarNavItem[];
	/** The scrollable, app-specific middle region — a nav list, doc tree, chat history, etc. Scrollbar is hidden (`.no-scrollbar`), not removed — content still scrolls normally. */
	children?: React.ReactNode;
	/** Pinned bottom slot — account menu, theme toggle, whatever the app needs there. */
	footer?: React.ReactNode;
	/** Optional wordmark/logo shown next to the collapse toggle when expanded. */
	title?: string;
};

export function Sidebar({ items = [], children, footer, title }: SidebarProps) {
	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const pathname = usePathname();

	// Adjusting state in response to a prop/derived value changing (here,
	// the route) belongs during render, not in an effect — see the React
	// docs on "storing information from previous renders". Closing the
	// mobile drawer after a nav-link click is exactly that case: comparing
	// against the last-seen pathname and calling setState directly in the
	// render body, no `useEffect` involved.
	const [prevPathname, setPrevPathname] = useState(pathname);
	if (pathname !== prevPathname) {
		setPrevPathname(pathname);
		if (mobileOpen) setMobileOpen(false);
	}

	const toggle = () => (isDesktop ? setCollapsed((prev) => !prev) : setMobileOpen(false));

	// `collapsed` alone isn't enough to gate icon-rail-specific styling — on
	// mobile the `<aside>` never actually narrows (its width classes are all
	// `md:`-scoped), so a `collapsed` value left over from a previous
	// desktop session shouldn't trigger the rail's centered padding there.
	const isRailCollapsed = collapsed && isDesktop;

	return (
		<>
			{/* Mobile-only trigger to reopen the drawer once it's closed — the
			    toggle button inside the sidebar itself is unreachable while the
			    sidebar is off-canvas. */}
			<Button
				variant="secondary"
				size="icon"
				aria-label="Open sidebar"
				onClick={() => setMobileOpen(true)}
				className={cn("fixed top-3 left-3 z-30 md:hidden", mobileOpen && "pointer-events-none opacity-0")}
			>
				<MenuIcon className="size-4" />
			</Button>

			<div
				aria-hidden
				onClick={() => setMobileOpen(false)}
				className={cn(
					"fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden",
					mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
				)}
			/>

			<aside
				className={cn(
					"flex h-full w-72 shrink-0 flex-col overflow-hidden",
					"bg-[#f0f0f0] dark:bg-[#171717]",
					"border-r-[0.5px] border-solid border-[rgba(225,228,232,0.8)] dark:border-[rgba(29,29,29,0.8)]",
					// Mobile: fixed overlay, closed by default, slides in via transform.
					"fixed inset-y-0 left-0 z-50 -translate-x-full transition-transform duration-300 ease-in-out",
					mobileOpen && "translate-x-0",
					// Desktop: back in normal flex flow, width animates instead. The
					// `md:w-16`/`md:w-64` below is what overrides the mobile `w-72`
					// at that breakpoint — no separate `md:w-auto` needed (and one
					// would risk fighting these on specificity/source-order).
					"md:relative md:inset-auto md:z-0 md:translate-x-0 md:transition-[width] md:duration-300 md:ease-in-out",
					collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
				)}
			>
				<div className="flex h-14 shrink-0 items-center gap-2 px-3">
					<Button variant="ghost" size="icon" aria-label={isDesktop ? (collapsed ? "Expand sidebar" : "Collapse sidebar") : "Close sidebar"} onClick={toggle}>
						<PanelLeftIcon className="size-4" />
					</Button>
					{!isRailCollapsed && title && (
						<span className="truncate text-sm font-medium text-[#1d1d1d] dark:text-[#f0f0f0]">{title}</span>
					)}
				</div>

				{items.length > 0 && (
					<nav className="flex flex-col gap-1 p-2">
						{items.map((item) => (
							<SidebarItem key={item.href} item={item} collapsed={isRailCollapsed} active={pathname === item.href} />
						))}
					</nav>
				)}

				<div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-2">{children}</div>

				{footer && (
					<div className="flex shrink-0 items-center gap-2 border-t-[0.5px] border-solid border-[rgba(225,228,232,0.8)] px-3 py-2 dark:border-[rgba(29,29,29,0.8)]">
						{footer}
					</div>
				)}
			</aside>
		</>
	);
}

function SidebarItem({ item, collapsed, active }: { item: SidebarNavItem; collapsed: boolean; active: boolean }) {
	const Icon = item.icon;

	return (
		<Link
			href={item.href}
			aria-label={item.label}
			className={cn(
				// `min-h-9`: without it, this row's height comes from its content
				// — the label's `text-sm` line-height (20px) vs. the bare 16px
				// icon — so hiding the label on collapse shrinks the row by a few
				// px, the same "thing I didn't mean to animate just moved" bug as
				// the padding/justify-center issues above, just on the vertical
				// axis. `min-h-9` (36px) covers both: it's a no-op when the label's
				// line-height already clears it, and a floor when the icon alone
				// wouldn't.
				"group flex min-h-9 shrink-0 items-center gap-2.5 rounded-[10px] px-4 py-2 text-sm",
				"transition-colors duration-200",
				active ? "bg-[#e5e5e5] text-[#1d1d1d] dark:bg-[#1f1f1f] dark:text-[#f0f0f0]" : "text-[#646464] hover:bg-[#e5e5e5] hover:text-[#1d1d1d] dark:text-[#a1a1a1] dark:hover:bg-[#1f1f1f] dark:hover:text-[#f0f0f0]",
			)}
		>
			<Icon className="size-4 shrink-0" />
			{!collapsed && <span className="truncate">{item.label}</span>}
		</Link>
	);
}
