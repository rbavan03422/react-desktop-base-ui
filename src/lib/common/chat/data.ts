import { avatarFor } from './avatars';
import type { ChatMessage, ChatRoom } from './types';

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000);

export const seedRooms: ChatRoom[] = [
  { id: 'alice', title: 'Alice Chen', peer: 'Alice Chen', avatar: avatarFor('Alice Chen'), unread: 2 },
  { id: 'design', title: 'Design Team', peer: 'Design Team', avatar: avatarFor('Design Team'), group: true, unread: 0 },
  { id: 'marcus', title: 'Marcus Lee', peer: 'Marcus Lee', avatar: avatarFor('Marcus Lee'), unread: 0 },
  { id: 'priya', title: 'Priya Patel', peer: 'Priya Patel', avatar: avatarFor('Priya Patel'), unread: 1 },
];

let n = 0;
const m = (roomId: string, from: string, senderName: string | undefined, text: string, ago: number): ChatMessage => ({
  id: `seed-${++n}`, roomId, from, senderName, kind: 'text', text, date: minutesAgo(ago), status: 'read',
});

export const seedMessages: ChatMessage[] = [
  m('alice', 'me', undefined, 'Did the new build go out?', 42),
  m('alice', 'alice', 'Alice Chen', 'Yes, 2.4 is live. Rollout is at 20% so far.', 40),
  m('alice', 'alice', 'Alice Chen', 'Can we sync later today about the dashboard?', 3),
  m('design', 'sam', 'Sam', 'Uploaded the new icon set to the shared folder.', 95),
  m('design', 'me', undefined, 'Great, the 24px variants look sharp.', 90),
  m('design', 'lena', 'Lena', 'Reviewing the spacing tokens tomorrow morning.', 61),
  m('marcus', 'marcus', 'Marcus Lee', 'Lunch on Thursday?', 1440),
  m('marcus', 'me', undefined, 'Sounds good, noon works.', 1430),
  m('priya', 'priya', 'Priya Patel', 'Sent you the contract draft.', 20),
];

export const autoReplies = [
  'Sounds good to me.',
  'Got it, thanks!',
  'Let me check and get back to you.',
  'Perfect, talk soon.',
  'Haha, nice.',
];
