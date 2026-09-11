import type { CSSProperties } from 'react';

export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} style={style} />
  );
}