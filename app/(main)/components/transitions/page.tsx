"use client";

// Showcases every component in components/transitions-dev/ — third-party,
// self-contained snippets from transitions.dev, imported as-is (two noted
// exceptions, see clear-input.tsx and skeleton-reveal.tsx's own headers).
// They're not part of this template's own design system the way
// Button/Squircle/Shadow are: each ships its own scoped CSS (injected into
// <head> on first import) and its own internal trigger, so this page's job
// is to give each one a properly-sized stage, content that actually looks
// like what the transition is for (a real profile card, not a gray box),
// and — where a demo would otherwise render invisible or unstyled (a bare
// `<div>` with no background, an unstyled dropdown) — a bit of wrapper CSS
// reaching into its own hardcoded class names (`stageExtraClassName`). Not
// every tile is the same size: `span: 2` widens the handful that are
// genuinely wider than a third of the grid (a search bar, a profile card),
// rather than forcing every demo into the same box regardless of content.

import { useState } from "react";
import { BellIcon, HeartIcon, LayoutGridIcon, ListIcon, KanbanSquareIcon, SearchIcon, PencilIcon, Trash2Icon, SparkleIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Text } from "@/components/typography/text-styles";
import { ShowcaseGrid, type ShowcaseTileDef } from "@/components/layout/showcase-grid";

import { InputShake } from "@/components/transitions-dev/error-shake";
import { SuccessCheck } from "@/components/transitions-dev/success-check";
import { NotificationBadge } from "@/components/transitions-dev/notification-badge";
import { SkeletonReveal } from "@/components/transitions-dev/skeleton-reveal";
import { NumberPopIn } from "@/components/transitions-dev/number-loop";
import { StaggerReveal } from "@/components/transitions-dev/text-reveal";
import { Shimmer } from "@/components/transitions-dev/text-shimmer";
import { TextStatesSwap } from "@/components/transitions-dev/text-state-swap";
import { CardResize } from "@/components/transitions-dev/cardresize";
import { PanelReveal } from "@/components/transitions-dev/panel";
import { Modal } from "@/components/transitions-dev/modal";
import { PageSlide } from "@/components/transitions-dev/sidebyside";
import { SlidingTabs } from "@/components/transitions-dev/tab-slider";
import { TiltCard } from "@/components/transitions-dev/tilt-hover";
import { AvatarGroup } from "@/components/transitions-dev/avatar-grouphover";
import { IconSwap } from "@/components/transitions-dev/icon-swap";
import { MenuDropdown } from "@/components/transitions-dev/menu-dropdown";
import { Tooltip } from "@/components/transitions-dev/tooltip";
import { ClearInput } from "@/components/transitions-dev/clear-input";
import { Folder } from "@/components/transitions-dev/folder";

const AVATAR_COLORS = ["#0069cc", "#169b40", "#fc9601", "#9659b9"];

function TabSliderDemo() {
	const [active, setActive] = useState("grid");
	const tabs = [
		{ id: "grid", label: "Grid view", content: <LayoutGridIcon className="size-4" /> },
		{ id: "list", label: "List view", content: <ListIcon className="size-4" /> },
		{ id: "board", label: "Board view", content: <KanbanSquareIcon className="size-4" /> },
	];
	return <SlidingTabs tabs={tabs} activeId={active} onChange={setActive} />;
}

// Cycles through a few short values instead of just replaying the same one
// — the "pop in" only reads as a real transition if the value it's
// transitioning *to* is visibly different each time. Short (~3 char)
// values on purpose: number-loop.tsx's stagger CSS only defines delays for
// the first three digits (see its own file header), so longer values would
// look like the stagger cuts out partway through.
const REVENUE_VALUES = ["247", "812", "365", "594"];

function NumberPopInDemo() {
	const [index, setIndex] = useState(0);
	return (
		<div className="flex flex-col items-center gap-3">
			<Text variant="label">New signups</Text>
			<div className="flex flex-col items-center gap-3 text-4xl font-semibold tabular-nums">
				<NumberPopIn value={REVENUE_VALUES[index]} onBeforeReplay={() => setIndex((i) => (i + 1) % REVENUE_VALUES.length)} />
			</div>
		</div>
	);
}

function ProfileAvatar({ className = "size-11" }: { className?: string }) {
	return (
		<div className={`${className} shrink-0 rounded-full bg-[linear-gradient(135deg,#0069cc,#50aef6)]`} />
	);
}

