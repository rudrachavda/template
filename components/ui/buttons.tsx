"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Squircle } from "@/components/ui/squircle/Squircle";
import { CONTROL_H, CONTROL_H_LG, CONTROL_H_SM, radiusFor } from "@/components/ui/squircle/tokens";
import { cn } from "@/lib/utils";

// --- Button ---
// General-purpose button: every clickable "shape" paints its own surface as a
// Squircle with fill="currentColor" (the wrapper's text-color class *is* the
// background), label/icon sit in a `relative z-10` layer above it. No
// Magnetic here on purpose — that's a special-occasion detail for one-off
// moments (see design.txt §6), not a default every button gets.

export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

function isExternalHref(href: string) {
	return /^([a-z][a-z0-9+.-]*:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

const HEIGHT: Record<ButtonSize, number> = {
	sm: CONTROL_H_SM,
	md: CONTROL_H,
	lg: CONTROL_H_LG,
	icon: CONTROL_H,
};

const PADDING_X: Record<Exclude<ButtonSize, "icon">, string> = {
	sm: "px-3",
	md: "px-4",
	lg: "px-5",
};

// The currentColor-fill idiom: the wrapper's text-color class IS the
// Squircle's background. "solid" is a real, always-visible inverted surface
// (near-black on a light page, near-white on a dark one) — not a hover-only
// reveal, which read as invisible at rest against a near-white page.
// "outline"/"ghost" stay transparent at rest and only tint on hover.
const VARIANT_SURFACE: Record<ButtonVariant, string> = {
	solid: "text-[#1d1d1d] hover:text-zinc-700 dark:text-[#f0f0f0] dark:hover:text-zinc-300",
	outline: "text-transparent hover:text-[#f0f0f0] dark:hover:text-[#171717]",
	ghost: "text-transparent hover:text-[#f0f0f0] dark:hover:text-[#171717]",
};

const VARIANT_LABEL: Record<ButtonVariant, string> = {
	solid: "text-[#f0f0f0] dark:text-[#1d1d1d]",
	outline: "text-[#1d1d1d] dark:text-[#f0f0f0]",
	ghost: "text-[#1d1d1d] dark:text-[#f0f0f0]",
};

// Icon-only buttons get their own coloring regardless of variant: muted at
// rest, full contrast on hover — the Back/Copy idiom, generalized.
const ICON_LABEL = "text-[#a1a1a1] group-hover:text-[#1d1d1d] dark:text-[#646464] dark:group-hover:text-[#f0f0f0]";

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0069cc]";

const PRESS_FEEDBACK = "active:scale-[0.97] active:brightness-[1.04] hover:scale-[1.01] transition-[color,scale,filter] duration-200";

type BaseProps = {
	variant?: ButtonVariant;
	size?: ButtonSize;
	/** Fully-rounded stadium/circle shape instead of the proportional soft-rounded rect — applies to `icon` sizes too. */
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
	const height = HEIGHT[size];
	const radius = pill ? 999 : radiusFor(height);
	const exponent = pill ? 2 : 5;
	const isExternal = typeof href === "string" && isExternalHref(href);
	const labelClasses = isIcon ? ICON_LABEL : VARIANT_LABEL[variant];

	const surfaceClasses = cn(
		"group relative inline-flex shrink-0 items-center",
		VARIANT_SURFACE[variant],
		PRESS_FEEDBACK,
		isIcon ? "aspect-square justify-center" : cn("gap-2", PADDING_X[size as Exclude<ButtonSize, "icon">], fullWidth ? (trailingIcon ? "w-full justify-between" : "w-full justify-center") : "justify-center"),
		disabled && "pointer-events-none opacity-50",
		FOCUS_RING,
		className,
	);

	const content = (
		<>
			<Squircle
				fill="currentColor"
				stroke={variant === "outline" ? "var(--border-hairline)" : undefined}
				strokeWidth={variant === "outline" ? 0.5 : undefined}
				radius={radius}
				smoothing={1}
				exponent={exponent}
				style={{ position: "absolute" }}
				className="inset-0"
			/>
			{leadingIcon && <span className={cn("relative z-10 flex items-center justify-center", labelClasses)}>{leadingIcon}</span>}
			{!isIcon && (
				<span className={cn("relative z-10 text-xs leading-relaxed tracking-normal transition-colors duration-200", labelClasses)}>{children}</span>
			)}
			{isIcon && <span className={cn("relative z-10 flex items-center justify-center", labelClasses)}>{children}</span>}
			{trailingIcon && <span className={cn("relative z-10 flex items-center justify-center", labelClasses)}>{trailingIcon}</span>}
		</>
	);

	const style: React.CSSProperties = { height, width: isIcon ? height : undefined };

	if (href) {
		if (isExternal) {
			return (
				<a href={href} target="_blank" rel="noopener noreferrer" className={surfaceClasses} style={style} aria-label={ariaLabel} aria-disabled={disabled} tabIndex={disabled ? -1 : undefined}>
					{content}
				</a>
			);
		}
		return (
			<Link href={href} className={surfaceClasses} style={style} aria-label={ariaLabel} aria-disabled={disabled} tabIndex={disabled ? -1 : undefined}>
				{content}
			</Link>
		);
	}

	return (
		<button type={type} onClick={onClick} disabled={disabled} className={surfaceClasses} style={style} aria-label={ariaLabel}>
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

export function Back({ href, label = "Back" }: { href?: string; label?: string }) {
	const router = useRouter();
	if (href) {
		return (
			<Button href={href} variant="ghost" size="icon" aria-label={label}>
				<ArrowTopLeftIcon />
			</Button>
		);
	}
	return (
		<Button onClick={() => router.back()} variant="ghost" size="icon" aria-label={label}>
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

export function Copy({ text, label = "Copy link" }: { text?: string; label?: string }) {
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
		<Button onClick={handleCopy} variant="ghost" size="icon" aria-label={label}>
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
