import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

const soundLibrary = {
  short: "/sounds/short_beep.wav",
};

const DEFAULT_SOUND = "short";

interface SoundPlayerProps {
  soundName?: keyof typeof soundLibrary;
}

export interface SoundPlayerRef {
  play: () => void;
}

const SoundPlayer: React.ForwardRefRenderFunction<
  SoundPlayerRef,
  SoundPlayerProps
> = ({ soundName }, ref) => {
  const src =
    soundLibrary[soundName || DEFAULT_SOUND] || soundLibrary[DEFAULT_SOUND];
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = () => {
    console.log("playing");
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // Expose play function to parent component
  useImperativeHandle(ref, () => ({
    play: play,
  }));

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = src;
      audio.load();
    }
  }, [src]);

  return <audio ref={audioRef} />;
};

export default forwardRef(SoundPlayer);
