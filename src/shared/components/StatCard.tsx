import type { ReactNode } from "react";

type StatCardProps = {
  icon: string;
  label: string;
  value: ReactNode;
};

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 hover:bg-surface-container-high transition-all shadow-sm">
      <div className="flex justify-between items-start">
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <div>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</p>
        <p className="font-headline-md text-headline-md text-on-surface">{value}</p>
      </div>
    </div>
  );
}