const FEEDBACK_TILES: ShowcaseTileDef[] = [
	{
		title: "Error shake",
		description: "Click Animate to trigger a validation error on a real form field — the input shakes and the message fades in, then self-reverts.",
		children: (
			<InputShake message="That name is already taken." onCancel={() => {}}>
				<input
					type="text"
					defaultValue="John"
					className="w-48 rounded-lg border border-[rgba(225,228,232,0.8)] bg-[#fefefe] px-3 py-2 text-sm outline-none dark:border-[rgba(29,29,29,0.8)] dark:bg-[#121212]"
				/>
			</InputShake>
		),
		stageExtraClassName: "flex-col-reverse gap-3 [&_.t-error-msg]:mt-1 [&_.t-error-msg]:text-xs [&_.t-error-msg]:text-[#fc3e2f]",
	},
	{
		title: "Success check",
		description: "A checkmark that fades, rotates, and draws itself in on a tinted badge — click Animate to replay it.",
		children: (
			<SuccessCheck>
				<span className="flex size-14 items-center justify-center rounded-full bg-[#169b40]/10">
					<svg viewBox="0 0 24 24" fill="none" className="size-7 text-[#169b40]" xmlns="http://www.w3.org/2000/svg">
						<path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</span>
			</SuccessCheck>
		),
		stageExtraClassName: "flex-col gap-3",
	},
	{
		title: "Notification badge",
		description: "Click the bell to toggle an unread count popping in and out, the way a real notification trigger would.",
		children: <NotificationBadge>{<BellIcon className="size-4" />}</NotificationBadge>,
		// The bell itself is the trigger here, not a labeled "Animate" button —
		// it gets its own circular icon-button treatment instead of the shared
		// text-pill style, plus the badge dot's own rule.
		stageExtraClassName:
			"[&>button]:rounded-full [&>button]:!bg-[#f0f0f0] [&>button]:!p-3 dark:[&>button]:!bg-[#171717] [&_.t-badge-dot]:inline-flex [&_.t-badge-dot]:min-w-4 [&_.t-badge-dot]:min-h-4 [&_.t-badge-dot]:items-center [&_.t-badge-dot]:justify-center [&_.t-badge-dot]:rounded-full [&_.t-badge-dot]:bg-[#fc3e2f] [&_.t-badge-dot]:px-[3px] [&_.t-badge-dot]:py-[3px] [&_.t-badge-dot]:text-[9px] [&_.t-badge-dot]:leading-none [&_.t-badge-dot]:font-semibold [&_.t-badge-dot]:text-white",
	},
	{
		title: "Skeleton reveal",
		description: "Click Animate to replay a loading pulse cross-fading into a real profile card — not just gray bars fading to more gray bars.",
		span: 2,
		children: (
			<SkeletonReveal
				skeleton={
					<div className="flex w-56 items-center gap-2">
						<div className="size-9 shrink-0 rounded-full bg-[#e5e5e5] dark:bg-[#1f1f1f]" />
						<div className="flex flex-1 flex-col gap-1.5">
							<div className="h-2.5 w-2/3 rounded-full bg-[#e5e5e5] dark:bg-[#1f1f1f]" />
							<div className="h-2.5 w-1/2 rounded-full bg-[#e5e5e5] dark:bg-[#1f1f1f]" />
						</div>
					</div>
				}
			>
				<div className="flex w-56 items-center gap-2">
					<ProfileAvatar className="size-9" />
					<div className="flex flex-col gap-0.5">
						<Text variant="paragraph" className="text-sm leading-none">
							Jane Cooper
						</Text>
						<Text variant="secondary" className="text-sm leading-none">
							jane.cooper@example.com
						</Text>
					</div>
				</div>
			</SkeletonReveal>
		),
		stageExtraClassName: "flex-col gap-3 [&_.t-skel]:h-9 [&_.t-skel]:w-56",
	},
];

