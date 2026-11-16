import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function Reveal({
  children,
  className = '',
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    if (
      reducedMotion.matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) {
      return;
    }

    setHidden(true);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setHidden(false);
        observer.disconnect();
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    );

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      setHidden(false);
      observer.disconnect();
    };

    reducedMotion.addEventListener('change', handleMotionPreference);
    observer.observe(node);

    return () => {
      reducedMotion.removeEventListener('change', handleMotionPreference);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${hidden ? 'reveal-hidden' : 'reveal-visible'} ${className}`}
      style={
        hidden
          ? undefined
          : { transitionDelay: delay > 0 ? `${delay}ms` : undefined }
      }
    >
      {children}
    </div>
  );
}
