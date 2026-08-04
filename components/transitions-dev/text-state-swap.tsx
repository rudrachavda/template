// @ts-nocheck
// Transitions.dev — Text states swap (React, self-contained)
// Drop into any React project — no extra CSS file needed.

import { useRef, useState } from 'react';

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --text-swap-dur: 150ms;
  --text-swap-translate-y: 4px;
  --text-swap-blur: 2px;
  --text-swap-ease: ease-in-out;
}

.t-text-swap {
  display: inline-block;
  transform: translateY(0);
  filter: blur(0);
  opacity: 1;
  transition:
    transform var(--text-swap-dur) var(--text-swap-ease),
    filter    var(--text-swap-dur) var(--text-swap-ease),
    opacity   var(--text-swap-dur) var(--text-swap-ease);
  will-change: transform, filter, opacity;
}
.t-text-swap.is-exit {
  transform: translateY(calc(var(--text-swap-translate-y) * -1));
  filter: blur(var(--text-swap-blur));
  opacity: 0;
}
.t-text-swap.is-enter-start {
  transform: translateY(var(--text-swap-translate-y));
  filter: blur(var(--text-swap-blur));
  opacity: 0;
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  .t-text-swap { transition: none !important; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('transitions-p6')) {
	const __style = document.createElement('style');
	__style.id = 'transitions-p6';
	__style.textContent = __TRANSITION_STYLES;
	document.head.appendChild(__style);
}

// Pair with the CSS from the CSS tab.
// Three-phase text swap: exit old ->  swap text ->  enter new.
const MESSAGES = ['Transaction processing...', 'Transaction completed'];

export function TextStatesSwap() {
	const [index, setIndex] = useState(0);
	const ref = useRef(null);
	const busy = useRef(false);

	const next = () => {
		if (busy.current) return;
		const el = ref.current;
		if (!el) return;
		busy.current = true;
		const dur = readMs('--text-swap-dur', 200);

		el.classList.add('is-exit');
		window.setTimeout(() => {
			setIndex((i) => (i + 1) % MESSAGES.length);

			// Jump below (no transition), then release so it animates back.
			el.classList.remove('is-exit');
			el.classList.add('is-enter-start');
			void el.offsetWidth; // force reflow
			el.classList.remove('is-enter-start');
			busy.current = false;
		}, dur);
	};

	return (
		<>
			<span className='t-text-swap' ref={ref}>
				{MESSAGES[index]}
			</span>
			<button type='button' onClick={next}>
				Next
			</button>
		</>
	);
}

function readMs(name, fallback) {
	const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	const n = parseFloat(raw);
	return Number.isFinite(n) ? n : fallback;
}
