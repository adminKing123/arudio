"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_EDGE_THRESHOLD = 4;

/** @param {{ children: import("react").ReactNode, className?: string }} props */
export function HorizontalScrollRow({ children, className = "" }) {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(false);

  const updateFadeState = useCallback(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    const hasOverflow = maxScrollLeft > SCROLL_EDGE_THRESHOLD;

    setFadeLeft(hasOverflow && element.scrollLeft > SCROLL_EDGE_THRESHOLD);
    setFadeRight(
      hasOverflow && element.scrollLeft < maxScrollLeft - SCROLL_EDGE_THRESHOLD,
    );
  }, []);

  useEffect(() => {
    updateFadeState();

    const element = scrollRef.current;
    const track = trackRef.current;

    if (!element) {
      return undefined;
    }

    element.addEventListener("scroll", updateFadeState, { passive: true });
    window.addEventListener("resize", updateFadeState);

    const resizeObserver = new ResizeObserver(updateFadeState);
    resizeObserver.observe(element);

    if (track) {
      resizeObserver.observe(track);
    }

    const frame = window.requestAnimationFrame(updateFadeState);

    return () => {
      window.cancelAnimationFrame(frame);
      element.removeEventListener("scroll", updateFadeState);
      window.removeEventListener("resize", updateFadeState);
      resizeObserver.disconnect();
    };
  }, [updateFadeState, children]);

  return (
    <div
      className={`recommendation-scroll-wrap ${fadeLeft ? "recommendation-scroll-wrap-fade-left" : ""} ${fadeRight ? "recommendation-scroll-wrap-fade-right" : ""} ${className}`.trim()}
    >
      <div ref={scrollRef} className="recommendation-scroll">
        <div ref={trackRef} className="recommendation-scroll-track">
          {children}
        </div>
      </div>
    </div>
  );
}
