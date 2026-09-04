import { useCallback, useRef } from "react";
import gsap from "gsap";

/**
 * Animates form step changes with a slide + fade transition.
 *
 * @param {number} currentStep
 */
export function useGsapStepTransition(currentStep) {
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const stepRef = useRef(currentStep);
  const isAnimating = useRef(false);

  stepRef.current = currentStep;

  const getTargets = useCallback(() => {
    const targets = [];

    if (headerRef.current) {
      targets.push(headerRef.current);
    }

    if (formRef.current) {
      targets.push(formRef.current);
    }

    return targets;
  }, []);

  /** @param {number} nextStep @param {() => void} onStepChange */
  const animateToStep = useCallback((nextStep, onStepChange) => {
    if (isAnimating.current || nextStep === stepRef.current) {
      return;
    }

    const targets = getTargets();
    if (!targets.length) {
      onStepChange();
      return;
    }

    isAnimating.current = true;
    const direction = nextStep > stepRef.current ? 1 : -1;

    gsap.to(targets, {
      opacity: 0,
      x: direction * -32,
      duration: 0.22,
      ease: "power2.in",
      stagger: 0.04,
      onComplete: () => {
        onStepChange();

        gsap.fromTo(
          targets,
          { opacity: 0, x: direction * 32 },
          {
            opacity: 1,
            x: 0,
            duration: 0.34,
            ease: "power3.out",
            stagger: 0.05,
            onComplete: () => {
              isAnimating.current = false;
            },
          },
        );
      },
    });
  }, [getTargets]);

  const playInitialAnimation = useCallback(() => {
    const targets = getTargets();
    if (!targets.length) {
      return;
    }

    gsap.fromTo(
      targets,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.06 },
    );
  }, [getTargets]);

  return {
    formRef,
    headerRef,
    animateToStep,
    playInitialAnimation,
  };
}
