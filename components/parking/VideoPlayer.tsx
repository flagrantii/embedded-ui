import React, { useEffect, useRef } from 'react';
import dashjs from 'dashjs';

interface VideoPlayerProps {
  src: string; // The base URL of the MPEG-DASH stream
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  autoPlay = true,
  muted = false,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const player = dashjs.MediaPlayer().create();

    player.initialize(video, src, autoPlay);
    player.setVolume(muted ? 0 : 1);

    // Cleanup the player when the component unmounts
    return () => {
      player.reset();
    };
  }, [src, autoPlay, muted]);

  return (
    <div className={`video-player-container ${className}`}>
      <video ref={videoRef} controls className="w-full h-auto" />
    </div>
  );
};

export default VideoPlayer;