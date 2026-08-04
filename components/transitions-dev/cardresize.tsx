// @ts-nocheck
// Transitions.dev — Card resize (React, self-contained)
// Drop into any React project — no extra CSS file needed.

import { useState } from 'react';

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --resize-dur: 300ms;
  --resize-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-resize {
  transition:
    width  var(--resize-dur) var(--resize-ease),
    height var(--resize-dur) var(--resize-ease);
  will-change: width, height;
}

@media (prefers-reduced-motion: reduce) {
  .t-resize { transition: none !important; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('transitions-p4')) {
	const __style = document.createElement('style');
	__style.id = 'transitions-p4';
	__style.textContent = __TRANSITION_STYLES;
	document.head.appendChild(__style);
}

// Pair with the CSS from the CSS tab (.t-resize tweens width + height).
export function CardResize() {
	const [small, setSmall] = useState(false);

	return (
		<>
			<button type='button' onClick={() => setSmall((v) => !v)}>
				{small ? 'Expand' : 'Shrink'}
			</button>
			<div
				className='t-resize'
				style={{
					width: small ? 160 : 260,
					height: small ? 100 : 180,
				}}
			/>
		</>
	);
}
