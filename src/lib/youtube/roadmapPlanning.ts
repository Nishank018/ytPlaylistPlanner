import { Video, DailySchedule } from "../db/IDatabaseClient";

export interface ScheduleInput {
  videos: Video[];
  startDate: string; // YYYY-MM-DD
  playbackSpeed: number; // e.g. 1.0, 1.25, 1.5, 2.0
  dailyTimeBudget: number; // in minutes
  activeDays: number[]; // e.g. [1, 3, 5] (Monday, Wednesday, Friday)
}

/**
 * Format a Date object to YYYY-MM-DD in UTC timezone.
 */
const formatDateUTC = (date: Date): string => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Helper function to advance a Date to the next active day.
 */
const advanceToNextActiveDay = (date: Date, activeDays: number[]): Date => {
  const next = new Date(date.getTime());
  do {
    next.setUTCDate(next.getUTCDate() + 1);
  } while (!activeDays.includes(next.getUTCDay()));
  return next;
};

/**
 * Generates daily schedules based on user budget and active days, avoiding splitting videos across days.
 */
export function generateDailySchedules(input: ScheduleInput): Omit<DailySchedule, "id" | "createdAt">[] {
  const schedules: Omit<DailySchedule, "id" | "createdAt">[] = [];
  const dailyBudgetSec = input.dailyTimeBudget * 60;
  
  // Default playbackSpeed to 1.0 if invalid to prevent division-by-zero or NaN
  const speed = input.playbackSpeed > 0 ? input.playbackSpeed : 1.0;

  // Sanitized active days: ensure valid week days (0 = Sunday, 6 = Saturday)
  const active = (input.activeDays && input.activeDays.length > 0)
    ? Array.from(new Set(input.activeDays)).filter(d => d >= 0 && d <= 6)
    : [1, 2, 3, 4, 5]; // Default to weekdays if empty or invalid
  
  const activeDaysList = active.length > 0 ? active : [1, 2, 3, 4, 5];

  // Distribute videos sequentially by sequenceOrder
  const sortedVideos = [...input.videos].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  // Parse start date as UTC midnight to avoid local timezone offset shifts
  const [year, month, day] = input.startDate.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error(`Invalid startDate format: ${input.startDate}. Expected YYYY-MM-DD.`);
  }
  let currentDate = new Date(Date.UTC(year, month - 1, day));

  // Align start date to the first active day if it's not currently active
  if (!activeDaysList.includes(currentDate.getUTCDay())) {
    currentDate = advanceToNextActiveDay(currentDate, activeDaysList);
  }

  let currentIdx = 0;

  while (currentIdx < sortedVideos.length) {
    const dayVideoIds: string[] = [];
    let scheduledSeconds = 0;

    while (currentIdx < sortedVideos.length) {
      const video = sortedVideos[currentIdx];
      const videoEffDuration = Math.round(video.duration / speed);

      // Rule 1: Always allocate the first video in the day (even if its effective duration exceeds the budget)
      if (dayVideoIds.length === 0) {
        dayVideoIds.push(video.id);
        scheduledSeconds += videoEffDuration;
        currentIdx++;
        continue;
      }

      // Rule 2: Subsequent videos are only scheduled if they fit in the remaining budget
      const remainingBudget = dailyBudgetSec - scheduledSeconds;
      if (videoEffDuration <= remainingBudget) {
        dayVideoIds.push(video.id);
        scheduledSeconds += videoEffDuration;
        currentIdx++;
      } else {
        // Rule 3: Single-video splits avoidance. If it doesn't fit, break out and defer it
        break;
      }
    }

    schedules.push({
      roadmapPlanId: "", // Filled by the controller/database implementation
      date: formatDateUTC(currentDate),
      durationBudget: dailyBudgetSec,
      durationScheduled: scheduledSeconds,
      completed: false,
      videoIds: dayVideoIds,
    });

    // Advance to the next active day for the next iteration
    if (currentIdx < sortedVideos.length) {
      currentDate = advanceToNextActiveDay(currentDate, activeDaysList);
    }
  }

  return schedules;
}

const INTERVAL_DAYS: Record<number, number> = {
  0: 0,   // Initial queue state
  1: 1,   // Review 1 (Day +1)
  2: 3,   // Review 2 (Day +3 from last)
  3: 7,   // Review 3 (Day +7 from last)
  4: 30   // Review 4 (Day +30 from last)
};

/**
 * Handle spacing interval logic for Leitner spaced repetition.
 */
export function handleRevisionResult(
  currentStep: number,
  isPass: boolean,
  currentDateStr: string
): { nextStep: number; nextReviewDate: string } {
  let nextStep = currentStep;

  if (isPass) {
    // Advance to next step, capped at step 4
    nextStep = Math.min(currentStep + 1, 4);
  } else {
    // Fail: reset back to Step 1 (triggers a review tomorrow)
    nextStep = 1;
  }

  const daysToAdd = INTERVAL_DAYS[nextStep] ?? 1;

  // Safely compute next review date using UTC to avoid timezone drift
  const [year, month, day] = currentDateStr.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error(`Invalid currentDateStr format: ${currentDateStr}. Expected YYYY-MM-DD.`);
  }
  const nextDate = new Date(Date.UTC(year, month - 1, day));
  nextDate.setUTCDate(nextDate.getUTCDate() + daysToAdd);

  return {
    nextStep,
    nextReviewDate: formatDateUTC(nextDate),
  };
}
