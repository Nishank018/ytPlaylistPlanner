import React from "react";
import { Flame } from "lucide-react";

interface StreakFlameProps {
  streakCount: number;
  className?: string;
}

export const StreakFlame: React.FC<StreakFlameProps> = ({ streakCount, className = "" }) => {
  const isActive = streakCount > 0;

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono select-none ${
        isActive ? "text-streak" : "text-muted-foreground"
      } ${className}`}
    >
      <div className={isActive ? "streak-active text-streak" : "text-muted-foreground/60"}>
        <Flame className="w-5 h-5 fill-current" />
      </div>
      <span className="text-sm font-bold tracking-tight">
        {streakCount} {streakCount === 1 ? "day" : "days"} streak
      </span>
    </div>
  );
};
