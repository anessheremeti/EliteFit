import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from 'react';

import YouTubePlayer from 'youtube-player';

export const VideoPlayer = forwardRef(function VideoPlayer(
  { src, onPlay, onPause, onEnded }, // src = YouTube videoId ose URL
  ref
) {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      play: () => {
        playerRef.current?.playVideo();
      },
      pause: () => {
        playerRef.current?.pauseVideo();
      },
    }),
    []
  );

  useEffect(() => {
    if (containerRef.current && src) {
      // Nëse src është URL, nxirr vetëm videoId nga ?v=
      const videoId = src.includes('youtube.com')
        ? new URL(src).searchParams.get('v')
        : src;

      playerRef.current = YouTubePlayer(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
        },
      });

      playerRef.current.on('ready', () => {
        console.log('VIDEO READY');
        setLoading(false);
      });

      playerRef.current.on('stateChange', (event) => {
        switch (event.data) {
          case 1: // playing
            onPlay?.();
            break;
          case 2: // paused
            onPause?.();
            break;
          case 0: // ended
            onEnded?.();
            break;
          default:
            break;
        }
      });
    }
  }, [src]);

  return (
    <div
      className="relative bg-black overflow-hidden rounded-2xl w-full border border-black/5 shadow-sm"
      style={{ aspectRatio: '16/9' }}
    >
      {src ? (
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white bg-neutral-900">
          <p className="text-sm">Nuk u gjet asnjë video për këtë ushtrim.</p>
        </div>
      )}

      {loading && src && (
        <div className="absolute inset-0 bg-black flex items-center justify-center pointer-events-none z-10">
          <div className="w-10 h-10 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});
