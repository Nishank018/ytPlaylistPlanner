import {
  IDatabaseClient,
  UserProfile,
  Playlist,
  Topic,
  Video,
  RoadmapPlan,
  DailySchedule,
  ProgressLog,
  ProgressStats,
  RevisionSession,
  RevisionTask,
} from './IDatabaseClient';

const KEYS = {
  PROFILE: 'ytpp_profile',
  PLAYLISTS: 'ytpp_playlists',
  TOPICS: 'ytpp_topics',
  VIDEOS: 'ytpp_videos',
  ROADMAPS: 'ytpp_roadmaps',
  SCHEDULES: 'ytpp_schedules',
  REVISIONS: 'ytpp_revisions',
  LOGS: 'ytpp_logs',
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'mock-user-id',
  email: 'learner@example.com',
  displayName: 'Self-Directed Learner',
  settings: {
    playbackSpeed: 1.0,
    dailyTimeBudget: 45,
    activeDays: [1, 2, 3, 4, 5], // Mon-Fri
    theme: 'dark',
  },
  streakCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export class LocalStorageDbClient implements IDatabaseClient {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private get<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }

  private set<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // --- Profile & Authentication ---
  async getCurrentUser(): Promise<UserProfile | null> {
    return this.get<UserProfile | null>(KEYS.PROFILE, null);
  }

  async signIn(email: string, password: string): Promise<UserProfile | null> {
    const users = this.get<any[]>('ytpp_users_db', []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('User not found. Please sign up first.');
    }
    if (user.password !== password) {
      throw new Error('Incorrect password.');
    }

    const profile: UserProfile = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      settings: user.settings,
      streakCount: user.streakCount,
      lastActiveDate: user.lastActiveDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    this.set(KEYS.PROFILE, profile);
    return profile;
  }

  async signUp(email: string, password: string): Promise<UserProfile | null> {
    const users = this.get<any[]>('ytpp_users_db', []);
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const userId = 'usr_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    
    const newUser = {
      id: userId,
      email,
      password,
      displayName: email.split('@')[0],
      settings: {
        playbackSpeed: 1.0,
        dailyTimeBudget: 45,
        activeDays: [1, 2, 3, 4, 5],
        theme: 'dark' as const,
      },
      streakCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    users.push(newUser);
    this.set('ytpp_users_db', users);

    const profile: UserProfile = {
      id: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName,
      settings: newUser.settings,
      streakCount: newUser.streakCount,
      lastActiveDate: undefined,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    this.set(KEYS.PROFILE, profile);
    return profile;
  }

  async signOut(): Promise<void> {
    if (this.isBrowser()) {
      localStorage.removeItem(KEYS.PROFILE);
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const user = await this.getCurrentUser();
    if (user && user.id === userId) return user;
    return null;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const user = await this.getCurrentUser();
    const updated = {
      ...(user || DEFAULT_PROFILE),
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.set(KEYS.PROFILE, updated);
    return updated;
  }

  async updateUserStreak(_userId: string): Promise<{ streakCount: number; lastActiveDate: string }> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not found');

    const todayStr = new Date().toISOString().split('T')[0];
    const lastActiveStr = user.lastActiveDate;

    let newStreak = user.streakCount;

    if (!lastActiveStr) {
      // First activity
      newStreak = 1;
    } else {
      const lastActive = new Date(lastActiveStr);
      const today = new Date(todayStr);
      const diffTime = Math.abs(today.getTime() - lastActive.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Increment streak if last active yesterday
        newStreak += 1;
      } else if (diffDays > 1) {
        // Reset streak if more than 1 day difference
        newStreak = 1;
      }
      // If diffDays === 0, keep streak the same (already active today)
    }

    const updatedProfile = {
      ...user,
      streakCount: newStreak,
      lastActiveDate: todayStr,
      updatedAt: new Date().toISOString(),
    };

    this.set(KEYS.PROFILE, updatedProfile);
    return { streakCount: newStreak, lastActiveDate: todayStr };
  }

  // --- Playlist Management ---
  async createPlaylist(
    playlistData: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>,
    videosData: Omit<Video, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>[],
    topicsData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<Playlist> {
    const playlistId = 'pl_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    const newPlaylist: Playlist = {
      ...playlistData,
      id: playlistId,
      createdAt: now,
      updatedAt: now,
    };

    const playlistTopicMap: Record<number, string> = {}; // sequenceOrder -> topicId

    const newTopics: Topic[] = topicsData.map((t) => {
      const topicId = 'tp_' + Math.random().toString(36).substring(2, 9);
      playlistTopicMap[t.sequenceOrder] = topicId;
      return {
        ...t,
        id: topicId,
        playlistId,
        createdAt: now,
        updatedAt: now,
      };
    });

    const newVideos: Video[] = videosData.map((v) => {
      const videoId = 'vd_' + Math.random().toString(36).substring(2, 9);
      // Map video to topic if topic structure corresponds to order
      let assignedTopicId: string | undefined = undefined;

      // Find the topic corresponding to this video order
      const matchingTopic = newTopics.find((t) => {
        // Find which topic block sequence this video belongs to
        // topics are ordered. A topic covers a span.
        // We'll rely on the topicId assigned by the intelligence or parser agent.
        // If the video already has a topic index or title match, map it.
        return t.sequenceOrder === (v as any).topicSequenceOrder;
      });

      if (matchingTopic) {
        assignedTopicId = matchingTopic.id;
      } else if (v.topicId) {
        // fallback to if there's already an index matching topic index
        const tIndex = parseInt(v.topicId);
        const matchByIndex = newTopics[tIndex];
        if (matchByIndex) {
          assignedTopicId = matchByIndex.id;
        }
      }

      return {
        ...v,
        id: videoId,
        playlistId,
        topicId: assignedTopicId,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
    });

    // Save
    const playlists = this.get<Playlist[]>(KEYS.PLAYLISTS, []);
    playlists.push(newPlaylist);
    this.set(KEYS.PLAYLISTS, playlists);

    const topics = this.get<Topic[]>(KEYS.TOPICS, []);
    topics.push(...newTopics);
    this.set(KEYS.TOPICS, topics);

    const videos = this.get<Video[]>(KEYS.VIDEOS, []);
    videos.push(...newVideos);
    this.set(KEYS.VIDEOS, videos);

    return newPlaylist;
  }

  async getPlaylists(userId: string): Promise<Playlist[]> {
    const playlists = this.get<Playlist[]>(KEYS.PLAYLISTS, []);
    return playlists.filter((p) => p.userId === userId);
  }

  async getPlaylistDetails(playlistId: string): Promise<{ playlist: Playlist; topics: Topic[]; videos: Video[] }> {
    const playlists = this.get<Playlist[]>(KEYS.PLAYLISTS, []);
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) throw new Error('Playlist not found');

    const topics = this.get<Topic[]>(KEYS.TOPICS, []);
    const playlistTopics = topics
      .filter((t) => t.playlistId === playlistId)
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder);

    const videos = this.get<Video[]>(KEYS.VIDEOS, []);
    const playlistVideos = videos
      .filter((v) => v.playlistId === playlistId)
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder);

    return { playlist, topics: playlistTopics, videos: playlistVideos };
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    const playlists = this.get<Playlist[]>(KEYS.PLAYLISTS, []);
    this.set(
      KEYS.PLAYLISTS,
      playlists.filter((p) => p.id !== playlistId)
    );

    const topics = this.get<Topic[]>(KEYS.TOPICS, []);
    this.set(
      KEYS.TOPICS,
      topics.filter((t) => t.playlistId !== playlistId)
    );

    const videos = this.get<Video[]>(KEYS.VIDEOS, []);
    this.set(
      KEYS.VIDEOS,
      videos.filter((v) => v.playlistId !== playlistId)
    );

    const roadmaps = this.get<RoadmapPlan[]>(KEYS.ROADMAPS, []);
    const matchedRoadmaps = roadmaps.filter((r) => r.playlistId === playlistId);
    const matchedRoadmapIds = matchedRoadmaps.map((r) => r.id);

    this.set(
      KEYS.ROADMAPS,
      roadmaps.filter((r) => r.playlistId !== playlistId)
    );

    const schedules = this.get<DailySchedule[]>(KEYS.SCHEDULES, []);
    this.set(
      KEYS.SCHEDULES,
      schedules.filter((s) => !matchedRoadmapIds.includes(s.roadmapPlanId))
    );
  }

  // --- Progress Control ---
  async updateVideoCompletion(videoId: string, completed: boolean): Promise<Video> {
    const videos = this.get<Video[]>(KEYS.VIDEOS, []);
    const idx = videos.findIndex((v) => v.id === videoId);
    if (idx === -1) throw new Error('Video not found');

    const now = new Date().toISOString();
    videos[idx] = {
      ...videos[idx],
      completed,
      completedAt: completed ? now : undefined,
      updatedAt: now,
    };
    this.set(KEYS.VIDEOS, videos);

    // If completed, trigger streak update
    if (completed) {
      const user = await this.getCurrentUser();
      if (user) {
        await this.updateUserStreak(user.id);
      }
    }

    return videos[idx];
  }

  async logProgress(logData: Omit<ProgressLog, 'id' | 'createdAt'>): Promise<ProgressLog> {
    const logs = this.get<ProgressLog[]>(KEYS.LOGS, []);
    const newLog: ProgressLog = {
      ...logData,
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    logs.push(newLog);
    this.set(KEYS.LOGS, logs);
    return newLog;
  }

  async getUserProgressStats(userId: string, playlistId: string): Promise<ProgressStats> {
    const { playlist, videos } = await this.getPlaylistDetails(playlistId);
    const roadmap = await this.getRoadmapPlan(playlistId);

    const speed = roadmap?.plan?.playbackSpeed || 1.0;

    const totalVideosCount = videos.length;
    const completedVideos = videos.filter((v) => v.completed);
    const completedVideosCount = completedVideos.length;

    const actualDurationTotal = playlist.totalDuration;
    const speedAdjustedDurationTotal = Math.round(actualDurationTotal / speed);

    const durationCompleted = completedVideos.reduce((acc, v) => acc + v.duration, 0);
    const speedAdjustedDurationCompleted = Math.round(durationCompleted / speed);

    const estimatedTimeRemaining = Math.max(0, speedAdjustedDurationTotal - speedAdjustedDurationCompleted);

    const percentageComplete = totalVideosCount > 0 ? Math.round((completedVideosCount / totalVideosCount) * 100) : 0;

    return {
      percentageComplete,
      totalVideosCount,
      completedVideosCount,
      actualDurationTotal,
      speedAdjustedDurationTotal,
      durationCompleted,
      speedAdjustedDurationCompleted,
      estimatedTimeRemaining,
    };
  }

  // --- Roadmap Planning ---
  async createRoadmapPlan(
    planData: Omit<RoadmapPlan, 'id' | 'createdAt' | 'updatedAt'>,
    schedulesData: Omit<DailySchedule, 'id' | 'createdAt'>[]
  ): Promise<RoadmapPlan> {
    const roadmapPlanId = 'rm_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    const newPlan: RoadmapPlan = {
      ...planData,
      id: roadmapPlanId,
      createdAt: now,
      updatedAt: now,
    };

    const newSchedules: DailySchedule[] = schedulesData.map((s) => ({
      ...s,
      id: 'sd_' + Math.random().toString(36).substring(2, 9),
      roadmapPlanId,
      createdAt: now,
    }));

    // Save, overwriting any previous roadmap plans for this playlist
    const roadmaps = this.get<RoadmapPlan[]>(KEYS.ROADMAPS, []);
    const filteredRoadmaps = roadmaps.filter((r) => r.playlistId !== planData.playlistId);
    filteredRoadmaps.push(newPlan);
    this.set(KEYS.ROADMAPS, filteredRoadmaps);

    const schedules = this.get<DailySchedule[]>(KEYS.SCHEDULES, []);
    // Remove old schedules for previous roadmaps of this playlist
    const oldPlanIds = roadmaps.filter((r) => r.playlistId === planData.playlistId).map((r) => r.id);
    const filteredSchedules = schedules.filter((s) => !oldPlanIds.includes(s.roadmapPlanId));
    filteredSchedules.push(...newSchedules);
    this.set(KEYS.SCHEDULES, filteredSchedules);

    return newPlan;
  }

  async getRoadmapPlan(playlistId: string): Promise<{ plan: RoadmapPlan; schedules: DailySchedule[] } | null> {
    const roadmaps = this.get<RoadmapPlan[]>(KEYS.ROADMAPS, []);
    const plan = roadmaps.find((r) => r.playlistId === playlistId);
    if (!plan) return null;

    const schedules = this.get<DailySchedule[]>(KEYS.SCHEDULES, []);
    const planSchedules = schedules
      .filter((s) => s.roadmapPlanId === plan.id)
      .sort((a, b) => a.date.localeCompare(b.date));

    return { plan, schedules: planSchedules };
  }

  async updateDailyScheduleStatus(scheduleId: string, completed: boolean): Promise<DailySchedule> {
    const schedules = this.get<DailySchedule[]>(KEYS.SCHEDULES, []);
    const idx = schedules.findIndex((s) => s.id === scheduleId);
    if (idx === -1) throw new Error('Daily schedule not found');

    schedules[idx] = {
      ...schedules[idx],
      completed,
    };
    this.set(KEYS.SCHEDULES, schedules);
    return schedules[idx];
  }

  // --- Revision (Spaced Repetition) ---
  async getPendingRevisions(userId: string, date: string): Promise<RevisionTask[]> {
    const revisions = this.get<RevisionSession[]>(KEYS.REVISIONS, []);
    const pendingSessions = revisions.filter(
      (r) => r.userId === userId && r.status === 'pending' && r.nextReviewDate <= date
    );

    const topics = this.get<Topic[]>(KEYS.TOPICS, []);
    const playlists = this.get<Playlist[]>(KEYS.PLAYLISTS, []);

    const tasks: RevisionTask[] = [];

    for (const session of pendingSessions) {
      const topic = topics.find((t) => t.id === session.topicId);
      if (!topic) continue;

      const playlist = playlists.find((p) => p.id === topic.playlistId);
      if (!playlist) continue;

      tasks.push({
        id: session.id,
        topicName: topic.name,
        topicId: topic.id,
        playlistTitle: playlist.title,
        intervalStep: session.intervalStep,
        nextReviewDate: session.nextReviewDate,
      });
    }

    return tasks;
  }

  async createRevisionSession(sessionData: Omit<RevisionSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<RevisionSession> {
    const revisions = this.get<RevisionSession[]>(KEYS.REVISIONS, []);
    const existingIdx = revisions.findIndex((r) => r.userId === sessionData.userId && r.topicId === sessionData.topicId);

    const now = new Date().toISOString();

    if (existingIdx !== -1) {
      // Return existing or overwrite
      return revisions[existingIdx];
    }

    const newSession: RevisionSession = {
      ...sessionData,
      id: 'rev_' + Math.random().toString(36).substring(2, 9),
      createdAt: now,
      updatedAt: now,
    };

    revisions.push(newSession);
    this.set(KEYS.REVISIONS, revisions);
    return newSession;
  }

  async updateRevisionSession(
    sessionId: string,
    status: 'passed' | 'failed',
    nextReviewDate: string,
    intervalStep: number
  ): Promise<RevisionSession> {
    const revisions = this.get<RevisionSession[]>(KEYS.REVISIONS, []);
    const idx = revisions.findIndex((r) => r.id === sessionId);
    if (idx === -1) throw new Error('Revision session not found');

    const now = new Date().toISOString();
    revisions[idx] = {
      ...revisions[idx],
      status,
      nextReviewDate,
      intervalStep,
      lastReviewDate: now.split('T')[0],
      updatedAt: now,
    };
    this.set(KEYS.REVISIONS, revisions);
    return revisions[idx];
  }

  async getRevisionSessions(userId: string): Promise<RevisionSession[]> {
    const revisions = this.get<RevisionSession[]>(KEYS.REVISIONS, []);
    return revisions.filter((r) => r.userId === userId);
  }
}
