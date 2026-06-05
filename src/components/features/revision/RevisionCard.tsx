import React, { useState } from "react";
import { RevisionTask, Video } from "@/lib/db/IDatabaseClient";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Check, X, Eye, EyeOff, BookOpen, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RevisionCardProps {
  task: RevisionTask;
  topicVideos: Video[];
  onSubmitResult: (taskId: string, isPass: boolean) => void;
}

export const RevisionCard: React.FC<RevisionCardProps> = ({
  task,
  topicVideos,
  onSubmitResult,
}) => {
  const [revealed, setRevealed] = useState(false);

  const getIntervalDays = (step: number) => {
    const intervals: Record<number, string> = {
      1: "1 Day Interval (Tomorrow)",
      2: "3 Day Interval",
      3: "7 Day Interval",
      4: "30 Day Interval (Mastered)",
    };
    return intervals[step] || "1 Day Interval";
  };

  const nextStepInfo = (step: number, pass: boolean) => {
    if (pass) {
      const nextStep = Math.min(step + 1, 4);
      const days = { 2: "3 days", 3: "7 days", 4: "30 days" }[nextStep] || "30 days";
      return `Box ${nextStep} (Review in ${days})`;
    } else {
      return `Box 1 (Review tomorrow)`;
    }
  };

  return (
    <Card className="border-revision/30 hover:border-revision/60 shadow-md font-sans">
      <CardHeader className="bg-revision/2 border-b border-revision/10 py-4 flex flex-row items-center justify-between">
        <div>
          <span className="font-mono text-[10px] text-revision uppercase block tracking-wider">
            TOPIC REVISION CARD
          </span>
          <CardTitle className="text-sm font-bold text-foreground">
            {task.topicName}
          </CardTitle>
          <span className="font-mono text-[10px] text-muted-foreground block mt-0.5">
            Playlist: {task.playlistTitle}
          </span>
        </div>
        <div className="font-mono text-xs text-revision border border-revision/20 bg-revision/5 px-2 py-0.5 shrink-0 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Leitner Box {task.intervalStep}</span>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4 font-mono text-xs">
        <div className="space-y-2">
          <span className="text-[10px] text-muted-foreground uppercase block">
            Self-Check Recall Task
          </span>
          <p className="text-foreground leading-relaxed text-sm bg-secondary/30 p-3 border border-border">
            Describe the core concepts, syntax, and definitions learned under this topic from memory. Write down key steps, compare methods, or sketch a quick mental framework.
          </p>
        </div>

        {/* Reference Reveal Box */}
        <div className="border border-border bg-card/60 p-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground uppercase">
              Reference notes & video sources
            </span>
            <button
              onClick={() => setRevealed(!revealed)}
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {revealed ? (
                <>
                  <EyeOff className="w-3 h-3" />
                  <span>[Hide]</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" />
                  <span>[Reveal]</span>
                </>
              )}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {revealed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2.5 border-t border-border/40 text-[11px] text-muted-foreground">
                  <div>
                    <span className="font-bold text-foreground">Topic Videos Covered:</span>
                    <ul className="list-disc pl-4 space-y-1 mt-1 font-sans">
                      {topicVideos.map((vid) => (
                        <li key={vid.id} className="truncate">
                          Video #{vid.sequenceOrder}: {vid.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interval Projections */}
        <div className="grid grid-cols-2 gap-3 border-t border-border/40 pt-4 text-[10px] text-muted-foreground leading-tight">
          <div className="p-2 border border-success/15 bg-success/2">
            <span className="text-success font-bold block mb-1">PASS DIRECTION:</span>
            <span>Advance to {nextStepInfo(task.intervalStep, true)}</span>
          </div>
          <div className="p-2 border border-red-500/15 bg-red-500/2">
            <span className="text-red-400 font-bold block mb-1">FAIL DIRECTION:</span>
            <span>Reset to {nextStepInfo(task.intervalStep, false)}</span>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="destructive"
            className="flex-1 font-mono text-xs gap-1.5 h-10 cursor-pointer"
            onClick={() => onSubmitResult(task.id, false)}
          >
            <X className="w-4 h-4 shrink-0" />
            <span>I FAILED CHECK</span>
          </Button>
          <Button
            className="flex-1 font-mono text-xs gap-1.5 h-10 bg-success border-success text-white hover:bg-success/90 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] cursor-pointer"
            onClick={() => onSubmitResult(task.id, true)}
          >
            <Check className="w-4 h-4 shrink-0" />
            <span>I PASSED CHECK</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
