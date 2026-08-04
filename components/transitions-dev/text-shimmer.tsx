// @ts-nocheck
// Transitions.dev — Shimmer text (React, self-contained)
// Drop into any React project — no extra CSS file needed.

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --shimmer-dur: 2000ms;
  --shimmer-base: #7c7c7c;
  --shimmer-highlight: #0d0d0d;
  --shimmer-band: 400%;
  --shimmer-ease: linear;
}

/* Two-layer construction:
   1. The base text renders normally in --shimmer-base.
   2. ::before duplicates it via content: attr(data-text),
      paints a transparent → highlight → transparent gradient
      onto it, and clips that gradient to the glyphs via
      background-clip: text. Animating background-position
      sweeps the band across the text. */
.t-shimmer {
  position: relative;
  display: inline-block;
  color: var(--shimmer-base);
}
.t-shimmer::before {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(
    90deg,
    transparent          0%,
    transparent         40%,
    var(--shimmer-highlight) 50%,
    transparent         60%,
    transparent        100%
  );
  background-size: var(--shimmer-band) 100%;
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: t-shimmer var(--shimmer-dur) var(--shimmer-ease) infinite;
}
@keyframes t-shimmer {
  0%   { background-position: 100% 0; }
  100% { background-position: 0% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .t-shimmer::before { animation: none !important; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('transitions-p15')) {
	const __style = document.createElement('style');
	__style.id = 'transitions-p15';
	__style.textContent = __TRANSITION_STYLES;
	document.head.appendChild(__style);
}

// Pair with the CSS from the CSS tab.
// Pure CSS — no hooks, no state. The `data-text` attribute
// duplicates the visible string into the masked ::before layer.
// Keep them in sync if the text changes.
export function Shimmer({ children }) {
	return (
		<span className='t-shimmer' data-text={children}>
			{children}
		</span>
	);
}
