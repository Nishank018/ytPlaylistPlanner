import React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  indicatorClassName?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, className = "", indicatorClassName = "", ...props }, ref) => {
    // Clamp value between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={`relative h-2 w-full overflow-hidden bg-secondary border border-border rounded-none ${className}`}
        {...props}
      >
        <div
          className={`h-full w-full flex-1 bg-success transition-all duration-300 ease-out ${indicatorClassName}`}
          style={{ transform: `translateX(-${100 - clampedValue}%)` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";
