import * as React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Avatar as RceAvatar } from 'react-chat-elements';
import { HangUpIcon, MicIcon, MicOffIcon, SpeakerIcon, VideoIcon, useCallTimer, useChat, useLocalMedia } from '../../common/chat';

export function VoiceCallPage() {
  const { roomId } = useParams();
  const chat = useChat();
  const navigate = useNavigate();
  const room = chat.getRoom(roomId);
  const media = useLocalMedia(false);
  const [connected, setConnected] = React.useState(false);
  const [speaker, setSpeaker] = React.useState(true);
  const timer = useCallTimer(connected);

  React.useEffect(() => {
    const id = window.setTimeout(() => setConnected(true), 1800);
    return () => window.clearTimeout(id);
  }, []);

  if (!room) return <Navigate to="/rooms" replace />;

  const hangUp = () => {
    chat.addSystemMessage(room.id, connected ? `Voice call · ${timer.label}` : 'Voice call · cancelled');
    navigate(`/rooms/${room.id}`, { replace: true });
  };

  return (
    <div className="rd-chat__page rd-chat__call">
      <div className="rd-chat__call-main">
        <div className={'rd-chat__pulse' + (connected ? ' rd-chat__pulse--on' : '')}>
          <RceAvatar src={room.avatar} alt={room.peer} size="xlarge" type="circle" />
        </div>
        <h2 className="rd-chat__call-name">{room.peer}</h2>
        <p className="rd-chat__call-status" aria-live="polite">{connected ? timer.label : 'Calling…'}</p>
        {media.error && <p className="rd-chat__call-note">Microphone unavailable: {media.error}</p>}
      </div>
      <div className="rd-chat__call-controls">
        <div className="rd-chat__roundwrap">
          <button type="button" className="rd-chat__round" aria-pressed={media.muted} aria-label={media.muted ? 'Unmute' : 'Mute'} onClick={() => media.setMuted(!media.muted)}>
            {media.muted ? <MicOffIcon size={22} /> : <MicIcon size={22} />}
          </button>
          <span>{media.muted ? 'Unmute' : 'Mute'}</span>
        </div>
        <div className="rd-chat__roundwrap">
          <button type="button" className="rd-chat__round" aria-pressed={speaker} aria-label="Speaker" onClick={() => setSpeaker(!speaker)}>
            <SpeakerIcon size={22} />
          </button>
          <span>Speaker</span>
        </div>
        <div className="rd-chat__roundwrap">
          <button type="button" className="rd-chat__round" aria-label="Switch to video" onClick={() => navigate(`/rooms/${room.id}/video`, { replace: true })}>
            <VideoIcon size={22} />
          </button>
          <span>Video</span>
        </div>
        <div className="rd-chat__roundwrap">
          <button type="button" className="rd-chat__round rd-chat__round--danger" aria-label="End call" onClick={hangUp}>
            <HangUpIcon size={22} />
          </button>
          <span>End</span>
        </div>
      </div>
    </div>
  );
}
