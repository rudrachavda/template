// @ts-nocheck
// Transitions.dev — Success check (React, self-contained)
// Drop into any React project — no extra CSS file needed.

import { useRef, useState } from 'react';

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --check-opacity-dur: 500ms;
  --check-rotate-dur: 500ms;
  --check-rotate-from: 80deg;
  --check-bob-dur: 500ms;
  --check-y-amount: 40px;
  --check-blur-dur: 500ms;
  --check-blur-from: 10px;
  --check-path-dur: 500ms;
  --check-path-delay: 80ms;
  --check-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --check-ease-opacity: cubic-bezier(0.22, 1, 0.36, 1);
  --check-ease-rotate: cubic-bezier(0.22, 1, 0.36, 1);
  --check-ease-bob: cubic-bezier(0.34, 1.35, 0.64, 1);
  --check-ease-path: cubic-bezier(0.22, 1, 0.36, 1);
}

/* Wrapper drives the appear animation; it doesn't own any
   sizing or color so you can drop in any icon. */
.t-success-check {
  display: inline-block;
  transform-origin: center;
  opacity: 0;
  will-change: transform, opacity, filter;
}
/* overflow: visible keeps the stroke from clipping while it
   draws; display: block kills the inline whitespace under SVGs. */
.t-success-check svg { display: block; overflow: visible; }
/* Stroke-draw setup. Replace 20 with the result of
   path.getTotalLength() for your path; round caps mean any
   sub-pixel overshoot is invisible. */
.t-success-check svg path {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
}

.t-success-check[data-state="in"] {
  animation:
    t-check-fade   var(--check-opacity-dur) var(--check-ease-opacity) forwards,
    t-check-rotate var(--check-rotate-dur)  var(--check-ease-rotate)  forwards,
    t-check-blur   var(--check-blur-dur)    var(--check-ease-out)     forwards,
    t-check-bob    var(--check-bob-dur)     var(--check-ease-bob)     forwards;
}
.t-success-check[data-state="in"] svg path {
  animation: t-check-draw var(--check-path-dur) var(--check-ease-path) var(--check-path-delay, 0ms) forwards;
}

@keyframes t-check-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes t-check-rotate {
  from { transform: rotate(var(--check-rotate-from)); }
  to   { transform: rotate(0deg); }
}
@keyframes t-check-blur {
  from { filter: blur(var(--check-blur-from)); }
  to   { filter: blur(0); }
}
@keyframes t-check-bob {
  from { translate: 0 var(--check-y-amount); }
  to   { translate: 0 0; }
}
@keyframes t-check-draw { to { stroke-dashoffset: 0; } }

@media (prefers-reduced-motion: reduce) {
  .t-success-check { animation: none !important; opacity: 1; }
  .t-success-check svg path { animation: none !important; stroke-dashoffset: 0 !important; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('transitions-p10')) {
	const __style = document.createElement('style');
	__style.id = 'transitions-p10';
	__style.textContent = __TRANSITION_STYLES;
	document.head.appendChild(__style);
}

// Pair with the CSS from the CSS tab.
// The .t-success-check wrapper is the API surface — drop any icon
// (SVG, image, glyph) inside it. data-state drives the appear
// transition: "out" is the resting hidden state (opacity 0, no
// animation), "in" runs fade + rotate + blur + Y-bob + path draw
// in parallel. To replay "in" cleanly on rapid re-triggers we clear
// the state and re-apply it after a forced layout commit so the
// keyframes restart from offset 0.
//
// This snippet covers the appear transition only — bring your own
// hide behavior (unmount, opacity:0, or a custom exit).
export function SuccessCheck({ children }) {
	const [state, setState] = useState('out');
	const ref = useRef(null);

	const show = () => {
		setState('out');
		requestAnimationFrame(() => {
			if (ref.current) void ref.current.offsetWidth;
			setState('in');
		});
	};

	return (
		<>
			<button type='button' onClick={show}>
				Animate
			</button>
			<span ref={ref} className='t-success-check' data-state={state} aria-hidden='true'>
				{children /* drop your SVG / icon here */}
			</span>
		</>
	);
}
