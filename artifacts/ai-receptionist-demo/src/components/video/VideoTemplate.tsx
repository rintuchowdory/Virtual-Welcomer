import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Greeting } from './video_scenes/Greeting';
import { Listening } from './video_scenes/Listening';
import { Services } from './video_scenes/Services';
import { Simultaneous } from './video_scenes/Simultaneous';
import { Multilingual } from './video_scenes/Multilingual';
import { Handoff } from './video_scenes/Handoff';
import { Booking } from './video_scenes/Booking';
import { Outro } from './video_scenes/Outro';

import { CTA } from './video_scenes/CTA';

export const SCENE_DURATIONS = {
  greeting: 3500,
  listening: 4500,
  services: 4500,
  simultaneous: 4500,
  multilingual: 4500,
  handoff: 4000,
  booking: 4000,
  outro: 3500,
  cta: 4000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  greeting: Greeting,
  listening: Listening,
  services: Services,
  simultaneous: Simultaneous,
  multilingual: Multilingual,
  handoff: Handoff,
  booking: Booking,
  outro: Outro,
  cta: CTA,
};

const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let cumulativeMs = 0;
  for (const [key, ms] of Object.entries(SCENE_DURATIONS)) {
    out[key] = cumulativeMs / 1000;
    cumulativeMs += ms;
  }
  return out;
})();

const AUDIO_SEEK_EPSILON_SEC = 0.18;

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
      audio.currentTime = targetTime;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0A0A0B]">
      {/* Persistent background layer */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg.png)` }}
          animate={{
            scale: [1.1, 1.15, 1.05, 1.1, 1.05, 1.2, 1.15, 1.1, 1.15][sceneIndex] ?? 1.1,
            opacity: [0.3, 0.4, 0.2, 0.35, 0.25, 0.3, 0.45, 0.2, 0.4][sceneIndex] ?? 0.3,
          }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
        <motion.div className="absolute w-[80vw] h-[80vw] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
          animate={{
            x: (['-20%', '30%', '10%', '40%', '-10%', '25%', '20%', '-20%', '15%'][sceneIndex] ?? '-20%'),
            y: (['10%', '-20%', '30%', '10%', '0%', '-25%', '-15%', '10%', '-10%'][sceneIndex] ?? '10%'),
            scale: [1, 1.2, 0.9, 1.1, 0.95, 1.05, 1.15, 1, 1.1][sceneIndex] ?? 1,
          }}
          transition={{ duration: 4, ease: 'easeInOut' }} />
        <motion.div className="absolute w-[60vw] h-[60vw] rounded-full opacity-15 blur-[100px] right-0 bottom-0"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
          animate={{
            x: (['20%', '-10%', '-30%', '10%', '20%', '-25%', '-20%', '20%', '-15%'][sceneIndex] ?? '20%'),
            y: (['-10%', '20%', '-10%', '-30%', '10%', '30%', '25%', '-10%', '20%'][sceneIndex] ?? '-10%'),
          }}
          transition={{ duration: 5, ease: 'easeInOut' }} />
      </div>

      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </div>
  );
}
