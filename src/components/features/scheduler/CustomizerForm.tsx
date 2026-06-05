import React from "react";
import { Input } from "@/components/ui/Input";

interface CustomizerFormProps {
  startDate: string;
  setStartDate: (date: string) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  dailyTimeBudget: number;
  setDailyTimeBudget: (budget: number) => void;
  activeDays: number[];
  setActiveDays: (days: number[]) => void;
}

export const CustomizerForm: React.FC<CustomizerFormProps> = ({
  startDate,
  setStartDate,
  playbackSpeed,
  setPlaybackSpeed,
  dailyTimeBudget,
  setDailyTimeBudget,
  activeDays,
  setActiveDays,
}) => {
  const speeds = [1.0, 1.25, 1.5, 1.75, 2.0];
  const commonBudgets = [30, 45, 60];
  const weekDays = [
    { label: "S", value: 0 },
    { label: "M", value: 1 },
    { label: "T", value: 2 },
    { label: "W", value: 3 },
    { label: "T", value: 4 },
    { label: "F", value: 5 },
    { label: "S", value: 6 },
  ];

  const handleDayToggle = (dayValue: number) => {
    if (activeDays.includes(dayValue)) {
      // Prevent emptying active days completely
      if (activeDays.length > 1) {
        setActiveDays(activeDays.filter((d) => d !== dayValue));
      }
    } else {
      setActiveDays([...activeDays, dayValue].sort());
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Playback Speed */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-muted-foreground uppercase block">
          Playback Speed
        </label>
        <div className="flex flex-wrap gap-2">
          {speeds.map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => setPlaybackSpeed(sp)}
              className={`flex-1 min-w-[60px] h-9 text-xs font-mono border transition-all cursor-pointer ${
                playbackSpeed === sp
                  ? "bg-primary border-primary text-primary-foreground hover:bg-primary/95"
                  : "bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {sp.toFixed(2)}x
            </button>
          ))}
        </div>
      </div>

      {/* Daily Study Budget */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-muted-foreground uppercase block">
          Daily Study Budget
        </label>
        <div className="flex flex-wrap gap-2 items-center">
          {commonBudgets.map((bg) => (
            <button
              key={bg}
              type="button"
              onClick={() => setDailyTimeBudget(bg)}
              className={`flex-1 min-w-[70px] h-9 text-xs font-mono border transition-all cursor-pointer ${
                dailyTimeBudget === bg
                  ? "bg-primary border-primary text-primary-foreground hover:bg-primary/95"
                  : "bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {bg} min
            </button>
          ))}
          <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
            <Input
              type="number"
              min="5"
              max="480"
              value={dailyTimeBudget}
              onChange={(e) => setDailyTimeBudget(Math.max(5, parseInt(e.target.value) || 30))}
              className="h-9 font-mono text-center text-xs w-full"
            />
            <span className="text-xs font-mono text-muted-foreground">min</span>
          </div>
        </div>
      </div>

      {/* Active Days */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-muted-foreground uppercase block">
          Active Study Days
        </label>
        <div className="flex gap-1.5 justify-between">
          {weekDays.map((wd) => {
            const isSelected = activeDays.includes(wd.value);
            return (
              <button
                key={wd.value}
                type="button"
                onClick={() => handleDayToggle(wd.value)}
                className={`w-9 h-9 text-xs font-mono border transition-all cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground hover:bg-primary/95"
                    : "bg-background border-border text-foreground hover:bg-accent"
                }`}
              >
                {wd.label}
              </button>
            );
          })}
        </div>
        <span className="text-[11px] font-mono text-muted-foreground block leading-tight">
          Active: {activeDays.map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]).join(", ")}
        </span>
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-muted-foreground uppercase block">
          Start Date
        </label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="h-10 font-sans"
        />
      </div>
    </div>
  );
};
