"use client";

import React, { useEffect, useRef, useState } from "react";

import { cn } from "@reservatior/ui";

export function MovingBorder({
  children,
  containerClassName,
  borderClassName,
  duration = 3000,
  ...props
}: {
  children: React.ReactNode;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMounted]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-lg border",
        containerClassName,
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute -inset-px rounded-lg opacity-60 transition-all duration-500",
          borderClassName,
        )}
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(var(--color-primary-500), 0.15), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

export function PulseBorder({
  children,
  containerClassName,
  className,
  duration = 5000,
  ...props
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  duration?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-lg border",
        containerClassName,
      )}
      {...props}
    >
      <div
        className={cn(
          "animate-border-pulse absolute inset-0 rounded-lg border-2 border-primary/50",
          className,
        )}
        style={{
          animationDuration: `${duration}ms`,
        }}
      />
      {children}
    </div>
  );
}
