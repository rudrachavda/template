// @ts-nocheck
// Transitions.dev — Tabs sliding (React, self-contained)
// Drop into any React project — no extra CSS file needed.

import { useEffect, useRef, useState } from 'react';

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --tabs-dur: 250ms;
  --tabs-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --tabs-text-muted: #71717a;
  --tabs-text-active: #09090b;
  --tabs-bar-bg: #f4f4f5;
  --tabs-pill-bg: #ffffff;
}
.dark {
  --tabs-text-muted: #a1a1aa;
  --tabs-text-active: #fafafa;
  --tabs-bar-bg: #27272a;
  --tabs-pill-bg: #3f3f46;
}

/* The bar is just a flex container with padding for the pill
   to sit inside. Tabs sit on z-index: 1, the pill on z-index: 0,
   so labels read above the pill background. */
.t-tabs {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px;
  border-radius: 48px;
  background: var(--tabs-bar-bg);
}
.t-tab {
  position: relative;
  appearance: none;
  border: 0;
  background: transparent;
  height: 30px;
  padding: 4px 12px;
  color: var(--tabs-text-muted);
  cursor: pointer;
  border-radius: 48px;
  z-index: 1;
  transition: color var(--tabs-dur) var(--tabs-ease);
}
.t-tab:not([aria-selected="true"]):hover,
.t-tab[aria-selected="true"] {
  color: var(--tabs-text-active);
}

/* The pill: width + transform are written inline by JS so
   the transition tweens between the previous and next
   measured positions. */
.t-tabs-pill {
  position: absolute;
  top: 3px;
  left: 0;
  height: 28px;
  width: 0;
  background: var(--tabs-pill-bg);
  border-radius: 48px;
  transform: translateX(0);
  transition:
    transform var(--tabs-dur) var(--tabs-ease),
    width     var(--tabs-dur) var(--tabs-ease);
  will-change: transform, width;
  z-index: 0;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .t-tabs-pill, .t-tab { transition: none !important; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('transitions-p16')) {
	const __style = document.createElement('style');
	__style.id = 'transitions-p16';
	__style.textContent = __TRANSITION_STYLES;
	document.head.appendChild(__style);
}

// Pair with the CSS from the CSS tab.
// The pill's transform + width are written inline by JS so the
// CSS transition tweens between the previous and next measured
// positions. We re-snap (no animation) on resize so a viewport
// change doesn't desync the pill from its tab.
export function SlidingTabs({ tabs, activeId, onChange }) {
	const rootRef = useRef(null);
	const pillRef = useRef(null);
	const tabRefs = useRef([]);
	const active = tabs.findIndex((t) => t.id === activeId);

	const moveTo = (idx, animate) => {
		const tab = tabRefs.current[idx];
		const pill = pillRef.current;
		if (!tab || !pill) return;
		const left = tab.offsetLeft;
		const width = tab.offsetWidth;
		if (!animate) {
			const prev = pill.style.transition;
			pill.style.transition = 'none';
			pill.style.transform = `translateX(${left}px)`;
			pill.style.width = `${width}px`;
			void pill.offsetWidth;
			pill.style.transition = prev;
		} else {
			pill.style.transform = `translateX(${left}px)`;
			pill.style.width = `${width}px`;
		}
	};

	const isFirst = useRef(true);

	useEffect(() => {
		if (active === -1) return;
		if (isFirst.current) {
			moveTo(active, false);
			isFirst.current = false;
		} else {
			moveTo(active, true);
		}

		const onResize = () => moveTo(active, false);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [active]);

	return (
		<div ref={rootRef} className='t-tabs' role='tablist'>
			<span ref={pillRef} className='t-tabs-pill' aria-hidden='true' />
			{tabs.map((tab, i) => (
				<button
					key={tab.id}
					ref={(el) => {
						tabRefs.current[i] = el;
					}}
					type='button'
					className='t-tab flex items-center justify-center'
					style={{ padding: '4px', height: '28px', width: '28px' }}
					role='tab'
					aria-label={tab.label}
					aria-selected={tab.id === activeId}
					onClick={() => {
						onChange(tab.id);
					}}>
					{tab.content}
				</button>
			))}
		</div>
	);
}
