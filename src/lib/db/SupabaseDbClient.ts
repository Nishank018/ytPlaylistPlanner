import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

export class SupabaseDbClient implements IDatabaseClient {
  private client: SupabaseClient | null = null;

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      this.client = createClient(url, key);
    }
  }

  private getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase client is not initialized. Check environment variables.');
    }
    return this.client;
  }

  // --- Profile & Authentication ---
  async signIn(email: string, password: string): Promise<UserProfile | null> {
    const client = this.getClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      throw new Error(error?.message || 'Authentication failed');
    }
    return this.getCurrentUser();
  }

  async signUp(email: string, password: string): Promise<UserProfile | null> {
    const client = this.getClient();
    const { data, error } = await client.auth.signUp({ email, password });
    if (error || !data.user) {
      throw new Error(error?.message || 'Registration failed');
    }
    return this.getCurrentUser();
  }

  async signOut(): Promise<void> {
    const client = this.getClient();
    const { error } = await client.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const client = this.getClient();
      const { data: { user } } = await client.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        // Create user profile in profiles table if it doesn't exist yet
        const newProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Learner',
          settings: {
            playbackSpeed: 1.0,
            dailyTimeBudget: 45,
            activeDays: [1, 2, 3, 4, 5],
            theme: 'dark',
          },
          streakCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const { data: created, error: insertError } = await client
          .from('profiles')
          .insert({
            id: newProfile.id,
            email: newProfile.email,
            display_name: newProfile.displayName,
            settings: {
              playback_speed: newProfile.settings.playbackSpeed,
              daily_time_budget: newProfile.settings.dailyTimeBudget,
              active_days: newProfile.settings.activeDays,
              theme: newProfile.settings.theme,
            },
            streak_count: newProfile.streakCount,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Failed to auto-create profile:', insertError);
          return newProfile;
        }

        return this.mapProfile(created);
      }

      return this.mapProfile(profile);
    } catch (e) {
      console.error('Error getting current user:', e);
      return null;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const client = this.getClient();
    const { data: profile, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) return null;
    return this.mapProfile(profile);
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const client = this.getClient();
    
    const dbUpdates: any = {};
    if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
    if (updates.streakCount !== undefined) dbUpdates.streak_count = updates.streakCount;
    if (updates.lastActiveDate !== undefined) dbUpdates.last_active_date = updates.lastActiveDate;
    if (updates.settings !== undefined) {
      dbUpdates.settings = {
        playback_speed: updates.settings.playbackSpeed,
        daily_time_budget: updates.settings.dailyTimeBudget,
        active_days: updates.settings.activeDays,
        theme: updates.settings.theme,
      };
    }
    dbUpdates.updated_at = new Date().toISOString();

    const { data: profile, error } = await client
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error || !profile) {
      throw new Error(`Failed to update user profile: ${error?.message}`);
    }

    return this.mapProfile(profile);
  }

  async updateUserStreak(userId: string): Promise<{ streakCount: number; lastActiveDate: string }> {
    const profile = await this.getUserProfile(userId);
    if (!profile) throw new Error('Profile not found');

    const todayStr = new Date().toISOString().split('T')[0];
    const lastActiveStr = profile.lastActiveDate;

    let newStreak = profile.streakCount;

    if (!lastActiveStr) {
      newStreak = 1;
    } else {
      const lastActive = new Date(lastActiveStr);
      const today = new Date(todayStr);
      const diffTime = Math.abs(today.getTime() - lastActive.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    await this.updateUserProfile(userId, {
      streakCount: newStreak,
      lastActiveDate: todayStr,
    });

    return { streakCount: newStreak, lastActiveDate: todayStr };
  }

  // --- Playlist Management ---
  async createPlaylist(
    playlistData: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>,
    videosData: Omit<Video, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>[],
    topicsData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<Playlist> {
    const client = this.getClient();

    // 1. Insert Playlist
    const { data: playlist, error: playlistError } = await client
      .from('playlists')
      .insert({
        user_id: playlistData.userId,
        youtube_playlist_id: playlistData.youtubePlaylistId,
        title: playlistData.title,
        description: playlistData.description,
        thumbnail_url: playlistData.thumbnailUrl,
        total_videos: playlistData.totalVideos,
        total_duration: playlistData.totalDuration,
        difficulty_level: playlistData.difficultyLevel,
      })
      .select()
      .single();

    if (playlistError || !playlist) {
      throw new Error(`Failed to insert playlist: ${playlistError?.message}`);
    }

    // 2. Insert Topics
    const topicsToInsert = topicsData.map((t) => ({
      playlist_id: playlist.id,
      name: t.name,
      sequence_order: t.sequenceOrder,
      description: t.description,
    }));

    const { data: insertedTopics, error: topicsError } = await client
      .from('topics')
      .insert(topicsToInsert)
      .select();

    if (topicsError || !insertedTopics) {
      // rollback playlist manually
      await client.from('playlists').delete().eq('id', playlist.id);
      throw new Error(`Failed to insert topics: ${topicsError?.message}`);
    }

    // 3. Insert Videos (mapping to the appropriate topic UUIDs)
    const videosToInsert = videosData.map((v) => {
      // Find matching topic in database
      const matchingTopic = insertedTopics.find(
        (t) => t.sequence_order === (v as any).topicSequenceOrder
      );

      return {
        playlist_id: playlist.id,
        topic_id: matchingTopic ? matchingTopic.id : null,
        youtube_video_id: v.youtubeVideoId,
        title: v.title,
        duration: v.duration,
        sequence_order: v.sequenceOrder,
        thumbnail_url: v.thumbnailUrl,
        completed: false,
      };
    });

    const { error: videosError } = await client
      .from('videos')
      .insert(videosToInsert);

    if (videosError) {
      // rollback playlist
      await client.from('playlists').delete().eq('id', playlist.id);
      throw new Error(`Failed to insert videos: ${videosError?.message}`);
    }

    return this.mapPlaylist(playlist);
  }

  async getPlaylists(userId: string): Promise<Playlist[]> {
    const client = this.getClient();
    const { data, error } = await client
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to load playlists: ${error.message}`);
    return (data || []).map(this.mapPlaylist);
  }

  async getPlaylistDetails(playlistId: string): Promise<{ playlist: Playlist; topics: Topic[]; videos: Video[] }> {
    const client = this.getClient();

    const { data: playlist, error: playlistError } = await client
      .from('playlists')
      .select('*')
      .eq('id', playlistId)
      .single();

    if (playlistError || !playlist) {
      throw new Error(`Failed to get playlist: ${playlistError?.message}`);
    }

    const { data: topics, error: topicsError } = await client
      .from('topics')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('sequence_order', { ascending: true });

    if (topicsError) throw new Error(`Failed to get topics: ${topicsError.message}`);

    const { data: videos, error: videosError } = await client
      .from('videos')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('sequence_order', { ascending: true });

    if (videosError) throw new Error(`Failed to get videos: ${videosError.message}`);

    return {
      playlist: this.mapPlaylist(playlist),
      topics: (topics || []).map(this.mapTopic),
      videos: (videos || []).map(this.mapVideo),
    };
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    const client = this.getClient();
    const { error } = await client
      .from('playlists')
      .delete()
      .eq('id', playlistId);

    if (error) throw new Error(`Failed to delete playlist: ${error.message}`);
  }

  // --- Progress Control ---
  async updateVideoCompletion(videoId: string, completed: boolean): Promise<Video> {
    const client = this.getClient();
    const now = new Date().toISOString();

    const { data: video, error } = await client
      .from('videos')
      .update({
        completed,
        completed_at: completed ? now : null,
        updated_at: now,
      })
      .eq('id', videoId)
      .select()
      .single();

    if (error || !video) throw new Error(`Failed to update video completion: ${error?.message}`);

    // Update streak if completed
    if (completed) {
      const user = await this.getCurrentUser();
      if (user) {
        await this.updateUserStreak(user.id);
      }
    }

    return this.mapVideo(video);
  }

  async logProgress(log: Omit<ProgressLog, 'id' | 'createdAt'>): Promise<ProgressLog> {
    const client = this.getClient();
    const { data: logEntry, error } = await client
      .from('progress_logs')
      .insert({
        user_id: log.userId,
        video_id: log.videoId,
        duration_watched: log.durationWatched,
        watched_at: log.watchedAt,
      })
      .select()
      .single();

    if (error || !logEntry) throw new Error(`Failed to insert progress log: ${error?.message}`);
    return this.mapProgressLog(logEntry);
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
    plan: Omit<RoadmapPlan, 'id' | 'createdAt' | 'updatedAt'>,
    schedules: Omit<DailySchedule, 'id' | 'createdAt'>[]
  ): Promise<RoadmapPlan> {
    const client = this.getClient();

    // 1. Insert Roadmap Plan
    const { data: dbPlan, error: planError } = await client
      .from('roadmap_plans')
      .insert({
        playlist_id: plan.playlistId,
        user_id: plan.userId,
        start_date: plan.startDate,
        playback_speed: plan.playbackSpeed,
        daily_time_budget: plan.dailyTimeBudget,
        active_days: plan.activeDays,
      })
      .select()
      .single();

    if (planError || !dbPlan) {
      throw new Error(`Failed to create roadmap plan: ${planError?.message}`);
    }

    // 2. Insert Daily Schedules & Association Videos
    for (const s of schedules) {
      const { data: dbSchedule, error: scheduleError } = await client
        .from('daily_schedules')
        .insert({
          roadmap_plan_id: dbPlan.id,
          date: s.date,
          duration_budget: s.durationBudget,
          duration_scheduled: s.durationScheduled,
          completed: s.completed,
        })
        .select()
        .single();

      if (scheduleError || !dbSchedule) {
        // Rollback
        await client.from('roadmap_plans').delete().eq('id', dbPlan.id);
        throw new Error(`Failed to insert daily schedule: ${scheduleError?.message}`);
      }

      const associations = s.videoIds.map((vId, idx) => ({
        daily_schedule_id: dbSchedule.id,
        video_id: vId,
        sequence_order: idx + 1,
      }));

      const { error: assocError } = await client
        .from('daily_schedule_videos')
        .insert(associations);

      if (assocError) {
        // Rollback
        await client.from('roadmap_plans').delete().eq('id', dbPlan.id);
        throw new Error(`Failed to insert schedule videos association: ${assocError.message}`);
      }
    }

    return this.mapRoadmapPlan(dbPlan);
  }

  async getRoadmapPlan(playlistId: string): Promise<{ plan: RoadmapPlan; schedules: DailySchedule[] } | null> {
    try {
      const client = this.getClient();

      const { data: plan, error: planError } = await client
        .from('roadmap_plans')
        .select('*')
        .eq('playlist_id', playlistId)
        .single();

      if (planError || !plan) return null;

      const { data: schedules, error: schedError } = await client
        .from('daily_schedules')
        .select(`
          id,
          roadmap_plan_id,
          date,
          duration_budget,
          duration_scheduled,
          completed,
          daily_schedule_videos (video_id, sequence_order)
        `)
        .eq('roadmap_plan_id', plan.id)
        .order('date', { ascending: true });

      if (schedError) throw new Error(schedError.message);

      const mappedSchedules: DailySchedule[] = (schedules || []).map((s: any) => {
        // Sort mapped schedule videos
        const sortedVIds = [...s.daily_schedule_videos]
          .sort((a, b) => a.sequence_order - b.sequence_order)
          .map((sv) => sv.video_id);

        return {
          id: s.id,
          roadmapPlanId: s.roadmap_plan_id,
          date: s.date,
          durationBudget: s.duration_budget,
          durationScheduled: s.duration_scheduled,
          completed: s.completed,
          videoIds: sortedVIds,
          createdAt: new Date().toISOString(), // Mock fallback
        };
      });

      return {
        plan: this.mapRoadmapPlan(plan),
        schedules: mappedSchedules,
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async updateDailyScheduleStatus(scheduleId: string, completed: boolean): Promise<DailySchedule> {
    const client = this.getClient();
    const { data: schedule, error } = await client
      .from('daily_schedules')
      .update({ completed })
      .eq('id', scheduleId)
      .select()
      .single();

    if (error || !schedule) throw new Error(`Failed to update daily schedule: ${error?.message}`);

    // Fetch video associations
    const { data: associations } = await client
      .from('daily_schedule_videos')
      .select('video_id')
      .eq('daily_schedule_id', scheduleId)
      .order('sequence_order', { ascending: true });

    return {
      id: schedule.id,
      roadmapPlanId: schedule.roadmap_plan_id,
      date: schedule.date,
      durationBudget: schedule.duration_budget,
      durationScheduled: schedule.duration_scheduled,
      completed: schedule.completed,
      videoIds: (associations || []).map((a) => a.video_id),
      createdAt: schedule.created_at,
    };
  }

  // --- Revision (Spaced Repetition) ---
  async getPendingRevisions(userId: string, date: string): Promise<RevisionTask[]> {
    const client = this.getClient();

    const { data: dbRevisions, error } = await client
      .from('revision_sessions')
      .select(`
        id,
        interval_step,
        next_review_date,
        topic:topics(
          id,
          name,
          playlist:playlists(title)
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .lte('next_review_date', date);

    if (error) throw new Error(`Failed to fetch pending revisions: ${error.message}`);

    return (dbRevisions || []).map((r: any) => ({
      id: r.id,
      topicName: r.topic?.name || 'Unknown Topic',
      topicId: r.topic?.id || '',
      playlistTitle: r.topic?.playlist?.title || 'Unknown Playlist',
      intervalStep: r.interval_step,
      nextReviewDate: r.next_review_date,
    }));
  }

  async createRevisionSession(session: Omit<RevisionSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<RevisionSession> {
    const client = this.getClient();

    const { data: existing } = await client
      .from('revision_sessions')
      .select('*')
      .eq('user_id', session.userId)
      .eq('topic_id', session.topicId)
      .maybeSingle();

    if (existing) {
      return this.mapRevisionSession(existing);
    }

    const { data: dbSession, error } = await client
      .from('revision_sessions')
      .insert({
        user_id: session.userId,
        topic_id: session.topicId,
        interval_step: session.intervalStep,
        next_review_date: session.nextReviewDate,
        status: session.status,
      })
      .select()
      .single();

    if (error || !dbSession) throw new Error(`Failed to create revision session: ${error?.message}`);
    return this.mapRevisionSession(dbSession);
  }

  async updateRevisionSession(
    sessionId: string,
    status: 'passed' | 'failed',
    nextReviewDate: string,
    intervalStep: number
  ): Promise<RevisionSession> {
    const client = this.getClient();
    const now = new Date().toISOString();

    const { data: dbSession, error } = await client
      .from('revision_sessions')
      .update({
        status,
        next_review_date: nextReviewDate,
        interval_step: intervalStep,
        last_review_date: now.split('T')[0],
        updated_at: now,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error || !dbSession) throw new Error(`Failed to update revision session: ${error?.message}`);
    return this.mapRevisionSession(dbSession);
  }

  async getRevisionSessions(userId: string): Promise<RevisionSession[]> {
    const client = this.getClient();
    const { data, error } = await client
      .from('revision_sessions')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to get revision sessions: ${error.message}`);
    return (data || []).map(this.mapRevisionSession);
  }

  // --- Mappers to transform DB fields (snake_case) to TS types (camelCase) ---
  private mapProfile(p: any): UserProfile {
    return {
      id: p.id,
      email: p.email,
      displayName: p.display_name,
      settings: {
        playbackSpeed: p.settings?.playback_speed || 1.0,
        dailyTimeBudget: p.settings?.daily_time_budget || 45,
        activeDays: p.settings?.active_days || [1, 2, 3, 4, 5],
        theme: p.settings?.theme || 'dark',
      },
      streakCount: p.streak_count || 0,
      lastActiveDate: p.last_active_date,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    };
  }

  private mapPlaylist(pl: any): Playlist {
    return {
      id: pl.id,
      userId: pl.user_id,
      youtubePlaylistId: pl.youtube_playlist_id,
      title: pl.title,
      description: pl.description,
      thumbnailUrl: pl.thumbnail_url,
      totalVideos: pl.total_videos,
      totalDuration: pl.total_duration,
      difficultyLevel: pl.difficulty_level || 'Beginner',
      createdAt: pl.created_at,
      updatedAt: pl.updated_at,
    };
  }

  private mapTopic(t: any): Topic {
    return {
      id: t.id,
      playlistId: t.playlist_id,
      name: t.name,
      sequenceOrder: t.sequence_order,
      description: t.description,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    };
  }

  private mapVideo(v: any): Video {
    return {
      id: v.id,
      playlistId: v.playlist_id,
      topicId: v.topic_id,
      youtubeVideoId: v.youtube_video_id,
      title: v.title,
      duration: v.duration,
      sequenceOrder: v.sequence_order,
      thumbnailUrl: v.thumbnail_url,
      completed: v.completed || false,
      completedAt: v.completed_at,
      createdAt: v.created_at,
      updatedAt: v.updated_at,
    };
  }

  private mapRoadmapPlan(rm: any): RoadmapPlan {
    return {
      id: rm.id,
      playlistId: rm.playlist_id,
      userId: rm.user_id,
      startDate: rm.start_date,
      playbackSpeed: Number(rm.playback_speed) || 1.0,
      dailyTimeBudget: rm.daily_time_budget,
      activeDays: rm.active_days || [],
      createdAt: rm.created_at,
      updatedAt: rm.updated_at,
    };
  }

  private mapProgressLog(l: any): ProgressLog {
    return {
      id: l.id,
      userId: l.user_id,
      videoId: l.video_id,
      watchedAt: l.watched_at,
      durationWatched: l.duration_watched,
      createdAt: l.created_at,
    };
  }

  private mapRevisionSession(r: any): RevisionSession {
    return {
      id: r.id,
      userId: r.user_id,
      topicId: r.topic_id,
      intervalStep: r.interval_step,
      nextReviewDate: r.next_review_date,
      lastReviewDate: r.last_review_date,
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }
}
