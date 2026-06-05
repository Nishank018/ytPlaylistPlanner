'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dbClient, isCloudMode } from '@/lib/db/dbClientFactory';
import {
  Playlist,
  Topic,
  Video,
  RoadmapPlan,
  DailySchedule,
  ProgressStats,
  UserProfile,
  UserSettings,
  RevisionTask
} from '@/lib/db/IDatabaseClient';
import { generateDailySchedules, handleRevisionResult } from '@/lib/youtube/roadmapPlanning';

export interface MilestoneAlert {
  type: 'first_video' | 'topic_completed' | 'playlist_completed' | 'streak_milestone';
  message: string;
  payload?: any;
}

export interface PlannerContextType {
  // Authentication & Profile state
  userProfile: UserProfile | null;
  refreshUserProfile: () => Promise<UserProfile | null>;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isCloud: boolean;

  // Playlist state
  playlists: Playlist[];
  activePlaylist: Playlist | null;
  topics: Topic[];
  videos: Video[];
  progressStats: ProgressStats | null;
  isLoading: boolean;
  error: string | null;

  // Playlist actions
  loadPlaylists: (userId: string) => Promise<void>;
  selectPlaylist: (playlistId: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  createPlaylist: (
    playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>,
    videos: Omit<Video, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>[],
    topics: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>[]
  ) => Promise<Playlist>;

  // Progress actions
  toggleVideoCompletion: (videoId: string) => Promise<void>;
  logVideoProgress: (videoId: string, durationWatched: number) => Promise<void>;

  // Roadmap & Schedules state & actions
  roadmapPlan: RoadmapPlan | null;
  dailySchedules: DailySchedule[];
  createRoadmap: (
    startDate: string,
    playbackSpeed: number,
    dailyTimeBudget: number,
    activeDays: number[]
  ) => Promise<void>;
  completeDailySchedule: (scheduleId: string, completed: boolean) => Promise<void>;

  // Revision / Spaced Repetition state & actions
  pendingRevisions: RevisionTask[];
  loadPendingRevisions: (dateStr?: string) => Promise<void>;
  submitRevisionResult: (taskId: string, isPass: boolean) => Promise<void>;

  // Milestone alerts (e.g. confetti trigger)
  milestoneAlert: MilestoneAlert | null;
  clearMilestone: () => void;
  triggerMilestone: (type: MilestoneAlert['type'], message: string, payload?: any) => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [roadmapPlan, setRoadmapPlan] = useState<RoadmapPlan | null>(null);
  const [dailySchedules, setDailySchedules] = useState<DailySchedule[]>([]);
  const [pendingRevisions, setPendingRevisions] = useState<RevisionTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [milestoneAlert, setMilestoneAlert] = useState<MilestoneAlert | null>(null);
  const [hasAutoSelected, setHasAutoSelected] = useState<boolean>(false);

  const isCloud = isCloudMode();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const profile = await dbClient.signIn(email, password);
      setUserProfile(profile);
      if (profile) {
        const list = await dbClient.getPlaylists(profile.id);
        setPlaylists(list);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const profile = await dbClient.signUp(email, password);
      setUserProfile(profile);
      if (profile) {
        const list = await dbClient.getPlaylists(profile.id);
        setPlaylists(list);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await dbClient.signOut();
      setUserProfile(null);
      setPlaylists([]);
      setActivePlaylist(null);
      setTopics([]);
      setVideos([]);
      setRoadmapPlan(null);
      setDailySchedules([]);
      setProgressStats(null);
      setHasAutoSelected(false);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1. Mount effect: load current authenticated session
  useEffect(() => {
    let active = true;
    const initUser = async () => {
      try {
        setIsLoading(true);
        const user = await dbClient.getCurrentUser();
        if (active) {
          setUserProfile(user);
        }
      } catch (err: any) {
        if (active) setError(err.message || 'Failed to initialize session');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    initUser();
    return () => {
      active = false;
    };
  }, []);

  // 2. Profile sync effect: runs when user logs in/registers or session is resolved
  useEffect(() => {
    if (!userProfile) return;
    let active = true;

    const syncUserPlannerData = async () => {
      try {
        setIsLoading(true);
        let list = await dbClient.getPlaylists(userProfile.id);
        if (!active) return;



        if (!active) return;
        setPlaylists(list);
      } catch (err: any) {
        if (active) setError(err.message || 'Failed to sync planner data');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    syncUserPlannerData();
    return () => {
      active = false;
    };
  }, [userProfile, activePlaylist, hasAutoSelected]);

  const refreshUserProfile = useCallback(async () => {
    try {
      setError(null);
      const user = await dbClient.getCurrentUser();
      setUserProfile(user);
      return user;
    } catch (err: any) {
      setError(err.message || 'Failed to refresh user profile');
      return null;
    }
  }, []);

  const updateUserSettings = useCallback(async (settings: Partial<UserSettings>) => {
    if (!userProfile) return;
    try {
      setError(null);
      const updatedProfile = await dbClient.updateUserProfile(userProfile.id, {
        settings: {
          ...userProfile.settings,
          ...settings,
        },
      });
      setUserProfile(updatedProfile);
    } catch (err: any) {
      setError(err.message || 'Failed to update user settings');
    }
  }, [userProfile]);

  const loadPlaylists = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const list = await dbClient.getPlaylists(userId);
      setPlaylists(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load playlists');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectPlaylist = useCallback(async (playlistId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userId = userProfile?.id || 'mock-user-id';
      const details = await dbClient.getPlaylistDetails(playlistId);
      setActivePlaylist(details.playlist);
      setTopics(details.topics);
      setVideos(details.videos);

      let roadmapData = await dbClient.getRoadmapPlan(playlistId);
      if (!roadmapData && details.videos.length > 0) {
        // Auto-generate default roadmap if missing
        const todayStr = new Date().toISOString().split('T')[0];
        const generated = generateDailySchedules({
          videos: details.videos,
          startDate: todayStr,
          playbackSpeed: 1.5,
          dailyTimeBudget: 45,
          activeDays: [1, 2, 3, 4, 5],
        });

        await dbClient.createRoadmapPlan(
          {
            playlistId: playlistId,
            userId: userId,
            startDate: todayStr,
            playbackSpeed: 1.5,
            dailyTimeBudget: 45,
            activeDays: [1, 2, 3, 4, 5],
          },
          generated
        );
        
        roadmapData = await dbClient.getRoadmapPlan(playlistId);
      }

      if (roadmapData) {
        setRoadmapPlan(roadmapData.plan);
        setDailySchedules(roadmapData.schedules);
      } else {
        setRoadmapPlan(null);
        setDailySchedules([]);
      }

      const stats = await dbClient.getUserProgressStats(userId, playlistId);
      setProgressStats(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to select playlist');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await dbClient.deletePlaylist(playlistId);
      
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      
      if (activePlaylist?.id === playlistId) {
        setActivePlaylist(null);
        setTopics([]);
        setVideos([]);
        setRoadmapPlan(null);
        setDailySchedules([]);
        setProgressStats(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete playlist');
    } finally {
      setIsLoading(false);
    }
  }, [activePlaylist]);

  const createPlaylist = useCallback(async (
    playlistData: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>,
    videosData: Omit<Video, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>[],
    topicsData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>[]
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const newPlaylist = await dbClient.createPlaylist(playlistData, videosData, topicsData);
      
      if (userProfile) {
        const list = await dbClient.getPlaylists(userProfile.id);
        setPlaylists(list);
      }
      return newPlaylist;
    } catch (err: any) {
      setError(err.message || 'Failed to create playlist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);

  const toggleVideoCompletion = useCallback(async (videoId: string) => {
    if (!activePlaylist) return;
    try {
      const videoToToggle = videos.find(v => v.id === videoId);
      if (!videoToToggle) return;

      const newCompleted = !videoToToggle.completed;
      const oldStreak = userProfile?.streakCount || 0;

      // Update in database
      const updatedVideo = await dbClient.updateVideoCompletion(videoId, newCompleted);

      // Update state
      setVideos(prev => prev.map(v => v.id === videoId ? updatedVideo : v));

      // Fetch updated profile (e.g. if streak count incremented)
      const updatedUser = await dbClient.getCurrentUser();
      setUserProfile(updatedUser);

      // Recalculate progress stats
      const stats = await dbClient.getUserProgressStats(
        userProfile?.id || 'mock-user-id',
        activePlaylist.id
      );
      setProgressStats(stats);

      // Check milestones if the video was completed
      if (newCompleted) {
        const allCompletedNow = videos.every(v => v.id === videoId ? true : v.completed);
        const newStreak = updatedUser?.streakCount || 0;
        const streakMilestones = [3, 5, 7, 10, 14, 30, 50, 100];
        const isStreakMilestone = newStreak > oldStreak && (streakMilestones.includes(newStreak) || (newStreak > 0 && newStreak % 10 === 0));

        let isTopicCompleted = false;
        let completedTopic: Topic | undefined;
        if (updatedVideo.topicId) {
          const topicVideos = videos.filter(v => v.topicId === updatedVideo.topicId);
          const otherTopicVideos = topicVideos.filter(v => v.id !== videoId);
          isTopicCompleted = topicVideos.length > 0 && otherTopicVideos.every(v => v.completed);
          completedTopic = topics.find(t => t.id === updatedVideo.topicId);

          if (isTopicCompleted && completedTopic) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const nextReviewDate = tomorrow.toISOString().split('T')[0];
            await dbClient.createRevisionSession({
              userId: userProfile?.id || 'mock-user-id',
              topicId: completedTopic.id,
              intervalStep: 1,
              nextReviewDate,
              status: 'pending',
            });
          }
        }

        const completedBefore = videos.filter(v => v.completed).length;

        let milestoneToAlert: MilestoneAlert | null = null;

        if (allCompletedNow && videos.length > 0) {
          milestoneToAlert = {
            type: 'playlist_completed',
            message: `Congratulations! You have completed the entire playlist: "${activePlaylist.title}"! 🏆`,
            payload: { playlist: activePlaylist }
          };
        } else if (isStreakMilestone) {
          milestoneToAlert = {
            type: 'streak_milestone',
            message: `You hit a ${newStreak}-day learning streak! You are on fire! 🔥`,
            payload: { streakCount: newStreak }
          };
        } else if (isTopicCompleted && completedTopic) {
          milestoneToAlert = {
            type: 'topic_completed',
            message: `You completed the topic: "${completedTopic.name}"! Excellent work! 🌟`,
            payload: { topic: completedTopic }
          };
        } else if (completedBefore === 0) {
          milestoneToAlert = {
            type: 'first_video',
            message: 'Congratulations on completing your first video! Keep up the momentum! 🎉',
            payload: { video: updatedVideo }
          };
        }

        if (milestoneToAlert) {
          setMilestoneAlert(milestoneToAlert);
        }
      }

      // Automatically update daily schedule completions if the video is part of schedules
      if (dailySchedules.length > 0) {
        const updatedSchedules = await Promise.all(
          dailySchedules.map(async (schedule) => {
            if (schedule.videoIds.includes(videoId)) {
              const allScheduledVideosCompleted = schedule.videoIds.every(id => {
                if (id === videoId) return newCompleted;
                const v = videos.find(vid => vid.id === id);
                return v ? v.completed : false;
              });

              if (schedule.completed !== allScheduledVideosCompleted) {
                return await dbClient.updateDailyScheduleStatus(schedule.id, allScheduledVideosCompleted);
              }
            }
            return schedule;
          })
        );
        setDailySchedules(updatedSchedules);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to toggle video completion');
    }
  }, [activePlaylist, videos, userProfile, topics, dailySchedules]);

  const logVideoProgress = useCallback(async (videoId: string, durationWatched: number) => {
    try {
      const logData = {
        userId: userProfile?.id || 'mock-user-id',
        videoId,
        watchedAt: new Date().toISOString(),
        durationWatched,
      };
      await dbClient.logProgress(logData);
    } catch (err: any) {
      setError(err.message || 'Failed to log video progress');
    }
  }, [userProfile]);

  const createRoadmap = useCallback(async (
    startDate: string,
    playbackSpeed: number,
    dailyTimeBudget: number,
    activeDays: number[]
  ) => {
    if (!activePlaylist) throw new Error('No active playlist to create roadmap for');

    try {
      setIsLoading(true);
      setError(null);

      const generated = generateDailySchedules({
        videos,
        startDate,
        playbackSpeed,
        dailyTimeBudget,
        activeDays,
      });

      const planData = {
        playlistId: activePlaylist.id,
        userId: userProfile?.id || 'mock-user-id',
        startDate,
        playbackSpeed,
        dailyTimeBudget,
        activeDays,
      };

      await dbClient.createRoadmapPlan(planData, generated);

      const roadmapData = await dbClient.getRoadmapPlan(activePlaylist.id);
      if (roadmapData) {
        setRoadmapPlan(roadmapData.plan);
        setDailySchedules(roadmapData.schedules);
      }

      const stats = await dbClient.getUserProgressStats(
        userProfile?.id || 'mock-user-id',
        activePlaylist.id
      );
      setProgressStats(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to create roadmap');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [activePlaylist, videos, userProfile]);

  const completeDailySchedule = useCallback(async (scheduleId: string, completed: boolean) => {
    try {
      const updatedSchedule = await dbClient.updateDailyScheduleStatus(scheduleId, completed);
      setDailySchedules(prev => prev.map(s => s.id === scheduleId ? updatedSchedule : s));
    } catch (err: any) {
      setError(err.message || 'Failed to update daily schedule status');
    }
  }, []);

  const loadPendingRevisions = useCallback(async (dateStr?: string) => {
    if (!userProfile) return;
    try {
      const today = dateStr || new Date().toISOString().split('T')[0];
      const tasks = await dbClient.getPendingRevisions(userProfile.id, today);
      setPendingRevisions(tasks);
    } catch (err: any) {
      setError(err.message || 'Failed to load pending revisions');
    }
  }, [userProfile]);

  const submitRevisionResult = useCallback(async (taskId: string, isPass: boolean) => {
    if (!userProfile) return;
    try {
      const task = pendingRevisions.find(t => t.id === taskId);
      if (!task) return;

      const today = new Date().toISOString().split('T')[0];
      const { nextStep, nextReviewDate } = handleRevisionResult(task.intervalStep, isPass, today);
      const status = isPass ? 'passed' : 'failed';

      await dbClient.updateRevisionSession(taskId, status, nextReviewDate, nextStep);

      setPendingRevisions(prev => prev.filter(t => t.id !== taskId));
    } catch (err: any) {
      setError(err.message || 'Failed to submit revision result');
    }
  }, [userProfile, pendingRevisions]);

  const triggerMilestone = useCallback((type: MilestoneAlert['type'], message: string, payload?: any) => {
    setMilestoneAlert({ type, message, payload });
  }, []);

  const clearMilestone = useCallback(() => {
    setMilestoneAlert(null);
  }, []);

  return (
    <PlannerContext.Provider
      value={{
        userProfile,
        refreshUserProfile,
        updateUserSettings,
        playlists,
        activePlaylist,
        topics,
        videos,
        progressStats,
        isLoading,
        error,
        loadPlaylists,
        selectPlaylist,
        deletePlaylist,
        createPlaylist,
        toggleVideoCompletion,
        logVideoProgress,
        roadmapPlan,
        dailySchedules,
        createRoadmap,
        completeDailySchedule,
        pendingRevisions,
        loadPendingRevisions,
        submitRevisionResult,
        milestoneAlert,
        clearMilestone,
        triggerMilestone,
        signIn,
        signUp,
        signOut,
        isCloud,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}
