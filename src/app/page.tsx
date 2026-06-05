"use client";

import React, { useState, useEffect } from "react";
import { usePlanner } from "@/context/PlannerContext";
import { LandingHero } from "@/components/features/onboarding/LandingHero";
import { PlaylistInput } from "@/components/features/onboarding/PlaylistInput";
import { CustomizerForm } from "@/components/features/scheduler/CustomizerForm";
import { PlanPreview } from "@/components/features/scheduler/PlanPreview";
import { SidebarStats } from "@/components/features/dashboard/SidebarStats";
import { StreakFlame } from "@/components/features/dashboard/StreakFlame";
import { ChecklistFeed } from "@/components/features/dashboard/ChecklistFeed";
import { CalendarGrid } from "@/components/features/calendar/CalendarGrid";
import { TimelineList } from "@/components/features/calendar/TimelineList";
import { RevisionQueue } from "@/components/features/revision/RevisionQueue";
import { ConfettiPlayer } from "@/components/shared/ConfettiPlayer";
import { VideoEmbedModal } from "@/components/shared/VideoEmbedModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs, TabItem } from "@/components/ui/Tabs";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Sun,
  Moon,
  Trash2,
  BookOpen,
  Calendar,
  Layers,
  ArrowLeft,
  Database,
  Sparkles,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const {
    playlists,
    activePlaylist,
    topics,
    videos,
    progressStats,
    isLoading,
    error: contextError,
    selectPlaylist,
    deletePlaylist,
    createPlaylist,
    createRoadmap,
    toggleVideoCompletion,
    dailySchedules,
    pendingRevisions,
    loadPendingRevisions,
    submitRevisionResult,
    userProfile,
    signIn,
    signUp,
    signOut,
    isCloud,
  } = usePlanner();

  // Temporary state for playlist parsed but not customized yet
  const [parsedData, setParsedData] = useState<{
    playlist: any;
    videos: any[];
    topics: any[];
  } | null>(null);

  // Customization Form state
  const [startDate, setStartDate] = useState("");
  const [playbackSpeed, setPlaybackSpeed] = useState(1.5);
  const [dailyTimeBudget, setDailyTimeBudget] = useState(45);
  const [activeDays, setActiveDays] = useState<number[]>([1, 2, 3, 4, 5]); // Weekdays default
  const [creationLoading, setCreationLoading] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  // Main UI states
  const [activeTab, setActiveTab] = useState("checklist");
  const [calendarSubTab, setCalendarSubTab] = useState("grid");
  const [watchVideoId, setWatchVideoId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Authentication UI State
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword) return;
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (authMode === "signin") {
        await signIn(authEmail.trim(), authPassword);
      } else {
        await signUp(authEmail.trim(), authPassword);
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Set default startDate to today on client mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
  }, []);

  // Sync revisions when active playlist is loaded
  useEffect(() => {
    if (activePlaylist) {
      loadPendingRevisions();
    }
  }, [activePlaylist, loadPendingRevisions]);

  // Handle theme toggling
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handlePlaylistParsed = (data: any) => {
    setParsedData(data);
  };

  const handleGenerateRoadmap = async () => {
    if (!parsedData) return;
    setCreationLoading(true);
    setCreationError(null);

    try {
      // 1. Create playlist + topics + videos
      const newPlaylist = await createPlaylist(
        parsedData.playlist,
        parsedData.videos,
        parsedData.topics
      );

      // 2. Select it as active
      await selectPlaylist(newPlaylist.id);

      // 3. Generate schedule
      await createRoadmap(startDate, playbackSpeed, dailyTimeBudget, activeDays);

      // 4. Reset customization screen
      setParsedData(null);
      setActiveTab("checklist");
    } catch (err: any) {
      setCreationError(err.message || "Failed to generate study roadmap plan.");
    } finally {
      setCreationLoading(false);
    }
  };

  const handleBackToOnboarding = () => {
    setParsedData(null);
  };

  const handleResetActivePlan = () => {
    // We deselect the active plan to return to onboarding home
    selectPlaylist(""); // Deselects active playlist in state
    setParsedData(null);
  };

  // Tabs layout helper
  const dashboardTabs: TabItem[] = [
    { id: "checklist", label: "Outline Checklist" },
    { id: "calendar", label: "Study Roadmap" },
    {
      id: "revision",
      label: "Revision Queue",
      count: pendingRevisions.length,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Dynamic Header */}
      <header className="border-b border-border bg-card/40 backdrop-blur-xs sticky top-0 z-40 select-none">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="font-mono text-sm font-extrabold tracking-tight border border-primary/30 px-2.5 py-1 bg-primary/5 text-primary flex items-center gap-1.5 cursor-pointer"
              onClick={handleResetActivePlan}
            >
              <Play className="w-4 h-4 text-red-500 fill-current" />
              <span>[ytpp]</span>
            </div>
            {activePlaylist && (
              <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px] md:max-w-xs hidden sm:inline">
                / {activePlaylist.title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Database indicator badge */}
            <div className={`font-mono text-[10px] uppercase border px-2 py-0.5 select-none hidden sm:inline-block ${
              isCloud
                ? "border-blue-500/30 bg-blue-500/5 text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.1)]"
                : "border-border bg-secondary text-muted-foreground"
            }`}>
              {isCloud ? "db_cloud" : "db_local"}
            </div>

            {activePlaylist && (
              <StreakFlame streakCount={userProfile?.streakCount ?? 0} />
            )}

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-9 h-9 border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isCloud && userProfile && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 font-mono text-[10px] cursor-pointer"
                onClick={signOut}
              >
                SIGN OUT
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {isLoading && !creationLoading ? (
          <div className="h-64 flex items-center justify-center font-mono text-xs text-muted-foreground">
            <svg className="mr-2 h-4 w-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>LOADING PLANNER DATA...</span>
          </div>
        ) : !userProfile ? (
          // CLOUD AUTH CARD
          <div className="max-w-md mx-auto py-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border bg-card p-6 shadow-md space-y-6"
            >
              <div className="text-center space-y-2 select-none">
                <h2 className="text-xl font-bold font-sans uppercase">
                  {authMode === "signin" ? "Sign In to Cloud" : "Create Cloud Account"}
                </h2>
                <p className="text-xs text-muted-foreground font-mono">
                  Sync your learning roadmaps and streaks across devices
                </p>
              </div>

              {authError && (
                <div className="text-red-500 font-mono text-xs border border-red-500/20 bg-red-500/5 p-3">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={authEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={authLoading}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase block">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={authPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={authLoading}
                  />
                </div>

                <Button type="submit" loading={authLoading} className="w-full font-mono text-xs">
                  {authMode === "signin" ? "SIGN IN" : "SIGN UP"}
                </Button>
              </form>

              <div className="text-center font-mono text-xs text-muted-foreground pt-2">
                {authMode === "signin" ? (
                  <span>
                    {"Don't have an account? "}
                    <button
                      onClick={() => setAuthMode("signup")}
                      className="text-primary font-bold hover:underline cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </span>
                ) : (
                  <span>
                    {"Already have an account? "}
                    <button
                      onClick={() => setAuthMode("signin")}
                      className="text-primary font-bold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* VIEW 1: ONBOARDING / LANDING */}
            {!activePlaylist && !parsedData && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto space-y-8"
              >
                <LandingHero />

                <div className="border border-border bg-card p-6 shadow-xs space-y-4">
                  <h3 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-1">
                    Initialize Study Roadmap
                  </h3>
                  <PlaylistInput onPlaylistParsed={handlePlaylistParsed} />
                </div>


                {/* Resume Existing plans section */}
                {playlists.length > 0 && (
                  <div className="space-y-3 pt-4">
                    <div className="border-b border-border pb-2">
                      <h3 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                        Resume Active Plans ({playlists.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {playlists.map((plan) => (
                        <Card
                          key={plan.id}
                          className="border-border hover:border-primary/40 transition-colors flex justify-between items-center bg-card/30"
                        >
                          <CardContent className="p-4 flex items-center justify-between w-full gap-4">
                            <div
                              className="min-w-0 flex-1 cursor-pointer"
                              onClick={() => selectPlaylist(plan.id)}
                            >
                              <h4 className="text-sm font-semibold truncate hover:text-primary transition-colors">
                                {plan.title}
                              </h4>
                              <span className="text-[10px] font-mono text-muted-foreground block mt-1">
                                {plan.totalVideos} videos • {plan.difficultyLevel}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 p-1 border-transparent hover:border-red-500/30 hover:bg-red-500/5 text-muted-foreground hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePlaylist(plan.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW 2: PLAYLIST CUSTOMIZATION / SCHEDULER */}
            {parsedData && !activePlaylist && (
              <motion.div
                key="scheduler"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6 max-w-4xl mx-auto"
              >
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 font-mono text-[10px] gap-1 cursor-pointer"
                    onClick={handleBackToOnboarding}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>BACK</span>
                  </Button>
                  <h2 className="text-base font-bold font-sans uppercase">
                    Setup Study Parameters
                  </h2>
                </div>

                {creationError && (
                  <div className="text-red-500 font-mono text-xs border border-red-500/20 bg-red-500/5 p-3">
                    {creationError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  <div className="md:col-span-7 border border-border bg-card p-6 space-y-6">
                    <h3 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
                      1. Study Settings
                    </h3>
                    <CustomizerForm
                      startDate={startDate}
                      setStartDate={setStartDate}
                      playbackSpeed={playbackSpeed}
                      setPlaybackSpeed={setPlaybackSpeed}
                      dailyTimeBudget={dailyTimeBudget}
                      setDailyTimeBudget={setDailyTimeBudget}
                      activeDays={activeDays}
                      setActiveDays={setActiveDays}
                    />
                  </div>

                  <div className="md:col-span-5 flex flex-col justify-between">
                    <div className="flex-1">
                      <PlanPreview
                        playlist={parsedData.playlist}
                        videos={parsedData.videos}
                        topics={parsedData.topics}
                        startDate={startDate}
                        playbackSpeed={playbackSpeed}
                        dailyTimeBudget={dailyTimeBudget}
                        activeDays={activeDays}
                      />
                    </div>
                    <div className="pt-4 flex gap-3">
                      <Button
                        variant="secondary"
                        className="flex-1 font-mono text-xs"
                        onClick={handleBackToOnboarding}
                        disabled={creationLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 font-mono text-xs gap-1"
                        onClick={handleGenerateRoadmap}
                        loading={creationLoading}
                      >
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>GENERATE ROADMAP</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 3: CORE DASHBOARD */}
            {activePlaylist && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left Column Sidebar */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h2 className="text-sm font-bold font-sans text-foreground uppercase tracking-wide">
                      Dashboard Summary
                    </h2>
                    <button
                      onClick={handleResetActivePlan}
                      className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase cursor-pointer"
                    >
                      [ Exit Active Plan ]
                    </button>
                  </div>
                  <SidebarStats
                    playlist={activePlaylist}
                    videos={videos}
                    topics={topics}
                    progressStats={progressStats}
                    streakCount={userProfile?.streakCount ?? 0}
                  />
                </div>

                {/* Right Column Content */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Tab Selector */}
                  <Tabs
                    tabs={dashboardTabs}
                    activeTab={activeTab}
                    onChange={(t) => setActiveTab(t)}
                  />

                  {/* Tab Content Panels */}
                  <div className="min-h-64">
                    {activeTab === "checklist" && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <ChecklistFeed
                          playlist={activePlaylist}
                          topics={topics}
                          videos={videos}
                          dailySchedules={dailySchedules}
                          onToggleVideo={toggleVideoCompletion}
                          onWatchVideo={(vidId) => setWatchVideoId(vidId)}
                        />
                      </motion.div>
                    )}

                    {activeTab === "calendar" && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-4"
                      >
                        <div className="flex border-b border-border/60 pb-2 select-none justify-between items-center">
                          <span className="font-mono text-xs text-muted-foreground uppercase">
                            Roadmap Viewer
                          </span>
                          <div className="flex font-mono text-[10px] border border-border">
                            <button
                              onClick={() => setCalendarSubTab("grid")}
                              className={`px-3 py-1 cursor-pointer border-r border-border hover:bg-accent transition-colors ${
                                calendarSubTab === "grid"
                                  ? "bg-secondary font-bold text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              CALENDAR GRID
                            </button>
                            <button
                              onClick={() => setCalendarSubTab("timeline")}
                              className={`px-3 py-1 cursor-pointer hover:bg-accent transition-colors ${
                                calendarSubTab === "timeline"
                                  ? "bg-secondary font-bold text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              TIMELINE LIST
                            </button>
                          </div>
                        </div>

                        {calendarSubTab === "grid" ? (
                          <CalendarGrid
                            dailySchedules={dailySchedules}
                            videos={videos}
                            topics={topics}
                          />
                        ) : (
                          <TimelineList
                            dailySchedules={dailySchedules}
                            videos={videos}
                            topics={topics}
                            onToggleVideo={toggleVideoCompletion}
                            onWatchVideo={(vidId) => setWatchVideoId(vidId)}
                          />
                        )}
                      </motion.div>
                    )}

                    {activeTab === "revision" && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <RevisionQueue
                          pendingReviews={pendingRevisions}
                          videos={videos}
                          onSubmitResult={submitRevisionResult}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Shared Modals Overlay */}
      <VideoEmbedModal
        youtubeVideoId={watchVideoId}
        onClose={() => setWatchVideoId(null)}
      />
      <ConfettiPlayer />
    </div>
  );
}
