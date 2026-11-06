import * as React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button as RceButton, Input as RceInput, MessageList } from 'react-chat-elements';
import { SendIcon, useChat } from '../../common/chat';

export function ChatPage() {
  const { roomId } = useParams();
  const chat = useChat();
  const room = chat.getRoom(roomId);
  const inputRef = React.useRef<any>(null);
  const listRef = React.useRef<any>(null);
  const messages = chat.messagesOf(roomId);

  React.useEffect(() => { if (roomId) chat.markRead(roomId); }, [roomId, messages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const el = listRef.current as HTMLElement | null;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  if (!room) return <Navigate to="/rooms" replace />;

  const dataSource = messages.map((m) => ({
    id: m.id,
    position: m.from === 'me' ? 'right' : 'left',
    type: m.kind === 'system' ? 'system' : 'text',
    title: m.from === 'me' || !room.group ? undefined : m.senderName,
    text: m.text,
    date: m.date,
    focus: false,
    titleColor: '',
    forwarded: false,
    replyButton: false,
    removeButton: false,
    status: chat.settings.readReceipts || m.status !== 'read' ? m.status : 'received',
    notch: true,
    retracted: false,
  }));

  const submit = () => {
    const el = inputRef.current as HTMLInputElement | HTMLTextAreaElement | null;
    if (!el || !el.value.trim()) return;
    chat.send(room.id, el.value);
    el.value = '';
    el.focus();
  };

  return (
    <div className="rd-chat__page">
      <div className="rd-chat__messages">
        <MessageList
          className="rd-chat__mlist"
          cmpRef={(ref) => { listRef.current = ref; }}
          lockable
          toBottomHeight="100%"
          dataSource={dataSource as any}
        />
      </div>
      <div className="rd-chat__typing" aria-live="polite">{chat.typing[room.id] ? `${room.group ? 'Someone' : room.peer} is typing…` : ''}</div>
      <div className="rd-chat__composer">
        <RceInput
          inputRef={(ref) => { inputRef.current = ref; }}
          placeholder="Message"
          multiline
          maxHeight={96}
          onKeyPress={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey && chat.settings.enterToSend) { e.preventDefault(); submit(); }
          }}
          rightButtons={<RceButton text="Send" title="Send message" onClick={submit} />}
        />
      </div>
    </div>
  );
}
