import React from "react";
import { Playlist, Video, Topic, DailySchedule } from "@/lib/db/IDatabaseClient";
import { generateDailySchedules } from "@/lib/youtube/roadmapPlanning";

interface PlanPreviewProps {
  playlist: Omit<Playlist, "id" | "createdAt" | "updatedAt">;
  videos: Omit<Video, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">[];
  topics: Omit<Topic, "id" | "createdAt" | "updatedAt">[];
  startDate: string;
  playbackSpeed: number;
  dailyTimeBudget: number;
  activeDays: number[];
}

export const PlanPreview: React.FC<PlanPreviewProps> = ({
  playlist,
  videos,
  topics,
  startDate,
  playbackSpeed,
  dailyTimeBudget,
  activeDays,
}) => {
  // Format seconds to HHh MMm SSs
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`;
    }
    return `${String(mins).padStart(2, "0")}m`;
  };

  // Convert raw videos type to match roadmapPlanning ScheduleInput (which requires Video[])
  // We mock a temporary ID for each video to make it type-safe for generation
  const tempVideos: Video[] = videos.map((v, i) => ({
    id: `temp-${i}`,
    playlistId: "",
    topicId: v.topicId || "",
    youtubeVideoId: v.youtubeVideoId,
    title: v.title,
    duration: v.duration,
    sequenceOrder: v.sequenceOrder,
    completed: false,
    createdAt: "",
    updatedAt: "",
  }));

  let previewSchedules: Omit<DailySchedule, "id" | "createdAt">[] = [];
  let errorMsg: string | null = null;

  try {
    previewSchedules = generateDailySchedules({
      videos: tempVideos,
      startDate,
      playbackSpeed,
      dailyTimeBudget,
      activeDays,
    });
  } catch (err: any) {
    errorMsg = err.message;
  }

  const rawDuration = playlist.totalDuration;
  const effectiveDuration = Math.round(rawDuration / playbackSpeed);
  const totalDays = previewSchedules.length;
  const projectedEndDate = previewSchedules[totalDays - 1]?.date || "N/A";

  const getDayOfWeek = (dateStr: string) => {
    if (!dateStr || dateStr === "N/A") return "";
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
  };

  const getFormatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "N/A") return "";
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  };

  return (
    <div className="border border-border bg-card/40 p-5 space-y-5 select-none h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-xs text-muted-foreground uppercase block mb-0.5">
            Target Course
          </span>
          <h4 className="text-sm font-semibold font-sans text-foreground">
            {playlist.title}
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border/40 pt-4">
          <div>
            <span className="font-mono text-[10px] text-muted-foreground uppercase block">
              Total Videos
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              {playlist.totalVideos} videos
            </span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-muted-foreground uppercase block">
              Raw Duration
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              {formatDuration(rawDuration)}
            </span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-muted-foreground uppercase block">
              Effective Speed
            </span>
            <span className="font-mono text-sm font-bold text-primary">
              {playbackSpeed.toFixed(2)}x
            </span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-muted-foreground uppercase block">
              Effective Time
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              {formatDuration(effectiveDuration)}
            </span>
          </div>
        </div>

        <div className="border-t border-border/40 pt-4 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-muted-foreground">Study Days Needed:</span>
            <span className="font-mono font-bold text-foreground bg-secondary px-1.5 py-0.5 border border-border">
              {totalDays} Active Days
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-muted-foreground">Projected End:</span>
            <span className="font-mono font-bold text-success bg-success/5 px-1.5 py-0.5 border border-success/20">
              {projectedEndDate !== "N/A"
                ? `${getDayOfWeek(projectedEndDate)}, ${getFormatDate(projectedEndDate)}`
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {errorMsg ? (
        <div className="text-red-500 font-mono text-[11px] mt-4 border border-red-500/20 bg-red-500/5 p-2">
          Schedule Error: {errorMsg}
        </div>
      ) : (
        <div className="space-y-2 mt-4 pt-4 border-t border-border/40">
          <label className="text-[10px] font-mono text-muted-foreground uppercase block">
            Roadmap Timeline Preview
          </label>
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
            {previewSchedules.slice(0, 3).map((sch, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-[11px] border border-border/30 bg-background/30 p-2 font-mono"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground font-bold">DAY {idx + 1}</span>
                  <span className="text-muted-foreground">({getDayOfWeek(sch.date)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground">{sch.videoIds.length} vids</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-foreground">{formatDuration(sch.durationScheduled)}</span>
                </div>
              </div>
            ))}
            {previewSchedules.length > 3 && (
              <div className="text-center text-[10px] font-mono text-muted-foreground py-0.5">
                + {previewSchedules.length - 3} more study days scheduled...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
