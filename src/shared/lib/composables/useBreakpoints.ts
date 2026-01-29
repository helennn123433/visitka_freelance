import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import { BREAKPOINTS } from '@shared/config';

export interface UseBreakpointsReturn {
  isMobile: Ref<boolean>;
  isTablet: Ref<boolean>;
  isDesktop: Ref<boolean>;
  width: Ref<number>;
}

/**
 * Composable для управления брейкпоинтами
 * @param debounceMs - задержка debounce в миллисекундах (по дефолту: 300)
 */
export function useBreakpoints(debounceMs = 300): UseBreakpointsReturn {
  const width = ref(window.innerWidth);
  const isMobile = ref(window.innerWidth <= BREAKPOINTS.MOBILE);
  const isTablet = ref(
    window.innerWidth > BREAKPOINTS.MOBILE && window.innerWidth <= BREAKPOINTS.TABLET
  );
  const isDesktop = ref(window.innerWidth > BREAKPOINTS.TABLET);

  let timeoutId: number | null = null;

  const updateBreakpoints = () => {
    width.value = window.innerWidth;
    isMobile.value = window.innerWidth <= BREAKPOINTS.MOBILE;
    isTablet.value =
      window.innerWidth > BREAKPOINTS.MOBILE && window.innerWidth <= BREAKPOINTS.TABLET;
    isDesktop.value = window.innerWidth > BREAKPOINTS.TABLET;
  };

  const handleResize = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(updateBreakpoints, debounceMs) as unknown as number;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
    width,
  };
}