const TEXT_TILES: ShowcaseTileDef[] = [
	{
		title: "Number pop-in",
		description: "A KPI counter that cycles to a new value each time — click Animate to see the digits pop in to a different number, not the same one on repeat.",
		children: <NumberPopInDemo />,
	},
	{
		title: "Staggered text reveal",
		description: "An empty-state message where the headline and subtext ease in with a slight stagger between them.",
		children: (
			<div className="flex flex-col items-center gap-1 text-center [&_span]:text-sm [&_span]:text-[#646464] [&_strong]:text-base [&_strong]:font-semibold">
				<StaggerReveal primary="You're all caught up" secondary="New notifications will show up here." />
			</div>
		),
	},
	{
		title: "Text shimmer",
		description: "An AI-style loading state — pure CSS, plays automatically on a loop, no click needed.",
		children: (
			<span className="flex items-center gap-2 text-sm font-medium">
				<SparkleIcon className="size-4 text-[#9659b9]" />
				<Shimmer>Generating response...</Shimmer>
			</span>
		),
		stageExtraClassName: "dark:[--shimmer-highlight:#f5f5f5]",
	},
	{
		title: "Text state swap",
		description: "A status line for a background job — click Next to cross-fade between two states.",
		children: (
			<div className="flex flex-col items-center gap-3 text-sm font-medium">
				<TextStatesSwap />
			</div>
		),
	},
];

const LAYOUT_TILES: ShowcaseTileDef[] = [
	{
		title: "Card resize",
		description: "A compact vs. detailed view toggle — click Shrink/Expand to tween a real card's width and height together.",
		children: <CardResize />,
		stageClassName: "min-h-56",
		stageExtraClassName:
			"flex-col-reverse gap-3 [&_.t-resize]:flex [&_.t-resize]:flex-col [&_.t-resize]:justify-end [&_.t-resize]:overflow-hidden [&_.t-resize]:rounded-xl [&_.t-resize]:border [&_.t-resize]:border-[rgba(225,228,232,0.8)] [&_.t-resize]:bg-[#fafafa] [&_.t-resize]:p-4 [&_.t-resize]:dark:border-[rgba(29,29,29,0.8)] [&_.t-resize]:dark:bg-[#1d1d1d]",
	},
	{
		title: "Panel reveal",
		description: "An inline \"show more\" affordance — click Show panel to slide extra detail into view, clipped by its own container.",
		children: (
			<PanelReveal>
				<div className="w-56 rounded-xl border border-[rgba(225,228,232,0.8)] bg-[#fafafa] p-4 dark:border-[rgba(29,29,29,0.8)] dark:bg-[#1d1d1d]">
					<Text variant="title" className="text-sm">
						Shipping details
					</Text>
					<Text variant="secondary" className="mt-1 text-xs">
						Arrives in 3–5 business days, tracked door to door.
					</Text>
				</div>
			</PanelReveal>
		),
		stageClassName: "min-h-56 flex-col-reverse gap-3",
	},
	{
		title: "Modal open/close",
		description: "A real confirmation dialog — click Open modal for a scale + fade entrance, Close plays a quicker reverse.",
		children: (
			<Modal>
				<Text variant="title" className="text-sm">
					Delete this project?
				</Text>
				<Text variant="secondary" className="mt-1 text-xs">
					This can&apos;t be undone. The project and its data will be permanently removed.
				</Text>
			</Modal>
		),
		stageClassName: "min-h-56",
		stageExtraClassName:
			"[&_.t-modal]:absolute [&_.t-modal]:inset-x-6 [&_.t-modal]:top-1/2 [&_.t-modal]:-translate-y-1/2 [&_.t-modal]:rounded-xl [&_.t-modal]:border [&_.t-modal]:border-[rgba(225,228,232,0.8)] [&_.t-modal]:bg-[#fefefe] [&_.t-modal]:p-4 [&_.t-modal]:shadow-lg [&_.t-modal]:dark:border-[rgba(29,29,29,0.8)] [&_.t-modal]:dark:bg-[#1d1d1d] [&_.t-modal_button]:mt-3 [&_.t-modal_button]:rounded-full [&_.t-modal_button]:bg-[#fc3e2f]/10 [&_.t-modal_button]:px-3 [&_.t-modal_button]:py-1 [&_.t-modal_button]:text-xs [&_.t-modal_button]:font-medium [&_.t-modal_button]:text-[#fc3e2f]",
	},
	{
		title: "Page side-by-side",
		description: "A tiny two-step flow — click Next/Back to slide between panes with a fade + blur.",
		children: <PageSlide />,
		stageExtraClassName:
			"[&_.t-page-slide]:relative [&_.t-page-slide]:h-24 [&_.t-page-slide]:w-48 [&_.t-page_h2]:text-sm [&_.t-page_h2]:font-medium [&_.t-page_button]:mt-2 [&_.t-page_button]:rounded-full [&_.t-page_button]:bg-[#f0f0f0] [&_.t-page_button]:px-3 [&_.t-page_button]:py-1 [&_.t-page_button]:text-xs [&_.t-page_button]:dark:bg-[#171717]",
	},
	{
		title: "Sliding tabs",
		description: "A view switcher — click a tab and the pill slides + resizes to match, driven by real measured positions.",
		children: <TabSliderDemo />,
	},
];

