import { useBreakpoints } from '@shared/lib/composables/useBreakpoints';
import { BREAKPOINTS } from '@shared/config';

describe('useBreakpoints', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('инициализируется с правильными значениями для desktop', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    });

    const { isMobile, isTablet, isDesktop, width } = useBreakpoints();

    expect(width.value).toBe(1440);
    expect(isMobile.value).toBe(false);
    expect(isTablet.value).toBe(false);
    expect(isDesktop.value).toBe(true);
  });

  it('инициализируется с правильными значениями для mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { isMobile, isTablet, isDesktop } = useBreakpoints();

    expect(isMobile.value).toBe(true);
    expect(isTablet.value).toBe(false);
    expect(isDesktop.value).toBe(false);
  });

  it('инициализируется с правильными значениями для tablet', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });

    const { isMobile, isTablet, isDesktop } = useBreakpoints();

    expect(isMobile.value).toBe(false);
    expect(isTablet.value).toBe(true);
    expect(isDesktop.value).toBe(false);
  });

  it('правильно определяет граничные значения', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: BREAKPOINTS.MOBILE,
    });

    const { isMobile } = useBreakpoints();
    expect(isMobile.value).toBe(true);
  });
});
