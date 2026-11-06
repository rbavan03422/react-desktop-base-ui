import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar as RceAvatar } from 'react-chat-elements';
import { useChat } from '../ChatProvider';
import { useChatKit } from '../ChatKit';

export function SettingsPage() {
  const { Button, TextInput, Switch, Slider } = useChatKit();
  const chat = useChat();
  const navigate = useNavigate();
  const { settings } = chat;

  return (
    <div className="rd-chat__page rd-chat__settings">
      <section className="rd-chat__group" aria-label="Profile">
        <div className="rd-chat__profile">
          {chat.user && <RceAvatar src={chat.user.avatar} alt={chat.user.name} size="large" type="circle" />}
          <TextInput label="Display name" value={chat.user?.name ?? ''} onChange={(e) => chat.rename(e.target.value)} />
        </div>
      </section>
      <section className="rd-chat__group" aria-label="Messages">
        <h3 className="rd-chat__group-title">Messages</h3>
        <div className="rd-chat__row"><Switch label="Send with Enter" checked={settings.enterToSend} onCheckedChange={(v) => chat.updateSettings({ enterToSend: v })} /></div>
        <div className="rd-chat__row"><Switch label="Show read receipts" checked={settings.readReceipts} onCheckedChange={(v) => chat.updateSettings({ readReceipts: v })} /></div>
      </section>
      <section className="rd-chat__group" aria-label="Notifications">
        <h3 className="rd-chat__group-title">Notifications</h3>
        <div className="rd-chat__row"><Switch label="Show notifications" checked={settings.notifications} onCheckedChange={(v) => chat.updateSettings({ notifications: v })} /></div>
        <div className="rd-chat__row"><Switch label="Play sounds" checked={settings.sounds} onCheckedChange={(v) => chat.updateSettings({ sounds: v })} /></div>
        <div className="rd-chat__row rd-chat__row--stack">
          <span className="rd-chat__row-label">Call volume · {settings.volume}%</span>
          <Slider value={settings.volume} onValueChange={(v) => chat.updateSettings({ volume: Array.isArray(v) ? v[0] : v })} thumbLabels={['Call volume']} />
        </div>
      </section>
      <Button color="error" onClick={() => { chat.logout(); navigate('/login', { replace: true }); }}>Sign out</Button>
    </div>
  );
}
