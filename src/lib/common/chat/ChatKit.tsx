import * as React from 'react';

export type ChatVariant = 'mac' | 'win';
type AnyComponent = React.ComponentType<any>;

/**
 * Everything that differs between platforms: the window chrome and the form controls.
 * Each platform's `ChatWidget` passes its own kit to the shared `ChatApp`.
 */
export interface ChatKit {
  variant: ChatVariant;
  /** Shown in the titlebar and as the room list heading. */
  appTitle: string;
  Window: AnyComponent;
  TitleBar: AnyComponent;
  Button: AnyComponent;
  TextInput: AnyComponent;
  Switch: AnyComponent;
  Slider: AnyComponent;
}

const ChatKitContext = React.createContext<ChatKit | null>(null);

export const ChatKitProvider = ChatKitContext.Provider;

export function useChatKit(): ChatKit {
  const kit = React.useContext(ChatKitContext);
  if (!kit) throw new Error('useChatKit must be used inside <ChatApp>');
  return kit;
}
