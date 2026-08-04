"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { Squircle } from "@/components/ui/squircle/Squircle";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

// --- Button ---
// General-purpose button: every clickable "shape" paints its own surface as a
// Squircle with fill="currentColor" (the wrapper's text-color class *is* the
// background), label/icon sit in a `relative z-10` layer above it. No
// Magnetic here on purpose — that's a special-occasion detail for one-off
// moments (see design.txt §6), not a default every button gets.
//
// Shape (radius/exponent/smoothing) and layout (padding/gap/text-size, via
// className) are both fully open — `size`/`pill` are convenience defaults,
// not a closed set of allowed shapes. Nothing here forces an exact
// width/height via inline style, so overriding padding/height through
// className, or the corner curvature through radius/exponent/smoothing,
// always works instead of silently losing to a hardcoded value.

export type ButtonVariant = "solid" | "outline" | "ghost" | "secondary" | "primary" | "main" | "unstyled";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

function isExternalHref(href: string) {
	return /^([a-z][a-z0-9+.-]*:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

// Starting padding/gap/text-size per size — a default, not a cap. Override
// any of it through className (e.g. `px-10 text-lg`); twMerge resolves the
// conflict since there's no competing inline style fighting it.
//
// Explicit `min-h-*` on every size (not just padding) is what actually keeps
// them aligned: without it, height is an emergent side effect of
// line-height + padding, which don't scale the same way padding-only sizing
// implies — `icon`'s `p-2` around a 16px glyph lands at 32px while `md`'s
// text-sm/leading-relaxed content lands closer to 39px, so the two look
// mismatched next to each other (e.g. ThemeToggle beside a secondary text
// button) even though neither one's padding is "wrong" on its own.
//
// Each `min-h` is picked to exceed that size's own natural (line-height +
// padding) content height — otherwise it's a no-op floor that never actually
// applies, which is exactly what happened the first time through this: `md`
// alone lands past its own min-h-9 floor from line-height, so only `icon`
// (whose content is shorter than its floor) actually changed, and the two
// still didn't match. `min-h` is still a floor, not a cap — content taller
// than it still grows the button — but for the sizes below it's the number
// that actually determines the rendered height, not merely a suggestion.
const SIZE_CLASSES: Record<ButtonSize, string> = {
	sm: "gap-1.5 px-3 py-2 min-h-9 text-xs",
	md: "gap-2 px-4 py-2 min-h-10 text-sm",
	lg: "gap-2.5 px-5 py-2.5 min-h-12 text-base",
	// Matches `md` (40px) by default — the common pairing (an icon button
	// next to a default-sized text button) is the case this fixes.
	icon: "p-2 min-h-10 min-w-10 aspect-square",
};

// Default shape — a soft-rounded rect, the "classic squircle" idiom from
// design.txt §4. Not the only option: pass radius/exponent/smoothing
// directly for anything else (a pill is radius=999 exponent=2; a barely
// rounded corner is radius=4; a boxier shape is a higher exponent).
const DEFAULT_RADIUS = 10;
const DEFAULT_EXPONENT = 5;
const DEFAULT_SMOOTHING = 1;
const DEFAULT_STROKE_WIDTH = 1;

// The currentColor-fill idiom: the wrapper's text-color class IS the
// Squircle's background. "solid" is a real, always-visible inverted surface
// (near-black on a light page, near-white on a dark one) — not a hover-only
// reveal, which read as invisible at rest against a near-white page.
// "outline"/"ghost" stay transparent at rest and only tint on hover.
//
// "main"/"primary"/"secondary" are the three configurable color tiers
// (design.txt §6): backed by `--color-button-*` custom properties in
// globals.css rather than hardcoded hex here, so re-branding every button
// in the app is a one-file edit. Each var already flips value under `.dark`
// (same mechanism as `--border-hairline`), so one class covers both themes
// — no `dark:` variant needed. "secondary" is the default for
// functional/real buttons in this project (navbar CTA, hero buttons, Back,
// Copy, ThemeToggle); "main" is the brand/CTA accent for the one or two
// buttons per page that should stand out; "primary" is the near-inverse
// surface tier. The /components/buttons demo page deliberately shows the full
// range rather than defaulting to one.
// "unstyled" has no entry here at all — see `showSquircle` below, it skips
// this class (and the Squircle itself) entirely rather than applying a
// no-op transparent one, since there's genuinely no surface to color.
const VARIANT_SURFACE: Record<Exclude<ButtonVariant, "unstyled">, string> = {
	solid: "text-[#1d1d1d] hover:text-zinc-700 dark:text-[#f0f0f0] dark:hover:text-zinc-300",
	outline: "text-transparent hover:text-[#f0f0f0] dark:hover:text-[#171717]",
	ghost: "text-transparent hover:text-[#f0f0f0] dark:hover:text-[#171717]",
	main: "text-[var(--color-button-main)] hover:text-[var(--color-button-main-hover)]",
	primary: "text-[var(--color-button-primary)] hover:text-[var(--color-button-primary-hover)]",
	secondary: "text-[var(--color-button-secondary)] hover:text-[var(--color-button-secondary-hover)]",
};

// "unstyled" reuses the plain primary-text-color pair here (same as
// outline/ghost) — for non-icon sizes there still needs to be *some* label
// color, this is just the ordinary body-text one, not a "variant" look.
const VARIANT_LABEL: Record<ButtonVariant, string> = {
	solid: "text-[#f0f0f0] dark:text-[#1d1d1d]",
	outline: "text-[#1d1d1d] dark:text-[#f0f0f0]",
	ghost: "text-[#1d1d1d] dark:text-[#f0f0f0]",
	main: "text-[var(--color-button-main-label)] hover:text-[var(--color-button-main-label-hover)]",
	primary: "text-[var(--color-button-primary-label)]",
	secondary: "text-[var(--color-button-secondary-label)]",
	unstyled: "text-[#1d1d1d] dark:text-[#f0f0f0]",
};

// Icon-only buttons get their own coloring regardless of variant: muted at
// rest, full contrast on hover — the Back/Copy idiom, generalized.
const ICON_LABEL = "text-[#a1a1a1] group-hover:text-[#1d1d1d] dark:text-[#646464] dark:group-hover:text-[#f0f0f0]";

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0069cc]";

// No `hover:scale-*` — a scale transform on an element containing text
// causes the browser to re-hint/re-rasterize the glyphs at a fractional
// pixel size on every frame of the transition, which reads as a visible
// stutter on hover. Press feedback (`:active`) is brief enough that this
// isn't noticeable, so scale/brightness stay there. `will-change-transform`
// pre-warms a compositing layer for that transform instead of creating one
// on the first press, which is its own small source of jank.
const PRESS_FEEDBACK = "will-change-transform active:scale-[0.97] active:brightness-[1.04] transition-[color,scale,filter] duration-200";

type BaseProps = {
	variant?: ButtonVariant;
	/** Starting padding/gap/text-size — override any part via className. */
	size?: ButtonSize;
	/** Literal background/fill color — any valid CSS paint value (hex, a CSS var, a gradient). Overrides the variant's currentColor-driven surface and its hover tint entirely; you own the color at that point. */
	background?: string;
	/** Background used in dark mode instead of `background`. Falls back to `background` if omitted — pass this when a custom background needs a different value per theme rather than the same literal color in both. */
	darkBackground?: string;
	/** Literal label/icon color, paired with `background`. Overrides the variant's default label color. */
	textColor?: string;
	/** Label/icon color used in dark mode instead of `textColor`. Falls back to `textColor` if omitted. */
	darkTextColor?: string;
	/** Squircle corner radius in px. Default 10 (a soft-rounded rect); pass 999 for a full pill/circle. */
	radius?: number;
	/** Squircle superellipse exponent: 2 = true circle math, 5 = classic squircle curve, higher = boxier. */
	exponent?: number;
	/** Squircle corner smoothing (0–1), how far the curve reaches along each edge. */
	smoothing?: number;
	/** Adds a Squircle stroke (border), regardless of variant. Defaults to `true` for `outline`, `false` otherwise. */
	border?: boolean;
	/** Border color — any valid CSS paint value. Defaults to the shared `--border-hairline` token (flips with `.dark`). */
	borderColor?: string;
	/** Border width in px. Default 0.5 (the hairline convention, design.txt §1). */
	strokeWidth?: number;
	/** Shorthand for radius=999, exponent=2 — a full pill/circle. Ignored if `radius` or `exponent` is set explicitly. */
	pill?: boolean;
	fullWidth?: boolean;
	leadingIcon?: React.ReactNode;
	trailingIcon?: React.ReactNode;
	disabled?: boolean;
	className?: string;
	children: React.ReactNode;
	"aria-label"?: string;
};

type ButtonAsAction = BaseProps & {
	href?: undefined;
	type?: "button" | "submit" | "reset";
	onClick?: () => void;
};

type ButtonAsLink = BaseProps & {
	href: string;
	type?: undefined;
	onClick?: undefined;
};

export type ButtonProps = ButtonAsAction | ButtonAsLink;

export function Button({
	variant = "solid",
	size = "md",
	background,
	darkBackground,
	textColor,
	darkTextColor,
	radius,
	exponent,
	smoothing = DEFAULT_SMOOTHING,
	border,
	borderColor,
	strokeWidth,
	pill = false,
	fullWidth = false,
	leadingIcon,
	trailingIcon,
	disabled = false,
	className,
	children,
	"aria-label": ariaLabel,
	href,
	type = "button",
	onClick,
}: ButtonProps) {
	const isIcon = size === "icon";
	const resolvedRadius = radius ?? (pill ? 999 : DEFAULT_RADIUS);
	const resolvedExponent = exponent ?? (pill ? 2 : DEFAULT_EXPONENT);
	const hasBorder = border ?? (variant === "outline" || variant === "secondary");
	const isExternal = typeof href === "string" && isExternalHref(href);
	const isUnstyled = variant === "unstyled";

	// Only needed to pick between background/darkBackground (and textColor/
	// darkTextColor) — a literal color has no `dark:` variant of its own the
	// way a Tailwind class or a `.dark`-scoped CSS var does, so resolving
	// which one applies has to happen here instead. Skipped entirely (no
	// hook, no mount check) when neither prop is used.
	const needsThemeResolve = background !== undefined || textColor !== undefined;
	const mounted = useMounted();
	const { resolvedTheme } = useTheme();
	const isDark = needsThemeResolve && mounted && resolvedTheme === "dark";
	const resolvedBackground = background !== undefined ? (isDark ? (darkBackground ?? background) : background) : undefined;
	const resolvedTextColor = textColor !== undefined ? (isDark ? (darkTextColor ?? textColor) : textColor) : undefined;

	// A custom `background` replaces the currentColor-driven surface (and its
	// hover tint) entirely — you're opting out of the variant's built-in
	// color behavior, not layering on top of it. Same for `textColor` vs. the
	// variant's default label color.
	const labelColorClasses = resolvedTextColor ? undefined : isIcon ? ICON_LABEL : VARIANT_LABEL[variant];

	// "unstyled" has no VARIANT_SURFACE entry (there's genuinely no surface
	// to color) — guard the lookup rather than indexing with a variant the
	// record doesn't define.
	const surfaceColorClasses = resolvedBackground || isUnstyled ? undefined : VARIANT_SURFACE[variant];

	// A bare "unstyled" button (no border, no custom background) skips the
	// Squircle entirely — that's the whole point, no surface at all, not a
	// transparent one still taking up a DOM node. It reappears the moment
	// the caller opts back into a border or a literal background, since at
	// that point there's something real for it to paint.
	const showSquircle = !isUnstyled || hasBorder || !!resolvedBackground;

	// Plain "unstyled" (no custom background) has no currentColor surface
	// class, so `currentColor` would fall through to whatever text color is
	// ambient — fall back to "none" so an unstyled+border combo renders as a
	// stroke-only outline, not an accidental fill.
	const fillColor = resolvedBackground ?? (isUnstyled ? "none" : "currentColor");

	const surfaceClasses = cn(
		"group relative inline-flex shrink-0 items-center justify-center",
		surfaceColorClasses,
		PRESS_FEEDBACK,
		SIZE_CLASSES[size],
		fullWidth && "w-full",
		fullWidth && trailingIcon && "justify-between",
		disabled && "pointer-events-none opacity-50",
		FOCUS_RING,
		className,
	);

	const content = (
		<>
			{showSquircle && (
				<Squircle
					fill={fillColor}
					stroke={hasBorder ? (borderColor ?? "var(--border-hairline)") : undefined}
					strokeWidth={hasBorder ? (strokeWidth ?? DEFAULT_STROKE_WIDTH) : undefined}
					radius={resolvedRadius}
					smoothing={smoothing}
					exponent={resolvedExponent}
					style={{ position: "absolute" }}
					className="inset-0"
				/>
			)}
			{leadingIcon && (
				<span className={cn("relative z-10 flex items-center justify-center", labelColorClasses)} style={resolvedTextColor ? { color: resolvedTextColor } : undefined}>
					{leadingIcon}
				</span>
			)}
			<span
				className={cn("relative z-10 leading-relaxed tracking-normal transition-colors duration-200", labelColorClasses)}
				style={resolvedTextColor ? { color: resolvedTextColor } : undefined}
			>
				{children}
			</span>
			{trailingIcon && (
				<span className={cn("relative z-10 flex items-center justify-center", labelColorClasses)} style={resolvedTextColor ? { color: resolvedTextColor } : undefined}>
					{trailingIcon}
				</span>
			)}
		</>
	);

	if (href) {
		if (isExternal) {
			return (
				<a href={href} target="_blank" rel="noopener noreferrer" className={surfaceClasses} aria-label={ariaLabel} aria-disabled={disabled} tabIndex={disabled ? -1 : undefined}>
					{content}
				</a>
			);
		}
		return (
			<Link href={href} className={surfaceClasses} aria-label={ariaLabel} aria-disabled={disabled} tabIndex={disabled ? -1 : undefined}>
				{content}
			</Link>
		);
	}

	return (
		<button type={type} onClick={onClick} disabled={disabled} className={surfaceClasses} aria-label={ariaLabel}>
			{content}
		</button>
	);
}

// --- Back ---
// Falls back to browser-history navigation when no `href` is given — a
// general "back" button doesn't always have one fixed destination.

function ArrowTopLeftIcon() {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			viewBox="0 0 24 24"
			className="size-4"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M9.70711 4.70711C10.0976 4.31658 10.0976 3.68342 9.70711 3.29289C9.31658 2.90237 8.68342 2.90237 8.29289 3.29289L3.29289 8.29289C2.90237 8.68342 2.90237 9.31658 3.29289 9.70711L8.29289 14.7071C8.68342 15.0976 9.31658 15.0976 9.70711 14.7071C10.0976 14.3166 10.0976 13.6834 9.70711 13.2929L6.41421 10H10.4C12.0967 10 13.309 10.0008 14.2594 10.0784C15.198 10.1551 15.7927 10.3018 16.27 10.545C17.2108 11.0243 17.9757 11.7892 18.455 12.73C18.6982 13.2073 18.8449 13.802 18.9216 14.7406C18.9992 15.691 19 16.9033 19 18.6V20C19 20.5523 19.4477 21 20 21C20.5523 21 21 20.5523 21 20V18.5556C21 16.913 21 15.6191 20.9149 14.5778C20.8281 13.5154 20.6478 12.6283 20.237 11.8221C19.5659 10.5049 18.4951 9.43407 17.1779 8.76295C16.3717 8.35217 15.4846 8.17186 14.4222 8.08507C13.3809 7.99999 12.087 7.99999 10.4444 8L6.41421 8L9.70711 4.70711Z"
				fill="currentColor"
			/>
		</svg>
	);
}

