import { useEffect, useRef } from 'react';

/**
 * Attaches touch-based horizontal drag-to-scroll to an element.
 * Works even when a parent has overflow-x: hidden (common issue with body).
 */
export function useHorizontalScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ── Mouse drag (desktop) ─────────────────────────────────────────────
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      el.style.cursor = 'grabbing';
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMouseLeave = () => { isDown = false; el.style.cursor = ''; };
    const onMouseUp = () => { isDown = false; el.style.cursor = ''; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX) * 1.5;
    };

    // ── Touch drag (mobile) ──────────────────────────────────────────────
    let touchStartX = 0;
    let touchStartY = 0;
    let touchScrollLeft = 0;
    let isTouching = false;
    let isHorizontalGesture: boolean | null = null;   // null = undecided

    const onTouchStart = (e: TouchEvent) => {
      isTouching = true;
      isHorizontalGesture = null;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchScrollLeft = el.scrollLeft;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isTouching) return;
      const dx = touchStartX - e.touches[0].clientX;
      const dy = touchStartY - e.touches[0].clientY;

      // Decide gesture direction on first significant movement
      if (isHorizontalGesture === null && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        isHorizontalGesture = Math.abs(dx) > Math.abs(dy);
      }

      if (isHorizontalGesture) {
        // Prevent vertical page scroll while swiping the filter row
        e.preventDefault();
        e.stopPropagation();
        el.scrollLeft = touchScrollLeft + dx;
      }
      // If vertical gesture → do nothing, let the page scroll naturally
    };

    const onTouchEnd = () => {
      isTouching = false;
      isHorizontalGesture = null;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false }); // must be non-passive to call preventDefault
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return ref;
}