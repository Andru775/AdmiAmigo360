"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

export default function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const frameRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const readyRef = useRef<boolean>(false);
  const primedRef = useRef<boolean>(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const titleY = useTransform(scrollYProgress, [0, 0.35], [0, -30]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.55], [1, 1, 0.48]);
  const subtitleY = useTransform(scrollYProgress, [0, 0.42], [0, -20]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.25, 0.5], [0.9, 1, 0.6]);

  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.16, 0.6]);
  const panelOpacity = useTransform(scrollYProgress, [0.06, 0.2, 0.42], [0, 1, 0.92]);
  const panelY = useTransform(scrollYProgress, [0.06, 0.2], [22, 0]);

  const titleBlur = useTransform(scrollYProgress, [0.34, 0.7], [0, 6]);
  const subtitleBlur = useTransform(scrollYProgress, [0.32, 0.7], [0, 8]);
  const titleFilter = useMotionTemplate`blur(${titleBlur}px)`;
  const subtitleFilter = useMotionTemplate`blur(${subtitleBlur}px)`;

  const progressToTime = useCallback((progress: number) => {
    const duration = durationRef.current;
    if (!duration || Number.isNaN(duration)) return 0;

    const safeEnd = Math.max(0, duration - 0.04);
    const clamped = Math.max(0, Math.min(1, progress));
    return clamped * safeEnd;
  }, []);

  const seekVideo = useCallback((nextTime: number) => {
    const v = videoRef.current;
    if (!v) return;

    v.pause();

    if (Math.abs(v.currentTime - nextTime) <= 0.008) return;
    v.currentTime = nextTime;
  }, []);

  const runSmoothSeek = useCallback(() => {
    if (!readyRef.current) {
      frameRef.current = null;
      return;
    }

    const v = videoRef.current;
    if (!v) {
      frameRef.current = null;
      return;
    }

    const target = targetTimeRef.current;
    const diff = target - v.currentTime;

    if (Math.abs(diff) <= 0.004) {
      seekVideo(target);
      frameRef.current = null;
      return;
    }

    const nextTime = v.currentTime + diff * 0.32;
    seekVideo(nextTime);
    frameRef.current = requestAnimationFrame(runSmoothSeek);
  }, [seekVideo]);

  const syncToProgress = useCallback((progress: number) => {
    if (!readyRef.current) return;

    targetTimeRef.current = progressToTime(progress);

    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(runSmoothSeek);
    }
  }, [progressToTime, runSmoothSeek]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    syncToProgress(progress);
  });

  const onVideoReady = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    if (!Number.isFinite(v.duration) || v.duration <= 0) return;

    durationRef.current = v.duration;
    readyRef.current = true;
    v.pause();
    syncToProgress(scrollYProgress.get());
  }, [scrollYProgress, syncToProgress]);

  const primeDecoder = useCallback(async () => {
    const v = videoRef.current;
    if (!v || primedRef.current) return;

    primedRef.current = true;
    try {
      await v.play();
      v.pause();
      syncToProgress(scrollYProgress.get());
    } catch {
      v.pause();
    }
  }, [scrollYProgress, syncToProgress]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const events: Array<keyof HTMLMediaElementEventMap> = [
      "loadedmetadata",
      "loadeddata",
      "durationchange",
      "canplay",
    ];

    for (const eventName of events) {
      v.addEventListener(eventName, onVideoReady);
    }

    if (v.readyState >= 1) {
      onVideoReady();
    }

    v.load();

    return () => {
      for (const eventName of events) {
        v.removeEventListener(eventName, onVideoReady);
      }

      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [onVideoReady]);

  useEffect(() => {
    const onFirstInteraction = () => {
      void primeDecoder();
      syncToProgress(scrollYProgress.get());
    };

    window.addEventListener("wheel", onFirstInteraction, { passive: true });
    window.addEventListener("touchmove", onFirstInteraction, { passive: true });
    window.addEventListener("pointerdown", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);

    return () => {
      window.removeEventListener("wheel", onFirstInteraction);
      window.removeEventListener("touchmove", onFirstInteraction);
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, [primeDecoder, scrollYProgress, syncToProgress]);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative h-[280vh] bg-black"
      aria-label="Hero cinematico"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          src="/media/hero-scrub.mp4"
          muted
          playsInline
          disablePictureInPicture
          preload="auto"
          onLoadedData={onVideoReady}
          onPlay={(event) => event.currentTarget.pause()}
          style={{ scale }}
        />

        <motion.div className="absolute inset-0" style={{ opacity: overlayOpacity }}>
          <div className="absolute inset-0 bg-black" />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_220px_rgba(0,0,0,0.78)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center justify-center px-6 text-center">
          <div className="max-w-4xl">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-200/45 bg-black/45 px-4 py-1 text-xs tracking-[0.16em] text-cyan-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Plataforma para propiedad horizontal inteligente
            </div>

            <motion.h1
              className="font-cinematic mt-7 text-5xl leading-[0.94] tracking-[0.01em] text-white sm:text-7xl md:text-8xl"
              style={{
                opacity: titleOpacity,
                y: titleY,
                filter: titleFilter,
              }}
            >
              Admi Amigo 360
              <span className="mt-4 block text-base font-medium tracking-[0.06em] text-cyan-200/90 sm:text-lg">
                Gestion inmersiva para conjuntos residenciales
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-7 max-w-2xl text-base text-white/80 sm:text-xl"
              style={{
                opacity: subtitleOpacity,
                y: subtitleY,
                filter: subtitleFilter,
              }}
            >
              Plataforma integral para administrar propiedad horizontal con decisiones basadas en
              datos, automatizacion operativa y cumplimiento normativo.
            </motion.p>

            <motion.div
              style={{ opacity: panelOpacity, y: panelY }}
              className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {[
                "Finanzas en tiempo real",
                "Pagos digitales y cartera",
                "Asambleas con votacion online",
              ].map((t) => (
                <div
                  key={t}
                  className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-sm tracking-wide text-white/90 backdrop-blur"
                >
                  {t}
                </div>
              ))}
            </motion.div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a
                href="#como-funciona"
                className="rounded-xl bg-cyan-200 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
              >
                Conocer plataforma
              </a>
              <a
                href="#demo"
                className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
              >
                Agenda una demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
