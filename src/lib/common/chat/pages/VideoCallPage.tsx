import * as React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Avatar as RceAvatar } from 'react-chat-elements';
import { HangUpIcon, MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from '../icons';
import { useCallTimer, useLocalMedia } from '../useLocalMedia';
import { useChat } from '../ChatProvider';

export function VideoCallPage() {
  const { roomId } = useParams();
  const chat = useChat();
  const navigate = useNavigate();
  const room = chat.getRoom(roomId);
  const media = useLocalMedia(true);
  const localRef = React.useRef<HTMLVideoElement>(null);
  const [connected, setConnected] = React.useState(false);
  const timer = useCallTimer(connected);

  React.useEffect(() => {
    const id = window.setTimeout(() => setConnected(true), 1800);
    return () => window.clearTimeout(id);
  }, []);

  React.useEffect(() => {
    if (localRef.current) localRef.current.srcObject = media.stream;
  }, [media.stream]);

  if (!room) return <Navigate to="/rooms" replace />;

  const hangUp = () => {
    chat.addSystemMessage(room.id, connected ? `Video call · ${timer.label}` : 'Video call · cancelled');
    navigate(`/rooms/${room.id}`, { replace: true });
  };
  const showLocal = !!media.stream && !media.cameraOff;

  return (
    <div className="rd-chat__page rd-chat__video">
      <div className="rd-chat__remote">
        <RceAvatar src={room.avatar} alt={room.peer} size="xlarge" type="circle" />
        <h2 className="rd-chat__call-name">{room.peer}</h2>
        <p className="rd-chat__call-status" aria-live="polite">{connected ? timer.label : 'Connecting…'}</p>
      </div>
      <div className="rd-chat__local">
        <video ref={localRef} autoPlay muted playsInline className={showLocal ? '' : 'rd-chat__local-off'} />
        {!showLocal && <span>{media.error ? 'Camera unavailable' : media.cameraOff ? 'Camera off' : 'Starting camera…'}</span>}
      </div>
      <div className="rd-chat__call-controls rd-chat__call-controls--overlay">
        <div className="rd-chat__roundwrap">
          <button type="button" className="rd-chat__round" aria-pressed={media.muted} aria-label={media.muted ? 'Unmute' : 'Mute'} onClick={() => media.setMuted(!media.muted)}>
            {media.muted ? <MicOffIcon size={22} /> : <MicIcon size={22} />}
          </button>
        </div>
        <div className="rd-chat__roundwrap">
          <button type="button" className="rd-chat__round" aria-pressed={media.cameraOff} aria-label={media.cameraOff ? 'Turn camera on' : 'Turn camera off'} onClick={() => media.setCameraOff(!media.cameraOff)}>
            {media.cameraOff ? <VideoOffIcon size={22} /> : <VideoIcon size={22} />}
          </button>
        </div>
        <div className="rd-chat__roundwrap">
          <button type="button" className="rd-chat__round rd-chat__round--danger" aria-label="End call" onClick={hangUp}>
            <HangUpIcon size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
