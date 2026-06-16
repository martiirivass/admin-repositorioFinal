import type { CSSProperties } from "react";

type SkeletonProps = {
  className?: string;
  style?: CSSProperties;
};

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-container-highest rounded-lg ${className}`}
      style={style}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }, (_, j) => (
            <td key={j} className="px-lg py-lg">
              <Skeleton className="h-5 w-full max-w-[200px]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-surface-container border border-outline-variant p-lg rounded-xl h-40 flex flex-col justify-between">
      <Skeleton className="h-6 w-6" />
      <div className="space-y-md">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = "h-[300px]" }: { height?: string }) {
  const heights = [35, 55, 45, 70, 40, 60, 50];
  return (
    <div className={`w-full ${height} flex items-end justify-between gap-md pt-lg`}>
      {heights.map((h, i) => (
        <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}