// `variant`/`size` (and everything else — radius, padding via className,
// border, background, ...) default to the usual icon-button look but are
// just defaults, not hardcoded: anything `Button` accepts passes straight
// through via `...rest`, same idea as `Button` itself not locking any shape
// in. Don't add one-off props here for things `Button` already exposes.
type IconButtonOverrides = Omit<BaseProps, "children" | "variant" | "size">;

export function Back({
	href,
	label = "Back",
	variant = "secondary",
	size = "icon",
	...rest
}: { href?: string; label?: string } & IconButtonOverrides & { variant?: ButtonVariant; size?: ButtonSize }) {
	const router = useRouter();
	if (href) {
		return (
			<Button href={href} variant={variant} size={size} aria-label={label} {...rest}>
				<ArrowTopLeftIcon />
			</Button>
		);
	}
	return (
		<Button onClick={() => router.back()} variant={variant} size={size} aria-label={label} {...rest}>
			<ArrowTopLeftIcon />
		</Button>
	);
}

// --- Copy ---
// Copies the current page URL and swaps to a check icon briefly — a general
// "share/copy link" affordance, not specific to any one page's content.

function CopyIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6.46447 9.12169C8.4171 7.16907 11.5829 7.16907 13.5355 9.12169L13.8787 9.46484C14.695 10.2811 15.1709 11.3121 15.3042 12.3761C15.3729 12.9241 14.9843 13.424 14.4363 13.4926C13.8883 13.5613 13.3884 13.1727 13.3197 12.6247C13.2397 11.9862 12.9554 11.37 12.4645 10.8791L12.1213 10.5359C10.9498 9.36433 9.05026 9.36433 7.87869 10.5359L4.53554 13.8791C3.36397 15.0506 3.36397 16.9501 4.53554 18.1217L4.87869 18.4648C6.05026 19.6364 7.94976 19.6364 9.12133 18.4648L9.29287 18.2933C9.68338 17.9027 10.3165 17.9027 10.7071 18.2932C11.0976 18.6837 11.0976 19.3169 10.7071 19.7074L10.5356 19.879C8.58295 21.8316 5.41709 21.8317 3.46447 19.879L3.12133 19.5359C1.16871 17.5833 1.1687 14.4175 3.12133 12.4648L6.46447 9.12169Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M13.4644 5.12169C15.417 3.16907 18.5829 3.16907 20.5355 5.12169L20.8786 5.46484C22.8313 7.41746 22.8313 10.5833 20.8786 12.5359L17.5355 15.8791C15.5829 17.8317 12.417 17.8317 10.4644 15.879L10.1213 15.5359C9.30499 14.7196 8.82903 13.6887 8.69574 12.6247C8.62709 12.0767 9.01569 11.5768 9.56369 11.5081C10.1117 11.4395 10.6116 11.8281 10.6802 12.3761C10.7602 13.0146 11.0445 13.6307 11.5355 14.1217L11.8786 14.4648C13.0502 15.6364 14.9497 15.6364 16.1213 14.4648L19.4644 11.1217C20.636 9.95012 20.636 8.05062 19.4644 6.87905L19.1213 6.53591C17.9497 5.36436 16.0503 5.36433 14.8787 6.53581C14.8787 6.53584 14.8788 6.53578 14.8787 6.53581L14.7072 6.70738C14.3167 7.09796 13.6836 7.09804 13.293 6.70757C12.9024 6.31709 12.9023 5.68393 13.2928 5.29335L13.4644 5.12169Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function CheckIcon() {
	return (
		<svg className="size-4 text-[#169b40]" aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function Copy({
	text,
	label = "Copy link",
	variant = "secondary",
	size = "icon",
	...rest
}: { text?: string; label?: string } & IconButtonOverrides & { variant?: ButtonVariant; size?: ButtonSize }) {
	const [isCopied, setIsCopied] = React.useState(false);

	const handleCopy = async () => {
		try {
			const value = text ?? window.location.origin + window.location.pathname;
			await navigator.clipboard.writeText(value);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<Button onClick={handleCopy} variant={variant} size={size} aria-label={label} {...rest}>
			<AnimatePresence mode="popLayout" initial={false}>
				<motion.span
					key={isCopied ? "check" : "copy"}
					initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
					animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
					exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
					transition={{ type: "spring", duration: 0.3, bounce: 0 }}
					className="flex items-center justify-center"
				>
					{isCopied ? <CheckIcon /> : <CopyIcon />}
				</motion.span>
			</AnimatePresence>
		</Button>
	);
}
