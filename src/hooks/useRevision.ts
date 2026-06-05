import { useState, useEffect, useCallback } from 'react';
import { dbClient } from '@/lib/db/dbClientFactory';
import { RevisionSession, RevisionTask } from '@/lib/db/IDatabaseClient';
import { handleRevisionResult } from '@/lib/youtube/roadmapPlanning';

export function useRevision(userId: string) {
  const [pendingReviews, setPendingReviews] = useState<RevisionTask[]>([]);
  const [revisionSessions, setRevisionSessions] = useState<RevisionSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    if (!userId) {
      setPendingReviews([]);
      setRevisionSessions([]);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const today = new Date().toISOString().split('T')[0];
      const [pending, sessions] = await Promise.all([
        dbClient.getPendingRevisions(userId, today),
        dbClient.getRevisionSessions(userId),
      ]);
      setPendingReviews(pending);
      setRevisionSessions(sessions);
    } catch (err: any) {
      console.error('Error loading revisions:', err);
      setError(err.message || 'Failed to load revisions');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const submitReview = useCallback(async (sessionId: string, isPass: boolean) => {
    if (!userId) return;
    try {
      setIsLoading(true);
      setError(null);

      // Fetch the current session
      const sessions = await dbClient.getRevisionSessions(userId);
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) {
        throw new Error(`Revision session not found: ${sessionId}`);
      }

      const today = new Date().toISOString().split('T')[0];
      const { nextStep, nextReviewDate } = handleRevisionResult(
        session.intervalStep,
        isPass,
        today
      );

      const status = isPass ? 'passed' : 'failed';
      await dbClient.updateRevisionSession(sessionId, status, nextReviewDate, nextStep);

      // Trigger state reload
      await loadReviews();
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  }, [userId, loadReviews]);

  const triggerRevisionSetupForTopic = useCallback(async (targetUserId: string, topicId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if session already exists for this topic to avoid duplicate setup
      const sessions = await dbClient.getRevisionSessions(targetUserId);
      const exists = sessions.some((s) => s.topicId === topicId);
      if (exists) {
        setIsLoading(false);
        return;
      }

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextReviewDate = tomorrow.toISOString().split('T')[0];

      await dbClient.createRevisionSession({
        userId: targetUserId,
        topicId,
        intervalStep: 1,
        nextReviewDate,
        status: 'pending',
      });

      // Reload to update state
      await loadReviews();
    } catch (err: any) {
      console.error('Error setting up revision for topic:', err);
      setError(err.message || 'Failed to set up revision for topic');
    } finally {
      setIsLoading(false);
    }
  }, [loadReviews]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return {
    pendingReviews,
    revisionSessions,
    isLoading,
    error,
    loadReviews,
    submitReview,
    triggerRevisionSetupForTopic,
  };
}
