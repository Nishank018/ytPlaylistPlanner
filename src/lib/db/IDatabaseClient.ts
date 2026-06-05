export type ThemeType = 'light' | 'dark' | 'system';

export interface UserSettings {
  playbackSpeed: number; // 1.0, 1.25, 1.5, 1.75, 2.0
  dailyTimeBudget: number; // in minutes
  activeDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  theme: ThemeType;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  settings: UserSettings;
  streakCount: number;
  lastActiveDate?: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  userId: string;
  youtubePlaylistId?: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  totalVideos: number;
  totalDuration: number; // in seconds
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  playlistId: string;
  name: string;
  sequenceOrder: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  playlistId: string;
  topicId?: string; // reference to grouped topic block
  youtubeVideoId: string;
  title: string;
  duration: number; // in seconds (actual)
  sequenceOrder: number; // ordering index inside the playlist
  thumbnailUrl?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapPlan {
  id: string;
  playlistId: string;
  userId: string;
  startDate: string; // YYYY-MM-DD
  playbackSpeed: number; // speed value used at creation
  dailyTimeBudget: number; // budget value used at creation (minutes)
  activeDays: number[]; // active days list used at creation
  createdAt: string;
  updatedAt: string;
}

export interface DailySchedule {
  id: string;
  roadmapPlanId: string;
  date: string; // YYYY-MM-DD
  durationBudget: number; // in seconds
  durationScheduled: number; // in seconds, adjusted for speed
  completed: boolean;
  videoIds: string[]; // List of reference video IDs scheduled for this day
  createdAt: string;
}

export type RevisionStatus = 'pending' | 'passed' | 'failed';

export interface RevisionSession {
  id: string;
  userId: string;
  topicId: string;
  intervalStep: number; // Leitner Steps (0 to 4)
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewDate?: string; // YYYY-MM-DD
  status: RevisionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressLog {
  id: string;
  userId: string;
  videoId: string;
  watchedAt: string;
  durationWatched: number; // seconds
  createdAt: string;
}

export interface ProgressStats {
  percentageComplete: number;
  totalVideosCount: number;
  completedVideosCount: number;
  actualDurationTotal: number; // seconds
  speedAdjustedDurationTotal: number; // seconds
  durationCompleted: number; // seconds
  speedAdjustedDurationCompleted: number; // seconds
  estimatedTimeRemaining: number; // seconds (adjusted for speed)
}

export interface RevisionTask {
  id: string; // RevisionSession ID
  topicName: string;
  topicId: string;
  playlistTitle: string;
  intervalStep: number;
  nextReviewDate: string;
}

export interface IDatabaseClient {
  // --- Profile & Authentication ---
  getCurrentUser(): Promise<UserProfile | null>;
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile>;
  updateUserStreak(userId: string): Promise<{ streakCount: number; lastActiveDate: string }>;
  signIn(email: string, password: string): Promise<UserProfile | null>;
  signUp(email: string, password: string): Promise<UserProfile | null>;
  signOut(): Promise<void>;

  // --- Playlist Management ---
  createPlaylist(
    playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>,
    videos: Omit<Video, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>[],
    topics: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<Playlist>;
  getPlaylists(userId: string): Promise<Playlist[]>;
  getPlaylistDetails(playlistId: string): Promise<{ playlist: Playlist; topics: Topic[]; videos: Video[] }>;
  deletePlaylist(playlistId: string): Promise<void>;

  // --- Progress Control ---
  updateVideoCompletion(videoId: string, completed: boolean): Promise<Video>;
  logProgress(log: Omit<ProgressLog, 'id' | 'createdAt'>): Promise<ProgressLog>;
  getUserProgressStats(userId: string, playlistId: string): Promise<ProgressStats>;

  // --- Roadmap Planning ---
  createRoadmapPlan(
    plan: Omit<RoadmapPlan, 'id' | 'createdAt' | 'updatedAt'>,
    schedules: Omit<DailySchedule, 'id' | 'createdAt'>[]
  ): Promise<RoadmapPlan>;
  getRoadmapPlan(playlistId: string): Promise<{ plan: RoadmapPlan; schedules: DailySchedule[] } | null>;
  updateDailyScheduleStatus(scheduleId: string, completed: boolean): Promise<DailySchedule>;

  // --- Revision (Spaced Repetition) ---
  getPendingRevisions(userId: string, date: string): Promise<RevisionTask[]>;
  createRevisionSession(session: Omit<RevisionSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<RevisionSession>;
  updateRevisionSession(
    sessionId: string,
    status: 'passed' | 'failed',
    nextReviewDate: string,
    intervalStep: number
  ): Promise<RevisionSession>;
  getRevisionSessions(userId: string): Promise<RevisionSession[]>;
}
