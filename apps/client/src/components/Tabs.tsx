"use client";

import React, { useId, useState } from "react";
import type { KeyboardEvent } from "react";

export interface TabItem {
  value: string;
  label: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  className?: string;
  children?: React.ReactNode | ((current: string) => React.ReactNode);
}

export function Tabs(props: TabsProps) {
  const { tabs, value, defaultValue, onValueChange, className, children } = props;
  const [internal, setInternal] = useState<string>(defaultValue ?? tabs[0]?.value ?? "");
  const v = value ?? internal;
  const setV = (nv: string) => {
    setInternal(nv);
    onValueChange?.(nv);
  };
  const id = useId();

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!tabs.length) return;
    const idx = tabs.findIndex((t) => t.value === v);
    if (idx < 0) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (idx + 1) % tabs.length;
      setV(tabs[nextIndex]?.value ?? v);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (idx - 1 + tabs.length) % tabs.length;
      setV(tabs[prevIndex]?.value ?? v);
    }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex gap-2 overflow-auto rounded-md bg-white p-1 ring-1 ring-black/5"
        onKeyDown={onKeyDown}
      >
        {tabs.map((t) => {
          const selected = t.value === v;
          return (
            <button
              key={t.value}
              id={`${id}-${t.value}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`${id}-panel-${t.value}`}
              className={
                "whitespace-nowrap rounded-md px-3 py-1.5 text-sm outline-none transition " +
                (selected
                  ? "bg-gray-900 text-white shadow"
                  : "bg-transparent text-foreground hover:bg-gray-100")
              }
              onClick={() => setV(t.value)}
              type="button"
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3">{typeof children === "function" ? (children as (c: string) => React.ReactNode)(v) : children}</div>
    </div>
  );
}

export function TabPanel({ value, current, children }: { value: string; current: string; children?: React.ReactNode }) {
  const id = useId();
  if (value !== current) return null;
  return (
    <div id={`${id}-panel-${value}`} role="tabpanel" tabIndex={0} className="focus:outline-none">
      {children}
    </div>
  );
}
