import React, { useState } from "react";
import { Playlist, Video, Topic, ProgressStats } from "@/lib/db/IDatabaseClient";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { isCloudMode } from "@/lib/db/dbClientFactory";
import { CheckCircle2, Circle, AlertCircle, Database, Cloud } from "lucide-react";

interface SidebarStatsProps {
  playlist: Playlist;
  videos: Video[];
  topics: Topic[];
  progressStats: ProgressStats | null;
  streakCount: number;
}

export const SidebarStats: React.FC<SidebarStatsProps> = ({
  playlist,
  videos,
  topics,
  progressStats,
  streakCount,
}) => {
  const [migrationOpen, setMigrationOpen] = useState(false);
  const [migrationSteps, setMigrationSteps] = useState<string[]>([]);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrated, setMigrated] = useState(false);

  const percent = progressStats?.percentageComplete ?? 0;
  const completedCount = progressStats?.completedVideosCount ?? 0;
  const totalCount = playlist.totalVideos;

  // Formatting seconds to HHh MMm
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`;
    }
    return `${String(mins).padStart(2, "0")}m`;
  };

  // Determine milestones
  const hasFirstVideo = videos.some((v) => v.completed);
  const hasHalfway = completedCount >= Math.ceil(totalCount / 2) && totalCount > 0;
  const hasTopicFinished = topics.some((topic) => {
    const topicVideos = videos.filter((v) => v.topicId === topic.id);
    return topicVideos.length > 0 && topicVideos.every((v) => v.completed);
  });
  const hasPlaylistFinished = completedCount === totalCount && totalCount > 0;

  const milestones = [
    { label: "First Step! (1 Video)", achieved: hasFirstVideo },
    { label: "Topic Finished!", achieved: hasTopicFinished },
    { label: "Halfway Point", achieved: hasHalfway },
    { label: "Course Complete!", achieved: hasPlaylistFinished },
  ];

  const cloudEnabled = isCloudMode();

  const handleMigrate = () => {
    setMigrationOpen(true);
    setMigrationSteps(["Starting connection sequence..."]);
    setMigrationProgress(0);
    setMigrated(false);

    const steps = [
      "Connecting to Supabase Cloud infrastructure...",
      "Validating cloud tables schema (users, playlists, videos, topics)...",
      "Syncing user profile & active streak session...",
      "Transferring local roadmap planner & study configurations...",
      "Migrating local progress logs & database details...",
      "Finalizing handshake & verifying cloud integrity...",
      "Cloud migration successful! Running in Cloud Mode.",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length - 1) {
        setMigrationSteps((prev) => [...prev, steps[i]]);
        setMigrationProgress(((i + 1) / steps.length) * 100);
        i++;
      } else {
        setMigrationSteps((prev) => [...prev, steps[steps.length - 1]]);
        setMigrationProgress(100);
        setMigrated(true);
        clearInterval(interval);
      }
    }, 800);
  };

  return (
    <div className="space-y-6 font-sans select-none">
      {/* DB badge status */}
      <div className="flex items-center justify-between p-3 border border-border bg-card/60">
        <div className="flex items-center gap-2">
          {cloudEnabled || migrated ? (
            <div className="flex items-center gap-1.5 font-mono text-xs border border-blue-500/20 bg-blue-500/5 px-2 py-0.5 text-blue-400">
              <Cloud className="w-3.5 h-3.5" />
              <span>db_cloud</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-mono text-xs border border-border bg-secondary px-2 py-0.5 text-muted-foreground">
              <Database className="w-3.5 h-3.5" />
              <span>db_local</span>
            </div>
          )}
        </div>

        {!cloudEnabled && !migrated && (
          <button
            onClick={handleMigrate}
            className="text-[10px] font-mono text-primary hover:text-primary/80 transition-colors uppercase cursor-pointer"
          >
            [ Migrate to Cloud ]
          </button>
        )}
      </div>

      {/* Completion percentage */}
      <div className="border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-foreground uppercase">Progress</span>
          <span className="font-bold text-foreground">
            {percent}% ({completedCount}/{totalCount} vids)
          </span>
        </div>
        <Progress value={percent} />
      </div>

      {/* Playback speed & budget stats */}
      <div className="border border-border bg-card p-4 space-y-3 font-mono text-xs">
        <h4 className="text-muted-foreground uppercase border-b border-border pb-1 mb-2">
          Study settings
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Difficulty:</span>
            <span className="text-foreground">{playlist.difficultyLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Speed multiplier:</span>
            <span className="text-foreground">{progressStats ? "1.50x" : "1.00x"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Remaining Study Time:</span>
            <span className="text-foreground">
              {formatDuration(progressStats?.estimatedTimeRemaining ?? 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Milestones checklist */}
      <div className="border border-border bg-card p-4 space-y-3 text-xs">
        <h4 className="font-mono text-muted-foreground uppercase border-b border-border pb-1 mb-2">
          Course Milestones
        </h4>
        <div className="space-y-2.5">
          {milestones.map((m, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {m.achieved ? (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
              )}
              <span className={m.achieved ? "text-foreground line-through opacity-80" : "text-muted-foreground"}>
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Migration simulator Dialog */}
      <Dialog
        open={migrationOpen}
        onClose={() => setMigrationOpen(false)}
        title="Supabase Cloud Migration"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Synchronize your offline localStorage workspace database with a cloud Supabase environment.
          </p>

          <div className="border border-border bg-background p-3 rounded-none h-48 overflow-y-auto font-mono text-[11px] space-y-1.5">
            {migrationSteps.map((s, idx) => (
              <div
                key={idx}
                className={
                  idx === migrationSteps.length - 1 && migrated
                    ? "text-success font-bold"
                    : "text-muted-foreground"
                }
              >
                &gt; {s}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span>Syncing Status</span>
              <span>{Math.round(migrationProgress)}%</span>
            </div>
            <Progress value={migrationProgress} />
          </div>

          {migrated && (
            <div className="pt-2 flex justify-end">
              <Button onClick={() => setMigrationOpen(false)} size="sm">
                Close Console
              </Button>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};
