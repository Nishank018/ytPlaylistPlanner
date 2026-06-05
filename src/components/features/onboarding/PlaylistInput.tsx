import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { parseYoutubePlaylist } from "@/lib/youtube/playlistIntelligence";
import { Playlist, Topic, Video } from "@/lib/db/IDatabaseClient";

interface PlaylistInputProps {
  onPlaylistParsed: (data: {
    playlist: Omit<Playlist, "id" | "createdAt" | "updatedAt">;
    videos: Omit<Video, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">[];
    topics: Omit<Topic, "id" | "createdAt" | "updatedAt">[];
  }) => void;
}

export const PlaylistInput: React.FC<PlaylistInputProps> = ({ onPlaylistParsed }) => {
  const [urlOrId, setUrlOrId] = useState("");
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlOrId.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const parsedData = await parseYoutubePlaylist(urlOrId.trim(), apiKey.trim() || undefined);
      onPlaylistParsed(parsedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to parse YouTube playlist. Double-check your URL/ID and API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-muted-foreground block uppercase tracking-wider">
            1. YouTube Playlist URL or ID
          </label>
          <Input
            value={urlOrId}
            onChange={(e) => setUrlOrId(e.target.value)}
            placeholder="e.g. https://www.youtube.com/playlist?list=PL..."
            disabled={loading}
            className="w-full font-sans"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-muted-foreground block uppercase tracking-wider flex justify-between items-center">
            <span>2. YouTube Data API Key</span>
            {process.env.NEXT_PUBLIC_YOUTUBE_API_KEY && (
              <span className="text-emerald-500 normal-case font-normal text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded-sm border border-emerald-500/20">
                Active Key Detected
              </span>
            )}
          </label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your YouTube Data API v3 Key..."
            disabled={loading}
            className="w-full text-xs font-mono"
            required={!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}
          />
          <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
            API key is required to query the YouTube Data API for live playlist items, video metadata, and durations.
          </p>
        </div>

        {error && (
          <div className="text-red-500 font-mono text-xs border border-red-500/20 bg-red-500/5 p-2 rounded-sm">
            Error: {error}
          </div>
        )}

        <div className="pt-2">
          <Button type="submit" loading={loading} className="w-full font-mono text-xs uppercase tracking-wider py-5">
            Ingest & Analyze Playlist
          </Button>
        </div>
      </form>
    </div>
  );
};
