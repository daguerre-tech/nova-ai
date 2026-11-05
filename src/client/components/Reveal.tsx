import React, { useEffect, useRef, useState } from 'react';

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}

export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Component = 'div',
  ...props
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Component
      ref={ref as any}
      style={{
        transitionDelay: `${delay}ms`,
        ...props.style,
      }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
