import React from "react";
import { DailySchedule, Video, Topic, RevisionTask } from "@/lib/db/IDatabaseClient";
import { usePlanner } from "@/context/PlannerContext";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { Clock, Play, AlertCircle, CheckCircle2 } from "lucide-react";

interface TimelineListProps {
  dailySchedules: DailySchedule[];
  videos: Video[];
  topics: Topic[];
  onToggleVideo: (videoId: string) => void;
  onWatchVideo: (youtubeVideoId: string) => void;
}

export const TimelineList: React.FC<TimelineListProps> = ({
  dailySchedules,
  videos,
  topics,
  onToggleVideo,
  onWatchVideo,
}) => {
  const { pendingRevisions } = usePlanner();

  // Format seconds to minutes
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
    return `${secs}s`;
  };

  const getFormatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
  };

  const dayVideosMap = React.useMemo(() => {
    const map = new Map<string, Video[]>();
    const videoIdMap = new Map(videos.map((v) => [v.id, v]));
    dailySchedules.forEach((schedule) => {
      const vids = schedule.videoIds
        .map((id) => videoIdMap.get(id))
        .filter((v): v is Video => !!v);
      map.set(schedule.date, vids);
    });
    return map;
  }, [dailySchedules, videos]);

  const dayRevisionsMap = React.useMemo(() => {
    const map = new Map<string, RevisionTask[]>();
    pendingRevisions.forEach((rev) => {
      const list = map.get(rev.nextReviewDate) || [];
      list.push(rev);
      map.set(rev.nextReviewDate, list);
    });
    return map;
  }, [pendingRevisions]);

  return (
    <div className="space-y-4 font-sans select-none">
      {dailySchedules.length === 0 ? (
        <div className="text-center font-mono text-xs text-muted-foreground py-8">
          No roadmap schedules found. Go to settings to generate one.
        </div>
      ) : (
        <div className="space-y-4">
          {dailySchedules.map((schedule, idx) => {
            const dayVideos = dayVideosMap.get(schedule.date) || [];
            const dayRevisions = dayRevisionsMap.get(schedule.date) || [];

            return (
              <div
                key={schedule.id}
                className={`border p-4 space-y-3 bg-card/30 ${
                  schedule.completed ? "border-success/20 bg-success/2" : "border-border"
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-primary">DAY {idx + 1}</span>
                    <span className="text-xs font-mono text-muted-foreground">•</span>
                    <span className="text-sm font-bold text-foreground">
                      {getFormatDate(schedule.date)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span className="text-primary font-bold">{dayVideos.length} video{dayVideos.length !== 1 ? "s" : ""}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(schedule.durationScheduled)} target
                    </span>
                    {schedule.completed ? (
                      <span className="text-success bg-success/5 border border-success/20 px-1.5 py-0.5 flex items-center gap-0.5 text-[10px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        COMPLETED
                      </span>
                    ) : (
                      <span className="text-amber-500 bg-amber-500/5 border border-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold">
                        PENDING
                      </span>
                    )}
                  </div>
                </div>

                {/* Day Revisions alert */}
                {dayRevisions.length > 0 && (
                  <div className="flex items-center gap-2 border border-revision/20 bg-revision/5 px-3 py-2 text-xs font-mono text-revision">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      Revision Check Alert: Complete review task before watching:{" "}
                      {dayRevisions.map((r) => `"${r.topicName}"`).join(", ")}
                    </span>
                  </div>
                )}

                {/* Video items list */}
                <div className="space-y-2">
                  {dayVideos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-2.5 border border-border/30 hover:border-border/60 bg-background/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        <Checkbox
                          checked={video.completed}
                          onChange={() => onToggleVideo(video.id)}
                        />
                        <div className="min-w-0">
                          <span
                            className={`text-xs font-mono text-muted-foreground ${
                              video.completed ? "line-through text-muted-foreground/30" : ""
                            }`}
                          >
                            #{video.sequenceOrder}
                          </span>
                          <span
                            className={`text-xs font-medium ml-2 ${
                              video.completed ? "line-through text-muted-foreground/60" : "text-foreground"
                            }`}
                          >
                            {video.title}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground block">
                            {formatDuration(video.duration)}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 font-mono text-[10px] gap-1 shrink-0 hover:bg-secondary"
                        onClick={() => onWatchVideo(video.youtubeVideoId)}
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>WATCH</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
