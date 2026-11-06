import * as React from 'react';

export interface LocalMedia {
  stream: MediaStream | null;
  error: string | null;
  muted: boolean;
  cameraOff: boolean;
  setMuted: (muted: boolean) => void;
  setCameraOff: (off: boolean) => void;
}

/** Opens the microphone (and camera for video calls) and releases it on unmount. Fails soft when blocked. */
export function useLocalMedia(video: boolean): LocalMedia {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [muted, setMutedState] = React.useState(false);
  const [cameraOff, setCameraOffState] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    let current: MediaStream | null = null;
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Media devices are not available in this browser.');
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true, video }).then(
      (s) => {
        if (!active) { s.getTracks().forEach((t) => t.stop()); return; }
        current = s;
        setStream(s);
      },
      (e: unknown) => { if (active) setError(e instanceof Error ? e.message : 'Permission denied.'); },
    );
    return () => {
      active = false;
      current?.getTracks().forEach((t) => t.stop());
    };
  }, [video]);

  const setMuted = React.useCallback((value: boolean) => {
    setMutedState(value);
    stream?.getAudioTracks().forEach((t) => { t.enabled = !value; });
  }, [stream]);

  const setCameraOff = React.useCallback((value: boolean) => {
    setCameraOffState(value);
    stream?.getVideoTracks().forEach((t) => { t.enabled = !value; });
  }, [stream]);

  return { stream, error, muted, cameraOff, setMuted, setCameraOff };
}

/** mm:ss counter that starts when `running` becomes true. */
export function useCallTimer(running: boolean) {
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  const label = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return { seconds, label };
}
