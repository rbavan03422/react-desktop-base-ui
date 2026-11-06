import * as React from 'react';
import { avatarFor } from './avatars';
import { autoReplies, seedMessages, seedRooms } from './data';
import type { ChatMessage, ChatRoom, ChatSettings, ChatUser } from './types';

export interface ChatContextValue {
  user: ChatUser | null;
  rooms: ChatRoom[];
  settings: ChatSettings;
  typing: Record<string, boolean>;
  login: (name: string, password: string) => boolean;
  logout: () => void;
  updateSettings: (patch: Partial<ChatSettings>) => void;
  rename: (name: string) => void;
  getRoom: (roomId?: string) => ChatRoom | undefined;
  messagesOf: (roomId?: string) => ChatMessage[];
  lastMessageOf: (roomId: string) => ChatMessage | undefined;
  send: (roomId: string, text: string) => void;
  markRead: (roomId: string) => void;
  addSystemMessage: (roomId: string, text: string) => void;
}

const ChatContext = React.createContext<ChatContextValue | null>(null);

export function useChat(): ChatContextValue {
  const ctx = React.useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
}

let counter = 0;
const nextId = () => `m-${Date.now()}-${++counter}`;

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<ChatUser | null>(null);
  const [rooms, setRooms] = React.useState<ChatRoom[]>(seedRooms);
  const [messages, setMessages] = React.useState<ChatMessage[]>(seedMessages);
  const [typing, setTyping] = React.useState<Record<string, boolean>>({});
  const [settings, setSettings] = React.useState<ChatSettings>({
    notifications: true, sounds: true, enterToSend: true, readReceipts: true, volume: 70,
  });
  const timers = React.useRef<number[]>([]);
  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const login = React.useCallback((name: string, password: string) => {
    const trimmed = name.trim();
    if (!trimmed || !password) return false;
    setUser({ id: 'me', name: trimmed, avatar: avatarFor(trimmed) });
    return true;
  }, []);

  const logout = React.useCallback(() => setUser(null), []);
  const updateSettings = React.useCallback((patch: Partial<ChatSettings>) => setSettings((s) => ({ ...s, ...patch })), []);
  const rename = React.useCallback((name: string) => setUser((u) => (u ? { ...u, name, avatar: avatarFor(name || 'You') } : u)), []);

  const getRoom = React.useCallback((id?: string) => rooms.find((r) => r.id === id), [rooms]);
  const messagesOf = React.useCallback(
    (id?: string) => messages.filter((m) => m.roomId === id).sort((a, b) => a.date.getTime() - b.date.getTime()),
    [messages],
  );
  const lastMessageOf = React.useCallback(
    (id: string) => messagesOf(id).filter((m) => m.kind === 'text').slice(-1)[0],
    [messagesOf],
  );

  const markRead = React.useCallback((id: string) => {
    setRooms((rs) => rs.map((r) => (r.id === id && r.unread ? { ...r, unread: 0 } : r)));
  }, []);

  const addSystemMessage = React.useCallback((roomId: string, text: string) => {
    setMessages((ms) => [...ms, { id: nextId(), roomId, from: 'system', kind: 'system', text, date: new Date(), status: 'read' }]);
  }, []);

  const send = React.useCallback((roomId: string, text: string) => {
    const body = text.trim();
    if (!body) return;
    const id = nextId();
    setMessages((ms) => [...ms, { id, roomId, from: 'me', kind: 'text', text: body, date: new Date(), status: 'sent' }]);
    // Demo behaviour: the peer "types" for a moment, then answers and marks the message as read.
    const peer = rooms.find((r) => r.id === roomId);
    if (!peer) return;
    timers.current.push(window.setTimeout(() => setTyping((t) => ({ ...t, [roomId]: true })), 500));
    timers.current.push(window.setTimeout(() => {
      setTyping((t) => ({ ...t, [roomId]: false }));
      setMessages((ms) => [
        ...ms.map((m) => (m.id === id ? { ...m, status: 'read' as const } : m)),
        {
          id: nextId(), roomId, from: peer.id, senderName: peer.group ? 'Sam' : peer.peer, kind: 'text' as const,
          text: autoReplies[Math.floor(Math.random() * autoReplies.length)], date: new Date(), status: 'read' as const,
        },
      ]);
    }, 1800));
  }, [rooms]);

  const value = React.useMemo<ChatContextValue>(() => ({
    user, rooms, settings, typing, login, logout, updateSettings, rename, getRoom, messagesOf,
    lastMessageOf, send, markRead, addSystemMessage,
  }), [user, rooms, settings, typing, login, logout, updateSettings, rename, getRoom, messagesOf, lastMessageOf, send, markRead, addSystemMessage]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
