import React, { useEffect, useState } from "react";
import { usePlanner } from "@/context/PlannerContext";
import { Dialog } from "@/components/ui/Dialog";
import { Trophy, Star, Zap, PartyPopper } from "lucide-react";

export const ConfettiPlayer: React.FC = () => {
  const { milestoneAlert, clearMilestone } = usePlanner();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (milestoneAlert) {
      setOpen(true);
      
      // Fire confetti safely on client side
      import("canvas-confetti").then((module) => {
        const confetti = module.default;
        
        // Shoot confetti from different angles
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 9999 };

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 40 * (timeLeft / duration);
          // since particles fall down, animate a bit higher than random
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          });
        }, 250);
      });
    } else {
      setOpen(false);
    }
  }, [milestoneAlert]);

  const handleClose = () => {
    setOpen(false);
    clearMilestone();
  };

  const getMilestoneIcon = () => {
    if (!milestoneAlert) return null;
    switch (milestoneAlert.type) {
      case "playlist_completed":
        return <Trophy className="w-12 h-12 text-amber-500 animate-bounce" />;
      case "streak_milestone":
        return <Zap className="w-12 h-12 text-streak animate-bounce" />;
      case "topic_completed":
        return <Star className="w-12 h-12 text-primary animate-bounce" />;
      default:
        return <PartyPopper className="w-12 h-12 text-success animate-bounce" />;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} title="Milestone Unlocked!" className="max-w-sm">
      <div className="flex flex-col items-center text-center p-4 space-y-4 font-sans select-none">
        <div className="w-20 h-20 rounded-full border border-border bg-secondary flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.1)]">
          {getMilestoneIcon()}
        </div>

        <h3 className="text-base font-bold text-foreground font-sans uppercase tracking-wide">
          {milestoneAlert?.type.replace("_", " ")}
        </h3>

        <p className="text-sm text-foreground font-mono leading-relaxed bg-secondary/40 p-4 border border-border">
          {milestoneAlert?.message}
        </p>

        <span className="text-[10px] font-mono text-muted-foreground">
          Keep up the learning momentum!
        </span>
      </div>
    </Dialog>
  );
};
