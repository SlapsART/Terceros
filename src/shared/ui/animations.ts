// Shared MUI sx animation objects.
// `animation-fill-mode: both` keeps the initial frame visible during delay
// and the final frame visible after the animation ends.

export const slideUp = {
  animation: 'uiSlideUp 0.22s ease-out both',
  '@keyframes uiSlideUp': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to:   { opacity: 1, transform: 'translateY(0)' },
  },
} as const;

export const slideDown = {
  animation: 'uiSlideDown 0.22s ease-out both',
  '@keyframes uiSlideDown': {
    from: { opacity: 0, transform: 'translateY(-10px)' },
    to:   { opacity: 1, transform: 'translateY(0)' },
  },
} as const;

export const fadeIn = {
  animation: 'uiFadeIn 0.18s ease-out both',
  '@keyframes uiFadeIn': {
    from: { opacity: 0 },
    to:   { opacity: 1 },
  },
} as const;

export const scaleIn = {
  animation: 'uiScaleIn 0.2s cubic-bezier(0.16,1,0.3,1) both',
  '@keyframes uiScaleIn': {
    from: { opacity: 0, transform: 'scale(0.95)' },
    to:   { opacity: 1, transform: 'scale(1)' },
  },
} as const;
