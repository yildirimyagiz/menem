import React from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({ title, subtitle, children, className = "" }: SectionCardProps) {
  return (
    <section className={`mb-4 rounded-xl border border-black/5 bg-white p-4 shadow-sm ${className}`}>
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}
