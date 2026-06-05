import React from "react";

export const LandingHero: React.FC = () => {
  return (
    <div className="text-center py-8 select-none">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans mb-4 uppercase">
        Turn YouTube Playlists into <span className="text-primary bg-primary/5 px-2 py-0.5 border border-primary/20">Roadmaps</span>
      </h1>
      <p className="max-w-xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
        Paste any YouTube playlist to automatically parse topics, set up a custom daily budget,
        generate a dynamic study calendar, and trigger spaced repetition review cards for maximum retention.
      </p>
    </div>
  );
};
