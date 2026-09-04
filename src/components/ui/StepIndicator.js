"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

/** @param {{ steps: string[], currentStep: number }} props */
export function StepIndicator({ steps, currentStep }) {
  const dotRefs = useRef([]);
  const lineRefs = useRef([]);

  useLayoutEffect(() => {
    dotRefs.current.forEach((dot, index) => {
      if (!dot) {
        return;
      }

      const stepNumber = index + 1;
      const isActive = stepNumber === currentStep;

      gsap.to(dot, {
        scale: isActive ? 1.05 : 1,
        duration: 0.35,
        ease: "power2.out",
      });
    });

    lineRefs.current.forEach((line, index) => {
      if (!line) {
        return;
      }

      const isComplete = index + 1 < currentStep;

      gsap.to(line, {
        scaleX: isComplete ? 1 : 0.4,
        opacity: isComplete ? 1 : 0.5,
        duration: 0.4,
        ease: "power2.out",
        transformOrigin: "left center",
      });
    });
  }, [currentStep]);

  return (
    <div className="neo-step-indicator" aria-label={`Step ${currentStep} of ${steps.length}`}>
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;

        return (
          <div key={label} className="neo-step-item">
            <div className="flex flex-col items-center gap-1.5">
              <div className="neo-step-dot-wrap">
                <div
                  ref={(element) => {
                    dotRefs.current[index] = element;
                  }}
                  className={`neo-step-dot ${isActive || isComplete ? "neo-step-dot-active" : ""}`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {stepNumber}
                </div>
              </div>
              <span
                className={`text-xs font-medium ${isActive ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div
                ref={(element) => {
                  lineRefs.current[index] = element;
                }}
                className={`neo-step-line ${isComplete ? "neo-step-line-active" : ""}`}
                aria-hidden="true"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
