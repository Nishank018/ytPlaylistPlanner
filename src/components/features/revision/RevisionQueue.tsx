import React from "react";
import { RevisionTask, Video } from "@/lib/db/IDatabaseClient";
import { RevisionCard } from "./RevisionCard";
import { CheckCircle } from "lucide-react";

interface RevisionQueueProps {
  pendingReviews: RevisionTask[];
  videos: Video[];
  onSubmitResult: (taskId: string, isPass: boolean) => void;
}

export const RevisionQueue: React.FC<RevisionQueueProps> = ({
  pendingReviews,
  videos,
  onSubmitResult,
}) => {
  if (pendingReviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border bg-card/20 select-none py-12">
        <div className="w-12 h-12 rounded-full border border-success/30 bg-success/5 flex items-center justify-center text-success mb-4 animate-pulse">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold font-sans text-foreground uppercase tracking-wide">
          All Topics Retained
        </h3>
        <p className="max-w-md text-xs text-muted-foreground mt-2 font-mono leading-relaxed">
          No pending concept reviews due today. Keep checking off videos to auto-schedule new Spaced Repetition checks!
        </p>
      </div>
    );
  }

  // Active card: show the first item in the review queue
  const activeTask = pendingReviews[0];
  
  // Find videos assigned to this topic to display as reference
  const topicVideos = videos.filter((v) => v.topicId === activeTask.topicId);

  return (
    <div className="space-y-4 font-sans select-none max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h3 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
          Conceptual Reviews ({pendingReviews.length} left)
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground">
          BOX RE-SCHEDULER ENABLED
        </span>
      </div>

      <RevisionCard
        task={activeTask}
        topicVideos={topicVideos}
        onSubmitResult={onSubmitResult}
      />
    </div>
  );
};
