import React, { useEffect, useRef, useState } from 'react';
import dashjs from 'dashjs';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
  onError?: (error: Error) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  autoPlay = true,
  muted = false,
  className = '',
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const player = dashjs.MediaPlayer().create();

    const handleCanPlay = () => setIsLoading(false);
    const handleError = (e: ErrorEvent) => {
      setHasError(true);
      setIsLoading(false);
      onError?.(e.error);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    player.initialize(video, src, autoPlay);
    player.setVolume(muted ? 0 : 1);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      player.reset();
    };
  }, [src, autoPlay, muted, onError]);

  return (
    <div className={`relative aspect-[4/3] rounded-xl overflow-hidden ${className}`}>
      <video 
        ref={videoRef}
        controls
        className="w-full h-full object-cover"
      />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <p className="text-white text-center">
            Failed to load video stream.<br />
            Please try again later.
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;