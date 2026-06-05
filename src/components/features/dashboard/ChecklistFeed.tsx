import React, { useState, useEffect } from "react";
import { Playlist, Topic, Video, DailySchedule } from "@/lib/db/IDatabaseClient";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronRight, Play, CheckCircle2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChecklistFeedProps {
  playlist: Playlist;
  topics: Topic[];
  videos: Video[];
  dailySchedules: DailySchedule[];
  onToggleVideo: (videoId: string) => void;
  onWatchVideo: (youtubeVideoId: string) => void;
}

export const ChecklistFeed: React.FC<ChecklistFeedProps> = ({
  playlist,
  topics,
  videos,
  dailySchedules,
  onToggleVideo,
  onWatchVideo,
}) => {
  // Topic collapse states: by default open the first topic block, collapse others
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (topics.length > 0) {
      setExpandedTopics((prev) => {
        const initial: Record<string, boolean> = { ...prev };
        topics.forEach((t, idx) => {
          if (initial[t.id] === undefined) {
            initial[t.id] = idx === 0; // first topic default open
          }
        });
        return initial;
      });
    }
  }, [topics]);

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  // Format duration in minutes
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
    return `${secs}s`;
  };

  // Find "Today's Target" (first incomplete daily schedule)
  const todaySchedule = dailySchedules.find((s) => !s.completed);
  const todayVideos = todaySchedule
    ? videos.filter((v) => todaySchedule.videoIds.includes(v.id))
    : [];

  const getFormatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" });
  };

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Today's Target section */}
      {todaySchedule && todayVideos.length > 0 && (
        <div className="border border-primary/20 bg-primary/5 p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-primary/10 pb-3 gap-2">
            <div>
              <span className="font-mono text-[10px] text-primary uppercase block tracking-wider">
                {"TODAY'S TARGET"}
              </span>
              <h3 className="text-base font-bold text-foreground">
                {getFormatDate(todaySchedule.date)}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-muted-foreground bg-background/50 px-2.5 py-1 border border-border">
              <span className="text-primary font-bold">{todayVideos.length} video{todayVideos.length !== 1 ? "s" : ""}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Time: {formatDuration(todaySchedule.durationScheduled)}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {todayVideos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 border border-border/40 bg-card/40 hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Checkbox
                      checked={video.completed}
                      onChange={() => onToggleVideo(video.id)}
                    />
                  </motion.div>
                  <div className="min-w-0">
                    <span
                      className={`text-xs font-mono font-bold mr-2 text-muted-foreground ${
                        video.completed ? "line-through text-muted-foreground/40" : ""
                      }`}
                    >
                      #{video.sequenceOrder}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        video.completed
                          ? "line-through text-muted-foreground/60 transition-all"
                          : "text-foreground"
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
                  className="h-8 font-mono text-[11px] gap-1 shrink-0"
                  onClick={() => onWatchVideo(video.youtubeVideoId)}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>WATCH</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Course Outline & All Topics */}
      <div className="space-y-3">
        <div className="border-b border-border pb-2">
          <h3 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
            All Topics & Outline
          </h3>
        </div>

        <div className="space-y-3">
          {topics.map((topic) => {
            const topicVideos = videos.filter((v) => v.topicId === topic.id);
            const topicCompletedCount = topicVideos.filter((v) => v.completed).length;
            const isTopicCompleted = topicVideos.length > 0 && topicCompletedCount === topicVideos.length;
            const isOpen = expandedTopics[topic.id] || false;

            return (
              <div key={topic.id} className="border border-border bg-card/20 overflow-hidden">
                {/* Topic Header Toggle */}
                <button
                  onClick={() => toggleTopicExpand(topic.id)}
                  className="w-full flex items-center justify-between p-4 bg-card hover:bg-accent/40 transition-colors font-mono text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {isTopicCompleted && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                        <span className={`text-sm font-semibold truncate ${isTopicCompleted ? "text-success/90 line-through" : "text-foreground"}`}>
                          Topic {topic.sequenceOrder}: {topic.name}
                        </span>
                      </div>
                      {topic.description && (
                        <span className="text-[10px] text-muted-foreground block truncate max-w-md">
                          {topic.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground bg-secondary border border-border px-2 py-0.5 shrink-0">
                    {topicCompletedCount}/{topicVideos.length} vids
                  </span>
                </button>

                {/* Animated Topic Videos List */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden bg-background/20"
                    >
                      <div className="p-4 pt-1 space-y-2.5 border-t border-border/40">
                        {topicVideos.length === 0 ? (
                          <div className="text-xs font-mono text-muted-foreground text-center py-4">
                            No videos assigned to this topic block.
                          </div>
                        ) : (
                          topicVideos.map((video) => (
                            <div
                              key={video.id}
                              className="flex items-center justify-between p-2.5 border border-border/30 hover:border-border/60 bg-background/50 hover:bg-background/80 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-4">
                                <Checkbox
                                  checked={video.completed}
                                  onChange={() => onToggleVideo(video.id)}
                                />
                                <div className="min-w-0">
                                  <span
                                    className={`text-[11px] font-mono text-muted-foreground ${
                                      video.completed ? "line-through text-muted-foreground/30" : ""
                                    }`}
                                  >
                                    #{video.sequenceOrder}
                                  </span>
                                  <span
                                    className={`text-xs font-medium ml-2 ${
                                      video.completed
                                        ? "line-through text-muted-foreground/65"
                                        : "text-foreground"
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
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
