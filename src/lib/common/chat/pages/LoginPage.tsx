import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoIcon } from '../icons';
import { useChat } from '../ChatProvider';
import { useChatKit } from '../ChatKit';

export function LoginPage() {
  const { Button, TextInput } = useChatKit();
  const chat = useChat();
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (chat.login(name, password)) navigate('/rooms', { replace: true });
    else setError('Enter your name and a password to continue.');
  };

  return (
    <div className="rd-chat__page rd-chat__login">
      <div className="rd-chat__logo"><LogoIcon size={34} /></div>
      <div>
        <h1 className="rd-chat__heading">Welcome back</h1>
        <p className="rd-chat__muted">Sign in to see your conversations.</p>
      </div>
      <form className="rd-chat__form" onSubmit={submit} noValidate>
        <TextInput label="Name" placeholder="Your name" autoComplete="username" value={name} onChange={(e) => { setName(e.target.value); setError(''); }} />
        <TextInput label="Password" type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} />
        {error && <div className="rd-chat__error" role="alert">{error}</div>}
        <Button color="primary" type="submit">Sign in</Button>
      </form>
      <p className="rd-chat__hint">Demo: any name and password will do.</p>
    </div>
  );
}
