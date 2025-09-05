"use client";

import React from "react";

interface Section { id: string; label: string }

export default function StickySectionNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = React.useState<string>(sections[0]?.id ?? "");

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-64px 0px -70% 0px", threshold: [0, 1] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  const onClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.history.replaceState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-0 z-20 -mx-4 mb-3 bg-white/90 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <nav className="no-scrollbar -mx-1 overflow-x-auto">
        <ul className="flex gap-2">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onClick(s.id)}
                className={
                  "whitespace-nowrap rounded-full px-3 py-1 text-xs transition-colors shadow-sm " +
                  (active === s.id
                    ? "bg-gray-900 text-white ring-1 ring-black/10"
                    : "bg-gray-100 text-foreground hover:bg-gray-200 ring-1 ring-black/5")
                }
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
