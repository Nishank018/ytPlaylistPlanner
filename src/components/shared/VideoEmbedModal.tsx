import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoEmbedModalProps {
  youtubeVideoId: string | null;
  onClose: () => void;
}

export const VideoEmbedModal: React.FC<VideoEmbedModalProps> = ({ youtubeVideoId, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (youtubeVideoId) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [youtubeVideoId, onClose]);

  return (
    <AnimatePresence>
      {youtubeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/95 backdrop-blur-md cursor-pointer"
          />

          {/* Video Iframe Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative z-10 w-full max-w-4xl border border-border bg-black shadow-2xl flex flex-col rounded-none overflow-hidden aspect-video"
          >
            {/* Top Close Control Panel */}
            <div className="absolute top-2 right-2 z-20">
              <button
                onClick={onClose}
                className="bg-black/80 hover:bg-neutral-800 text-white font-mono text-[10px] px-3 py-1.5 border border-border/60 hover:border-white transition-all cursor-pointer"
              >
                [ CLOSE WATCH ]
              </button>
            </div>

            {/* Embedded Iframe */}
            <div className="w-full h-full">
              <iframe
                title="YouTube Video Player"
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