const HOVER_TILES: ShowcaseTileDef[] = [
	{
		title: "Tilt on hover",
		description: "A leaning photo card — move your pointer across it and it tilts toward you with a tracking glare.",
		children: (
			<div className="-rotate-2">
				<TiltCard>
					<div className="relative flex h-32 w-44 flex-col justify-end rounded-xl bg-[linear-gradient(160deg,#1a2b3b,#9659b9_60%,#ee98b7)] p-3 shadow-lg">
						<span className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[#1d1d1d]">Pro</span>
						<span className="text-sm font-medium text-white">Portrait, golden hour</span>
					</div>
				</TiltCard>
			</div>
		),
	},
	{
		title: "Avatar group hover",
		description: "A \"who's on this task\" stack — hover any avatar and it lifts, with neighbors lifting a little less.",
		children: (
			<AvatarGroup
				items={[
					...["A", "B", "C", "D"].map((letter, i) => (
						<div
							key={letter}
							className="flex size-9 items-center justify-center rounded-full border-2 border-[#fefefe] text-xs font-medium text-white dark:border-[#121212]"
							style={{ background: AVATAR_COLORS[i] }}
						>
							{letter}
						</div>
					)),
					<div
						key="overflow"
						className="flex size-9 items-center justify-center rounded-full border-2 border-[#fefefe] bg-[#e5e5e5] text-xs font-medium text-[#646464] dark:border-[#121212] dark:bg-[#1f1f1f] dark:text-[#a1a1a1]"
					>
						+2
					</div>,
				]}
			/>
		),
		stageExtraClassName: "[&>div]:flex [&>div]:items-center [&_.t-avatar:not(:first-child)]:-ml-3",
	},
	{
		title: "Icon swap",
		description: "A like button — click to cross-fade + scale between the outline and filled icon states.",
		// The heart itself is the trigger, not a labeled "Animate" button — same
		// circular icon-button treatment as the notification bell above.
		children: <IconSwap iconA={<HeartIcon className="size-5" />} iconB={<HeartIcon className="size-5 fill-current text-[#fc3e2f]" />} />,
		stageExtraClassName: "[&>button]:!rounded-full [&>button]:!bg-[#f0f0f0] [&>button]:!p-3 dark:[&>button]:!bg-[#171717]",
	},
	{
		title: "Folder",
		description: "A file-manager folder — hover to lift its cards slightly, click to fan them fully open with spring physics.",
		children: <Folder color="blue" size="sm" />,
		stageClassName: "min-h-72",
	},
];

const OVERLAY_TILES: ShowcaseTileDef[] = [
	{
		title: "Menu dropdown",
		description: "A row-actions menu — click Toggle menu for a scale + fade dropdown anchored below the trigger.",
		children: (
			<MenuDropdown
				items={[
					{ label: "Rename", icon: PencilIcon },
					{ label: "Delete", icon: Trash2Icon },
				]}
			/>
		),
		stageClassName: "min-h-40",
		stageExtraClassName:
			"[&_.t-dropdown]:absolute [&_.t-dropdown]:top-full [&_.t-dropdown]:mt-2 [&_.t-dropdown]:flex [&_.t-dropdown]:min-w-36 [&_.t-dropdown]:flex-col [&_.t-dropdown]:gap-0.5 [&_.t-dropdown]:rounded-xl [&_.t-dropdown]:border [&_.t-dropdown]:border-[rgba(225,228,232,0.8)] [&_.t-dropdown]:bg-[#fefefe] [&_.t-dropdown]:p-1 [&_.t-dropdown]:shadow-lg [&_.t-dropdown]:dark:border-[rgba(29,29,29,0.8)] [&_.t-dropdown]:dark:bg-[#1d1d1d] [&_[role=menuitem]]:flex [&_[role=menuitem]]:items-center [&_[role=menuitem]]:gap-2 [&_[role=menuitem]]:rounded-lg [&_[role=menuitem]]:px-3 [&_[role=menuitem]]:py-1.5 [&_[role=menuitem]]:text-left [&_[role=menuitem]]:text-sm [&_[role=menuitem]]:hover:bg-[#f0f0f0] [&_[role=menuitem]]:dark:hover:bg-[#171717] [&_[role=menuitem]_svg]:size-3.5 [&_[role=menuitem]_svg]:text-[#646464]",
	},
	{
		title: "Tooltip",
		description: "A labeled icon action — hover or focus the trigger, pure CSS, no JS state.",
		children: (
			<Tooltip id="showcase-tooltip" content="Add to favorites">
				{(props: { "aria-describedby": string; className: string }) => (
					<button
						{...props}
						type="button"
						className={`${props.className} flex size-10 items-center justify-center rounded-full bg-[#f0f0f0] text-[#1d1d1d] dark:bg-[#171717] dark:text-[#f0f0f0]`}
					>
						<HeartIcon className="size-4" />
					</button>
				)}
			</Tooltip>
		),
		stageExtraClassName: "dark:[--tt-bg:#1d1d1d] dark:[--tt-fg:#f0f0f0]",
	},
	{
		title: "Clear input",
		description: "A real search bar — type something, then click × to dissolve the text with a soft glow trail.",
		span: 2,
		children: (
			<div className="relative w-full max-w-sm">
				<SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#a1a1a1]" />
				<ClearInput defaultValue="How do transitions work?" placeholder="Search anything" />
			</div>
		),
		stageExtraClassName:
			"[&_input]:w-full [&_input]:rounded-full [&_input]:border-0 [&_input]:bg-[#f0f0f0] [&_input]:py-2.5 [&_input]:pr-9 [&_input]:pl-10 [&_input]:text-sm [&_input]:outline-none [&_input]:dark:bg-[#171717] [&_.t-clear-placeholder]:pl-10 [&_.t-clear-placeholder]:text-[#a1a1a1] [&_.t-clear-mirror]:pl-10 [&_.t-clear-btn]:absolute [&_.t-clear-btn]:right-3 [&_.t-clear-btn]:top-1/2 [&_.t-clear-btn]:flex [&_.t-clear-btn]:size-5 [&_.t-clear-btn]:-translate-y-1/2 [&_.t-clear-btn]:items-center [&_.t-clear-btn]:justify-center [&_.t-clear-btn]:rounded-full [&_.t-clear-btn]:bg-[#e5e5e5] [&_.t-clear-btn]:text-[#646464] [&_.t-clear-btn]:hover:bg-[#dcdcdc] [&_.t-clear-btn]:dark:bg-[#1f1f1f] [&_.t-clear-btn]:dark:text-[#a1a1a1]",
	},
];

function Group({ title, description, tiles }: { title: string; description: string; tiles: ShowcaseTileDef[] }) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1 ml-6 md:ml-8">
				<Text variant="title" className="text-lg">
					{title}
				</Text>
				<Text variant="secondary" className="text-sm">
					{description}
				</Text>
			</div>
			<ShowcaseGrid tiles={tiles} />
		</div>
	);
}

export default function TransitionsPage() {
	return (
		<Section variant="full" className="px-4 py-8 sm:px-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
				<div className="flex flex-col gap-2">
					<Text variant="title">Transitions</Text>
					<Text variant="subtitle">
						Self-contained demos from transitions.dev — each ships its own scoped CSS and interaction, imported as-is into components/transitions-dev/.
					</Text>
				</div>

				<Group title="Feedback & state" description="Validation, confirmation, unread state, and loading reveals." tiles={FEEDBACK_TILES} />
				<Group title="Text effects" description="Counters, staggered reveals, shimmer, and status swaps." tiles={TEXT_TILES} />
				<Group title="Layout transitions" description="Resizing, reveals, dialogs, paged flows, and controlled tabs." tiles={LAYOUT_TILES} />
				<Group title="Hover & pointer" description="Tilt, avatar stacks, and icon toggles driven by pointer input." tiles={HOVER_TILES} />
				<Group title="Overlays & input" description="A dropdown, a tooltip, and a clearable search field." tiles={OVERLAY_TILES} />
			</div>
		</Section>
	);
}
