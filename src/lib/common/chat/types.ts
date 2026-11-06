export type MessageStatus = 'waiting' | 'sent' | 'received' | 'read';

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  /** 'me', a peer id, or 'system' for call logs and notices. */
  from: string;
  senderName?: string;
  kind: 'text' | 'system';
  text: string;
  date: Date;
  status: MessageStatus;
}

export interface ChatRoom {
  id: string;
  title: string;
  avatar: string;
  group?: boolean;
  /** How the peer is shown in call screens, e.g. "Alice Chen". */
  peer: string;
  unread: number;
}

export interface ChatSettings {
  notifications: boolean;
  sounds: boolean;
  enterToSend: boolean;
  readReceipts: boolean;
  volume: number;
}
