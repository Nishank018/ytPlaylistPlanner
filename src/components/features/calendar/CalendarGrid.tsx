import React from "react";
import { DailySchedule, Video, Topic, RevisionSession, RevisionTask } from "@/lib/db/IDatabaseClient";
import { usePlanner } from "@/context/PlannerContext";
import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";

interface CalendarGridProps {
  dailySchedules: DailySchedule[];
  videos: Video[];
  topics: Topic[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ dailySchedules, videos, topics }) => {
  const { pendingRevisions } = usePlanner();

  if (dailySchedules.length === 0) {
    return (
      <div className="text-center font-mono text-xs text-muted-foreground py-8 border border-dashed border-border p-4 bg-card/20">
        No roadmap plan generated yet. Go to settings to generate one.
      </div>
    );
  }

  // Parse start and end dates
  const sortedSchedules = React.useMemo(() => {
    return [...dailySchedules].sort((a, b) => a.date.localeCompare(b.date));
  }, [dailySchedules]);

  const firstDateStr = sortedSchedules[0].date;
  const lastDateStr = sortedSchedules[sortedSchedules.length - 1].date;

  const [startY, startM, startD] = firstDateStr.split("-").map(Number);
  const [endY, endM, endD] = lastDateStr.split("-").map(Number);

  const startDate = new Date(Date.UTC(startY, startM - 1, startD));
  const endDate = new Date(Date.UTC(endY, endM - 1, endD));

  // Align grid to start of the week (Sunday = 0) of the first day
  const gridStart = new Date(startDate.getTime());
  const startDayOfWeek = gridStart.getUTCDay();
  gridStart.setUTCDate(gridStart.getUTCDate() - startDayOfWeek);

  // Align grid to end of the week (Saturday = 6) of the last day
  const gridEnd = new Date(endDate.getTime());
  const endDayOfWeek = gridEnd.getUTCDay();
  gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - endDayOfWeek));

  // Generate list of all calendar dates between gridStart and gridEnd
  const calendarDays: Date[] = [];
  const curr = new Date(gridStart.getTime());
  while (curr.getTime() <= gridEnd.getTime()) {
    calendarDays.push(new Date(curr.getTime()));
    curr.setUTCDate(curr.getUTCDate() + 1);
  }

  const formatDateUTC = (date: Date): string => {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Precompute O(1) lookups to avoid O(N) loops inside the cell mapper
  const scheduleMap = React.useMemo(() => {
    return new Map(dailySchedules.map((s) => [s.date, s]));
  }, [dailySchedules]);

  const dayNumMap = React.useMemo(() => {
    return new Map(sortedSchedules.map((s, idx) => [s.date, idx + 1]));
  }, [sortedSchedules]);

  const dayRevisionsMap = React.useMemo(() => {
    const map = new Map<string, RevisionTask[]>();
    pendingRevisions.forEach((rev) => {
      const list = map.get(rev.nextReviewDate) || [];
      list.push(rev);
      map.set(rev.nextReviewDate, list);
    });
    return map;
  }, [pendingRevisions]);

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

  return (
    <div className="space-y-4 font-sans select-none">
      <div className="grid grid-cols-7 border-t border-l border-border text-center font-mono text-xs">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} className="border-r border-b border-border bg-secondary py-2 font-bold text-muted-foreground">
            {dayName}
          </div>
        ))}

        {calendarDays.map((day, idx) => {
          const dateStr = formatDateUTC(day);
          const schedule = scheduleMap.get(dateStr);
          const dayNum = dayNumMap.get(dateStr) ?? null;
          const isCurrentMonthDay = day.getUTCMonth() === startDate.getUTCMonth();

          // Check if revisions are scheduled on this day
          const dayRevisions = dayRevisionsMap.get(dateStr) || [];

          // Get videos scheduled for this day
          const dayVideos = dayVideosMap.get(dateStr) || [];

          return (
            <div
              key={idx}
              className={`min-h-[110px] border-r border-b border-border p-2 flex flex-col justify-between transition-colors ${
                schedule
                  ? "bg-card hover:bg-card/70"
                  : "bg-background/20 opacity-50"
              }`}
            >
              {/* Day header */}
              <div className="flex justify-between items-start font-mono text-[10px]">
                <span className={isCurrentMonthDay ? "text-foreground font-bold" : "text-muted-foreground"}>
                  {day.getUTCDate()}
                </span>
                {dayNum !== null ? (
                  <span className="text-primary font-extrabold uppercase">DAY {dayNum}</span>
                ) : (
                  <span className="text-muted-foreground/60">(Off)</span>
                )}
              </div>

              {/* Day content */}
              <div className="flex-1 my-1.5 space-y-1 overflow-hidden">
                {/* Revision Session Purple Badge */}
                {dayRevisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="text-[9px] font-mono leading-none py-0.5 px-1 border border-revision/20 bg-revision/5 text-revision truncate block"
                    title={`Review: ${rev.topicName}`}
                  >
                    🔂 Rev: {rev.topicName}
                  </div>
                ))}

                {/* Scheduled Videos */}
                {dayVideos.map((vid) => (
                  <div
                    key={vid.id}
                    className={`text-[9px] truncate font-medium flex items-center gap-1 ${
                      vid.completed ? "text-muted-foreground/50 line-through" : "text-foreground"
                    }`}
                    title={vid.title}
                  >
                    <span className="font-mono text-muted-foreground shrink-0">#{vid.sequenceOrder}</span>
                    <span className="truncate">{vid.title}</span>
                  </div>
                ))}
              </div>

              {/* Day footer/status */}
              {schedule && (
                <div className="flex justify-between items-center font-mono text-[9px] border-t border-border/20 pt-1">
                  <span className="text-muted-foreground">{dayVideos.length} vid{dayVideos.length !== 1 ? "s" : ""}</span>
                  {schedule.completed ? (
                    <span className="text-success flex items-center gap-0.5 font-bold">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      DONE
                    </span>
                  ) : (
                    <span className="text-muted-foreground">PENDING</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
