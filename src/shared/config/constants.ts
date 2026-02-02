/**
 * Константы приложения
 */

// Разграничения экранов
export const BREAKPOINTS = {
  MOBILE: 1024,
  TABLET: 1280,
  DESKTOP: 1440,
} as const;

// Таймауты и задержки
export const TIMEOUTS = {
  API_REQUEST: 10000,
  DEBOUNCE_DELAY: 300,
  SCROLL_ANIMATION: 1000,
} as const;

// Magic numbers
export const UI = {
  INTERSECTION_THRESHOLD_MOBILE: 0.01,
  INTERSECTION_THRESHOLD_DESKTOP: 0.2,
  ROOT_MARGIN_MOBILE: '-100px 0px 0px 0px',
  ROOT_MARGIN_DESKTOP: '-50px 0px 0px 0px',
} as const;
