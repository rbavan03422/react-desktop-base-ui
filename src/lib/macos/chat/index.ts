import { createElement } from 'react';
import { ChatApp } from '../../common/chat/ChatApp';
import type { ChatAppProps } from '../../common/chat/ChatApp';
import type { ChatKit } from '../../common/chat/ChatKit';
import { Window } from '../layout/Window';
import { TitleBar } from '../chrome/TitleBar';
import { Button } from '../controls/Button';
import { TextInput } from '../controls/TextInput';
import { Switch } from '../inputs/Switch';
import { Slider } from '../inputs/Slider';

import './chat.css';

export type ChatWidgetProps = Omit<ChatAppProps, 'kit'>;

const kit: ChatKit = { variant: 'mac', appTitle: 'Messages', Window, TitleBar, Button, TextInput, Switch, Slider };

export function ChatWidget(props: ChatWidgetProps) {
  return createElement(ChatApp, { kit, ...props });
}
