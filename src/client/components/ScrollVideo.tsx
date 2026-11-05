import { useEffect, useRef, useState } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4';

export function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasVideoFrame, setHasVideoFrame] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  const targetProgressRef = useRef(0);
  const smoothedProgressRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // Cached frame bitmaps
  const framesRef = useRef<ImageBitmap[]>([]);
  const isExtractingRef = useRef(false);

  // Track scroll position
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollable = Math.max(docHeight - winHeight, 1);
      const normalized = Math.min(Math.max(scrollY / scrollable, 0), 1);
      targetProgressRef.current = normalized;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Frame extraction & canvas rendering loop
  useEffect(() => {
    let isCancelled = false;

    const visibleVideo = videoRef.current;
    if (!visibleVideo) return;

    // Direct video seeking fallback handler
    const updateVisibleVideoSeek = (targetTime: number) => {
      if (
        visibleVideo &&
        !visibleVideo.seeking &&
        Math.abs(visibleVideo.currentTime - targetTime) > 0.04
      ) {
        try {
          visibleVideo.currentTime = targetTime;
        } catch {
          // Seeking catch
        }
      }
    };

    // Render current frame to canvas using object-cover logic
    const drawToCanvas = (source: ImageBitmap | HTMLVideoElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = canvas.clientWidth;
      const displayH = canvas.clientHeight;

      const targetCanvasW = Math.round(displayW * dpr);
      const targetCanvasH = Math.round(displayH * dpr);

      if (canvas.width !== targetCanvasW || canvas.height !== targetCanvasH) {
        canvas.width = targetCanvasW;
        canvas.height = targetCanvasH;
      }

      const sw = 'videoWidth' in source ? source.videoWidth : source.width;
      const sh = 'videoHeight' in source ? source.videoHeight : source.height;
      if (!sw || !sh) return;

      // Object-cover calculation
      const scale = Math.max(displayW / sw, displayH / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      const dx = (displayW - dw) / 2;
      const dy = (displayH - dh) / 2;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayW, displayH);
      ctx.drawImage(source, dx, dy, dw, dh);
      ctx.restore();
    };

    // Start extraction after loadeddata + 300ms yield
    const startFrameExtraction = async (duration: number) => {
      if (isExtractingRef.current || isCancelled) return;
      isExtractingRef.current = true;

      try {
        const offscreenVideo = document.createElement('video');
        offscreenVideo.crossOrigin = 'anonymous';
        offscreenVideo.src = VIDEO_URL;
        offscreenVideo.muted = true;
        offscreenVideo.playsInline = true;
        offscreenVideo.preload = 'auto';

        await new Promise((resolve, reject) => {
          offscreenVideo.onloadedmetadata = resolve;
          offscreenVideo.onerror = reject;
        });

        const totalFrames = Math.max(24, Math.min(90, Math.round(duration * 12)));
        const maxW = 960;
        const videoRatio = offscreenVideo.videoWidth / offscreenVideo.videoHeight;
        const targetW = Math.min(offscreenVideo.videoWidth || 960, maxW);
        const targetH = Math.round(targetW / (videoRatio || 1.777));

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = targetW;
        offscreenCanvas.height = targetH;
        const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
        if (!offCtx) throw new Error('No 2D context');

        const extracted: ImageBitmap[] = [];

        for (let i = 0; i < totalFrames; i++) {
          if (isCancelled) return;
          const seekTime = (i / (totalFrames - 1)) * (duration - 0.05);

          await new Promise<void>((resolve) => {
            const onSeeked = () => {
              offscreenVideo.removeEventListener('seeked', onSeeked);
              resolve();
            };
            offscreenVideo.addEventListener('seeked', onSeeked);
            offscreenVideo.currentTime = seekTime;
          });

          offCtx.drawImage(offscreenVideo, 0, 0, targetW, targetH);
          const bitmap = await createImageBitmap(offscreenCanvas);
          extracted.push(bitmap);
        }

        if (!isCancelled && extracted.length > 0) {
          framesRef.current = extracted;
          setIsCanvasReady(true);
        }
      } catch (err) {
        // If CORS or decoding prevents extraction, fallback seamlessly to video seeking
        console.warn('Frame cache fallback to direct video scrubbing:', err);
      }
    };

    const handleLoadedData = () => {
      setHasVideoFrame(true);
      const duration = visibleVideo.duration || 5;

      // Yield 300ms before starting extraction
      setTimeout(() => {
        if (!isCancelled) {
          startFrameExtraction(duration);
        }
      }, 300);
    };

    visibleVideo.addEventListener('loadeddata', handleLoadedData);
    if (visibleVideo.readyState >= 2) {
      handleLoadedData();
    }

    // Animation loop: smooth lerp progress & draw/seek
    const renderLoop = () => {
      const target = targetProgressRef.current;
      const current = smoothedProgressRef.current;
      const smoothed = current + (target - current) * 0.12;
      smoothedProgressRef.current = smoothed;

      const duration = visibleVideo.duration || 5;
      const targetTime = smoothed * Math.max(duration - 0.05, 0.1);

      if (framesRef.current.length > 0) {
        const frameIndex = Math.min(
          Math.max(Math.floor(smoothed * (framesRef.current.length - 1)), 0),
          framesRef.current.length - 1
        );
        const frame = framesRef.current[frameIndex];
        if (frame) {
          drawToCanvas(frame);
        }
      } else {
        // Canvas not yet ready with frame cache -> scrub visible video directly
        updateVisibleVideoSeek(targetTime);
      }

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isCancelled = true;
      visibleVideo.removeEventListener('loadeddata', handleLoadedData);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      framesRef.current.forEach((bitmap) => bitmap.close());
      framesRef.current = [];
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 bg-[#0a0a0a] overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Layer 1: Poster image with initial abstract luminous aura */}
      <div
        className={`absolute inset-0 bg-[#0a0a0a] transition-opacity duration-500 ${
          hasVideoFrame || isCanvasReady ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(180,140,90,0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(90,140,210,0.12),transparent_50%)]" />
      </div>

      {/* Layer 2: Real video element for fallback seeking */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isCanvasReady ? 'opacity-0' : hasVideoFrame ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Layer 3: High-performance scrubbed canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          isCanvasReady ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Subtle cinematic vignette for pristine typography contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />
    </div>
  );
}
