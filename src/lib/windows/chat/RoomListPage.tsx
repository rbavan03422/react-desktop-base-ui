import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatList } from 'react-chat-elements';
import { TextInput } from '../controls/TextInput';
import { useChat } from '../../common/chat';

export function RoomListPage() {
  const chat = useChat();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');

  const items = chat.rooms
    .filter((room) => room.title.toLowerCase().includes(query.trim().toLowerCase()))
    .map((room) => {
      const last = chat.lastMessageOf(room.id);
      return {
        id: room.id,
        avatar: room.avatar,
        alt: room.title,
        title: room.title,
        subtitle: last ? `${last.from === 'me' ? 'You: ' : ''}${last.text}` : 'No messages yet',
        date: last?.date ?? new Date(),
        unread: room.unread,
      };
    });

  return (
    <div className="rd-chat__page">
      <div className="rd-chat__search">
        <TextInput placeholder="Search" aria-label="Search conversations" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="rd-chat__list">
        {items.length === 0
          ? <p className="rd-chat__empty">No conversations match “{query}”.</p>
          : <ChatList
              className="rd-chat__chatlist"
              lazyLoadingImage=""
              dataSource={items as any}
              onClick={(item: any) => navigate(`/rooms/${item.id}`)}
            />}
      </div>
    </div>
  );
}
