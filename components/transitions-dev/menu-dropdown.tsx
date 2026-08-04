// @ts-nocheck
// Transitions.dev — Menu dropdown (React, self-contained)
// Drop into any React project — no extra CSS file needed.
//
// One addition on top of the original transitions.dev source, noted here
// rather than silently: the original had zero props — "Item 1"/"Item 2"
// were hardcoded, so there was no way to show real menu content in a
// showcase without either forking the file per call site or leaving every
// instance identical. Added an optional `items` prop (label + icon per
// row); omitting it falls back to the original two hardcoded items, so
// this is additive, not a behavior change for anyone already using it as
// shipped. Everything else — the open/close state machine, the CSS — is
// untouched from the original.

import { useEffect, useState } from 'react';

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --dropdown-open-dur: 250ms;
  --dropdown-close-dur: 150ms;
  --dropdown-pre-scale: 0.97;
  --dropdown-closing-scale: 0.99;
  --dropdown-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-dropdown {
  transform-origin: top left;
  transform: scale(var(--dropdown-pre-scale));
  opacity: 0;
  pointer-events: none;
  transition:
    transform var(--dropdown-open-dur) var(--dropdown-ease),
    opacity   var(--dropdown-open-dur) var(--dropdown-ease);
  will-change: transform, opacity;
}
.t-dropdown[data-origin="top-right"]     { transform-origin: top right; }
.t-dropdown[data-origin="top-center"]    { transform-origin: top center; }
.t-dropdown[data-origin="bottom-left"]   { transform-origin: bottom left; }
.t-dropdown[data-origin="bottom-center"] { transform-origin: bottom center; }
.t-dropdown[data-origin="bottom-right"]  { transform-origin: bottom right; }

.t-dropdown.is-open {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}
.t-dropdown.is-closing {
  transform: scale(var(--dropdown-closing-scale));
  opacity: 0;
  pointer-events: none;
  transition:
    transform var(--dropdown-close-dur) var(--dropdown-ease),
    opacity   var(--dropdown-close-dur) var(--dropdown-ease);
}

@media (prefers-reduced-motion: reduce) {
  .t-dropdown { transition: none !important; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('transitions-p2')) {
	const __style = document.createElement('style');
	__style.id = 'transitions-p2';
	__style.textContent = __TRANSITION_STYLES;
	document.head.appendChild(__style);
}

const DEFAULT_ITEMS: { label: string; icon?: any }[] = [{ label: 'Item 1' }, { label: 'Item 2' }];

// Pair with the CSS from the CSS tab (.t-dropdown + .is-open / .is-closing).
export function MenuDropdown({ items = DEFAULT_ITEMS }) {
	// "closed" | "open" | "closing"
	const [state, setState] = useState('closed');

	// Hold `.is-closing` for the exit duration, then fully unmount state.
	useEffect(() => {
		if (state !== 'closing') return;
		const ms = readMs('--dropdown-close-dur', 200);
		const id = window.setTimeout(() => setState('closed'), ms);
		return () => window.clearTimeout(id);
	}, [state]);

	const toggle = () => setState((s) => (s === 'open' ? 'closing' : 'open'));

	return (
		<>
			<button type='button' onClick={toggle}>
				Toggle menu
			</button>
			<div role='menu' data-origin='top-center' className={'t-dropdown' + (state === 'open' ? ' is-open' : '') + (state === 'closing' ? ' is-closing' : '')}>
				{items.map(({ label, icon: Icon }) => (
					<button key={label} type='button' role='menuitem'>
						{Icon && <Icon />}
						{label}
					</button>
				))}
			</div>
		</>
	);
}

function readMs(name, fallback) {
	const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	const n = parseFloat(raw);
	return Number.isFinite(n) ? n : fallback;
}
