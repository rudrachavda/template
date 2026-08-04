"use client";

import React, { HTMLAttributes } from "react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";

interface ShadowProps extends HTMLAttributes<HTMLDivElement> {
    /** The hex color of the shadow in light mode. */
    hexColor?: string;
    /** The hex color of the shadow in dark mode. Falls back to hexColor if not provided. */
    darkHexColor?: string;
    /** Multiplier for the height/distance of the shadow. 1 is default. 0.5 is half height. 2 is double height. */
    elevation?: number;
    /** Multiplier for the opacity/darkness of the shadow. 1 is default. 2 is twice as dark. */
    intensity?: number;
    children?: React.ReactNode;
}

function hexToRgbString(hexColor: string) {
    const hex = hexColor.replace("#", "");
    const fullHex =
        hex.length === 3
            ? hex
                .split("")
                .map((c) => c + c)
                .join("")
            : hex;
    const r = parseInt(fullHex.substring(0, 2), 16) || 0;
    const g = parseInt(fullHex.substring(2, 4), 16) || 0;
    const b = parseInt(fullHex.substring(4, 6), 16) || 0;
    return `${r}, ${g}, ${b}`;
}

export function getLayeredShadow(
    hexColor = "#1a2b3b",
    isDark = false,
    elevation = 1,
    intensity = 1,
) {
    const rgbColor = hexToRgbString(hexColor);

    const baseShadows = [
        `0px ${7 * elevation}px ${5 * elevation}px 0px rgba(${rgbColor}, ${0.07 * intensity})`,
        `0px ${17 * elevation}px ${12 * elevation}px 0px rgba(${rgbColor}, ${0.1 * intensity})`,
        `0px ${34 * elevation}px ${24 * elevation}px 0px rgba(${rgbColor}, ${0.13 * intensity})`,
        `0px ${70 * elevation}px ${50 * elevation}px 0px rgba(${rgbColor}, ${0.16 * intensity})`,
        `0px ${192 * elevation}px ${136 * elevation}px 0px rgba(${rgbColor}, ${0.23 * intensity})`,
    ];

    // Light mode adds a subtle white inner highlight ring
    if (!isDark) {
        // baseShadows.push(`0px 0px 0px 0.2px rgb(255, 255, 255)`);
    }

    // Both modes get a subtle black outline ring
    baseShadows.push(`0px 0px 1px 0px rgba(0, 0, 0, 0.3)`);

    return baseShadows.join(", ");
}

// The `drop-shadow(...)` counterpart to `getLayeredShadow`, for anything
// shaped by `Squircle` — a `box-shadow` clips to the element's rectangular
// DOM box, cutting inside the real superellipse edge at the corners
// (design.txt §4/§5); `drop-shadow` traces the actual rendered alpha
// silhouette instead, so it stays correct on a squircle's curve. Only the
// first 3 (of `getLayeredShadow`'s 5) tiers, deliberately: `drop-shadow` is
// a real per-pixel alpha-blur filter, not a cheap compositor box-shadow —
// far more expensive to paint, and the two heaviest tiers (the 70px/192px
// offsets) were sized for a large decorative marketing card, not a card-
// sized UI surface. Same `elevation`/`intensity` knobs as `getLayeredShadow`
// so the two stay easy to compare side by side.
export function getLayeredDropShadow(
    hexColor = "#1a2b3b",
    elevation = 1,
    intensity = 1,
) {
    const rgbColor = hexToRgbString(hexColor);

    const layers = [
        `drop-shadow(0px ${7 * elevation}px ${5 * elevation}px rgba(${rgbColor}, ${0.07 * intensity}))`,
        `drop-shadow(0px ${17 * elevation}px ${12 * elevation}px rgba(${rgbColor}, ${0.1 * intensity}))`,
        `drop-shadow(0px ${34 * elevation}px ${24 * elevation}px rgba(${rgbColor}, ${0.13 * intensity}))`,
    ];

    return layers.join(" ");
}

export function Shadow({
    hexColor = "#1a2b3b",
    darkHexColor,
    elevation = 1,
    intensity = 1,
    className,
    style,
    children,
    ...props
}: ShadowProps) {
    const { resolvedTheme } = useTheme();
    const mounted = useMounted();
    const isDarkMode = mounted && resolvedTheme === "dark";
    const activeColor = isDarkMode ? darkHexColor || hexColor : hexColor;

    return (
        <div
            className={className}
            style={{
                ...style,
                boxShadow: getLayeredShadow(
                    activeColor,
                    isDarkMode,
                    elevation,
                    intensity,
                ),
            }}
            {...props}
        >
            {children}
        </div>
    );
}
