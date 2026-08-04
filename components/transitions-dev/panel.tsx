// @ts-nocheck
// Transitions.dev — Panel reveal (React, self-contained)
// Drop into any React project — no extra CSS file needed.

import { useState } from 'react';

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --panel-open-dur: 400ms;
  --panel-close-dur: 350ms;
  --panel-translate-y: calc(187px * 0.5);
  --panel-blur: 2px;
  --panel-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-panel-slide {
  transform: translateY(var(--panel-translate-y));
  opacity: 0;
  filter: blur(var(--panel-blur));
  pointer-events: none;
  transition:
    transform var(--panel-close-dur) var(--panel-ease),
    opacity   var(--panel-close-dur) var(--panel-ease),
    filter    var(--panel-close-dur) var(--panel-ease);
  will-change: transform, opacity, filter;
}
.t-panel-slide[data-open="true"] {
  transform: translateY(0);
  opacity: 1;
  filter: blur(0);
  pointer-events: auto;
  transition:
    transform var(--panel-open-dur) var(--panel-ease),
    opacity   var(--panel-open-dur) var(--panel-ease),
    filter    var(--panel-open-dur) var(--panel-ease);
}

@media (prefers-reduced-motion: reduce) {
  .t-panel-slide { transition: none !important; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('transitions-p3')) {
	const __style = document.createElement('style');
	__style.id = 'transitions-p3';
	__style.textContent = __TRANSITION_STYLES;
	document.head.appendChild(__style);
}

// Pair with the CSS from the CSS tab (.t-panel-slide + data-open).
export function PanelReveal({ children }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button type='button' onClick={() => setOpen((v) => !v)}>
				{open ? 'Hide' : 'Show'} panel
			</button>

			{/* Wrap the panel in a container that clips the travel area. */}
			<div style={{ overflow: 'hidden' }}>
				<div className='t-panel-slide' data-open={open}>
					{children}
				</div>
			</div>
		</>
	);
}
