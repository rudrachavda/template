// @ts-nocheck
// Transitions.dev — Modal open / close (React, self-contained)
// Drop into any React project — no extra CSS file needed.

import { useEffect, useState } from 'react';

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --modal-open-dur: 250ms;
  --modal-close-dur: 150ms;
  --modal-scale: 0.96;
  --modal-scale-close: 0.96;
  --modal-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-modal {
  transform-origin: center;
  transform: scale(var(--modal-scale));
  opacity: 0;
  pointer-events: none;
  transition:
    transform var(--modal-open-dur) var(--modal-ease),
    opacity   var(--modal-open-dur) var(--modal-ease);
  will-change: transform, opacity;
}
.t-modal.is-open {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}
.t-modal.is-closing {
  transform: scale(var(--modal-scale-close));
  opacity: 0;
  pointer-events: none;
  transition:
    transform var(--modal-close-dur) var(--modal-ease),
    opacity   var(--modal-close-dur) var(--modal-ease);
}

@media (prefers-reduced-motion: reduce) {
  .t-modal { transition: none !important; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('transitions-p7')) {
	const __style = document.createElement('style');
	__style.id = 'transitions-p7';
	__style.textContent = __TRANSITION_STYLES;
	document.head.appendChild(__style);
}

// Pair with the CSS from the CSS tab (.t-modal + .is-open / .is-closing).
export function Modal({ children }) {
	// "closed" | "open" | "closing"
	const [state, setState] = useState('closed');

	useEffect(() => {
		if (state !== 'closing') return;
		const ms = readMs('--modal-close-dur', 150);
		const id = window.setTimeout(() => setState('closed'), ms);
		return () => window.clearTimeout(id);
	}, [state]);

	const open = () => setState('open');
	const close = () => setState('closing');

	return (
		<>
			<button type='button' onClick={open}>
				Open modal
			</button>

			{state !== 'closed' && (
				<div role='dialog' aria-modal='true' className={'t-modal' + (state === 'open' ? ' is-open' : '') + (state === 'closing' ? ' is-closing' : '')}>
					{children}
					<button type='button' onClick={close}>
						Close
					</button>
				</div>
			)}
		</>
	);
}

function readMs(name, fallback) {
	const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	const n = parseFloat(raw);
	return Number.isFinite(n) ? n : fallback;
}
