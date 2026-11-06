import * as React from 'react';
import { MemoryRouter, Navigate, Route, Routes, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from 'react-chat-elements';
import { ChatProvider, useChat, BackIcon, GearIcon, PhoneIcon, VideoIcon } from '../../common/chat';
import { Window } from '../layout/Window';
import { TitleBar } from '../chrome/TitleBar';
import type { Theme } from '../shared';
import { LoginPage } from './LoginPage';
import { RoomListPage } from './RoomListPage';
import { ChatPage } from './ChatPage';
import { VoiceCallPage } from './VoiceCallPage';
import { VideoCallPage } from './VideoCallPage';
import { SettingsPage } from './SettingsPage';

export interface ChatWidgetProps {
  theme?: Theme;
  width?: number | string;
  height?: number | string;
  /** Initial route of the widget's in-memory router. */
  initialPath?: string;
}

interface View { title: string; back?: string; chatId?: string; settings?: boolean }

/** Maps the current route to the titlebar title and the toolbar actions. */
function useView(): View {
  const { pathname, state } = useLocation();
  const chat = useChat();
  const room = (id?: string) => chat.getRoom(id)?.title ?? 'Chat';
  let m;
  if (matchPath('/login', pathname)) return { title: 'Chat' };
  if (matchPath('/rooms', pathname)) return { title: 'Chat', settings: true };
  if ((m = matchPath('/rooms/:roomId/voice', pathname))) return { title: `Voice call · ${room(m.params.roomId)}` };
  if ((m = matchPath('/rooms/:roomId/video', pathname))) return { title: `Video call · ${room(m.params.roomId)}` };
  if ((m = matchPath('/rooms/:roomId', pathname))) return { title: room(m.params.roomId), back: '/rooms', chatId: m.params.roomId, settings: true };
  if (matchPath('/settings', pathname)) return { title: 'Settings', back: (state as { from?: string } | null)?.from ?? '/rooms' };
  return { title: 'Chat' };
}

function Chrome() {
  const view = useView();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const showBar = !matchPath('/login', pathname);

  const back = view.back && (
    <button type="button" className="rd-chat__navbtn" aria-label="Back" title="Back" onClick={() => navigate(view.back!)}><BackIcon /></button>
  );
  const actions = (
    <div className="rd-chat__navgroup rd-chat__navgroup--end">
      {view.chatId && <button type="button" className="rd-chat__navbtn" aria-label="Voice call" title="Voice call" onClick={() => navigate(`/rooms/${view.chatId}/voice`)}><PhoneIcon /></button>}
      {view.chatId && <button type="button" className="rd-chat__navbtn" aria-label="Video call" title="Video call" onClick={() => navigate(`/rooms/${view.chatId}/video`)}><VideoIcon /></button>}
      {view.settings && <button type="button" className="rd-chat__navbtn" aria-label="Settings" title="Settings" onClick={() => navigate('/settings', { state: { from: pathname } })}><GearIcon /></button>}
    </div>
  );

  return (
    <>
      <TitleBar title="Chat" controls />
      {showBar && (
        <Navbar
          type="light"
          className="rd-chat__navbar"
          left={<div className="rd-chat__navgroup">{back}<span className="rd-chat__navtitle">{view.title}</span></div>}
          center={<span />}
          right={actions}
        />
      )}
    </>
  );
}

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user } = useChat();
  return user ? children : <Navigate to="/login" replace />;
}

function ChatRoutes() {
  const { user } = useChat();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/rooms" replace /> : <LoginPage />} />
      <Route path="/rooms" element={<RequireAuth><RoomListPage /></RequireAuth>} />
      <Route path="/rooms/:roomId" element={<RequireAuth><ChatPage /></RequireAuth>} />
      <Route path="/rooms/:roomId/voice" element={<RequireAuth><VoiceCallPage /></RequireAuth>} />
      <Route path="/rooms/:roomId/video" element={<RequireAuth><VideoCallPage /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

/**
 * Self-contained chat app: a window with a native-style titlebar and an in-memory router
 * (login, room list, chat, voice call, video call and settings pages).
 */
export function ChatWidget({ theme = 'light', width = 380, height = 640, initialPath = '/login' }: ChatWidgetProps) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <ChatProvider>
        <Window chrome background theme={theme} width={width} height={height} className="rd-win-chat">
          <Chrome />
          <div className="rd-chat__body"><ChatRoutes /></div>
        </Window>
      </ChatProvider>
    </MemoryRouter>
  );
}
