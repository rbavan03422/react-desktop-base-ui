declare module 'react-chat-elements' {
  import {
    ChangeEvent, MouseEvent, SyntheticEvent, UIEvent,
    ClipboardEvent, FocusEventHandler, FormEventHandler, KeyboardEventHandler, ReactEventHandler,
    Component, CSSProperties, ReactElement, ReactNode, Ref
  } from 'react';

  // ==================== General Types ====================
  type MessageStatus = 'waiting' | 'sent' | 'received' | 'read';
  type MessagePosition = 'left' | 'right';
  type MessageType = 'text' | 'photo' | 'file' | 'location' | 'spotify' | 'video' | 'audio';

  // ==================== AudioMessage Component ====================
  interface AudioMessageData {
    audioURL?: string;
    controlsList?: string; // e.g., "nodownload"
    [key: string]: any;    // Allow other data fields
  }

  interface AudioMessageProps {
    data?: AudioMessageData;
    text?: string;
    [key: string]: any;
  }

  class AudioMessage extends Component<AudioMessageProps> {}

  // ==================== Avatar Component ====================
  interface AvatarLetterItem {
    id: string;
    letter: string;
  }

  interface AvatarProps {
    /** Image source address */
    src?: string;
    /** Image alt description */
    alt?: string;
    /** Image size: default (25px), xsmall(30px), small(35px), medium(40px), large(45px), xlarge (55px) */
    size?: 'default' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | string;
    /** Type: default, circle, rounded (5px border radius), flexible */
    type?: 'default' | 'circle' | 'rounded' | 'flexible' | string;
    /** Custom class name (merged in the source code via classnames) */
    className?: string;
    /** If this is passed in, the letter avatar is rendered instead of the image */
    letterItem?: AvatarLetterItem;
    /** Side element, rendered on the side of the avatar */
    sideElement?: ReactNode;
    /** Lazy loading placeholder image path */
    lazyLoadingImage?: string;
    /** Image loading error callback */
    onError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
  }

  class Avatar extends Component<AvatarProps> {}

  // ==================== Button Component ====================
  interface ButtonIcon {
    /** Position of the icon relative to the text. Defaults to the left side of the text. */
    float?: 'left' | 'right';
    /** Font size of the icon (default 12) */
    size?: number;
    /** The icon element itself (e.g. a react-icons component) */
    component?: ReactNode;
  }

  interface ButtonProps {
    /** Button text */
    text?: string;
    /** Disabled state (default false) */
    disabled?: boolean;
    /** Style type, used as an extra class name (e.g. 'outlined' | 'transparent') */
    type?: string | null;
    /** Icon configuration. When set, renders text + icon. */
    icon?: ButtonIcon | null;
    /** Background color (default '#3979aa'). Also used as border color. */
    backgroundColor?: string;
    /** Text color (default 'white') */
    color?: string;
    /** Extra class name merged into the button */
    className?: string | null;
    /** Ref forwarded to the underlying <button> element */
    buttonRef?: Ref<HTMLButtonElement> | null;
    /** Native title attribute (tooltip) */
    title?: string | null;
    /** Click handler */
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  }

  class Button extends Component<ButtonProps> {}

  // ==================== ChatItem Component ====================
  interface ChatItemProps {
    /** Unique id of the chat item */
    id?: string | number;
    /** Extra class name merged into the container */
    className?: string;
    /** Avatar image url */
    avatar?: string;
    /** When true, avatar type becomes 'flexible' */
    avatarFlexible?: boolean;
    /** Letter avatar config (passed to Avatar) */
    letterItem?: AvatarLetterItem;
    /** Avatar alt text */
    alt?: string;
    /** Main title */
    title?: string;
    /** Subtitle text */
    subtitle?: string;
    /** Date used with timeago.js format() when dateString is not provided */
    date?: Date | number;
    /** Pre-formatted date string; overrides timeago formatting */
    dateString?: string;
    /** Unread count; rendered when > 0 */
    unread?: number;
    /** Click handler (called with no arguments via handleOnClick) */
    onClick?: () => void;
    /** Context menu handler */
    onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
    /** Status dot color. When set, a status span is rendered in Avatar's sideElement */
    statusColor?: string | null;
    /** 'badge' renders a filled dot; 'encircle' renders a bordered circle around avatar */
    statusColorType?: 'badge' | 'encircle';
    /** Text inside the status span */
    statusText?: ReactNode | null;
    /** Lazy loading placeholder image (passed to Avatar) */
    lazyLoadingImage?: string;
    /** Avatar load error handler (passed to Avatar.onError) */
    onAvatarError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
    /** When true, shows mute/unmute tool on hover */
    showMute?: boolean | null;
    /** Whether the chat is currently muted (controls icon shown) */
    muted?: boolean;
    /** Mute/unmute tool click handler */
    onClickMute?: (e: MouseEvent<HTMLDivElement>) => void;
    /** When true, shows video call tool on hover */
    showVideoCall?: boolean | null;
    /** Video call tool click handler */
    onClickVideoCall?: (e: MouseEvent<HTMLDivElement>) => void;
  }

  class ChatItem extends Component<ChatItemProps> {}

  // ==================== ChatList Component ====================
  interface ChatListProps {
    /** Extra class name merged into the container */
    className?: string;
    /** Array of chat items. Each object is spread onto a <ChatItem>. */
    dataSource?: ChatItemProps[];
    /** Ref forwarded to the container div */
    cmpRef?: Ref<HTMLDivElement> | null;
    /** Lazy loading placeholder image passed down to every ChatItem */
    lazyLoadingImage?: string;
    /** Click handler — receives the item, its index, and the mouse event */
    onClick?: (item: ChatItemProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    /** Context menu handler — receives the item, its index, and the mouse event */
    onContextMenu?: (item: ChatItemProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    /** Avatar error handler — receives the item, its index, and the error event */
    onAvatarError?: (item: ChatItemProps, index: number, e: SyntheticEvent<HTMLImageElement, Event>) => void;
    /** Mute tool click handler — receives the item, its index, and the mouse event */
    onClickMute?: (item: ChatItemProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    /** Video call tool click handler — receives the item, its index, and the mouse event */
    onClickVideoCall?: (item: ChatItemProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    /** Present in defaultProps but unused in render() */
    mute?: boolean | null;
  }

  class ChatList extends Component<ChatListProps> {}

  // ==================== Dropdown Component ====================
  interface DropdownItemIcon {
    /** Icon position relative to text. Defaults to left side of text. */
    float?: 'left' | 'right';
    /** Icon color */
    color?: string;
    /** Font size of the icon (default 12) */
    size?: number;
    /** Extra class name for the icon span */
    className?: string;
    /** The icon element itself */
    component?: ReactNode;
  }

  interface DropdownItem {
    /** Item label text */
    text?: string;
    /** Optional icon config; when set, renders text + icon in the item */
    icon?: DropdownItemIcon;
  }

  interface DropdownProps {
    /** Extra class name merged into the container */
    className?: string;
    /** Animation type class applied to the dropdown panel (default 'default') */
    animationType?: string;
    /** Animation position class suffix, e.g. 'nortwest' → 'rce-dropdown-open__nortwest' (default 'nortwest') */
    animationPosition?: string;
    /** Optional title rendered at the top of the dropdown list */
    title?: ReactNode;
    /** List items — either a plain string or a DropdownItem object */
    items?: Array<string | DropdownItem>;
    /** Called with the index of the selected item */
    onSelect?: (index: number) => void;
    /** Props forwarded to the internal <Button> */
    buttonProps?: ButtonProps | null;
  }

  class Dropdown extends Component<DropdownProps> {}

  // ==================== FileMessage Component ====================
  interface FileMessageStatus {
    /** When true, shows the red error icon and hides download/loading indicators */
    error?: boolean;
    /** When true, a click triggers onOpen instead of onDownload */
    download?: boolean;
    /** When true (and not downloading), the cloud download icon is hidden */
    click?: boolean;
    /** Numeric progress 0–1 for the circular loading indicator; 0 hides it */
    loading?: number;
    [key: string]: any;
  }

  interface FileMessageData {
    /** File size label rendered under the file icon */
    size?: string | number;
    /** Status flags controlling icons and click behavior */
    status?: FileMessageStatus;
    [key: string]: any;
  }

  interface FileMessageProps {
    /** Caption text rendered next to the file icon */
    text?: string;
    /** File data (size + status) */
    data?: FileMessageData;
    /**
     * Download handler. Called with the click event when
     * data.status exists, status.download is falsy.
     */
    onDownload?: (e: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Open handler. Called with the click event when
     * data.status exists, status.download is truthy.
     */
    onOpen?: (e: MouseEvent<HTMLButtonElement>) => void;
    /** Declared in defaultProps but unused in render/onClick */
    onClick?: ((e: MouseEvent<HTMLButtonElement>) => void) | null;
  }

  class FileMessage extends Component<FileMessageProps> {}

  // ==================== Input Component ====================
  /**
   * The onChange handler receives either a real React change event or a
   * fake event dispatched by the component's internal clear() method.
   * clear() passes { FAKE_EVENT: true, target: HTMLInputElement | HTMLTextAreaElement }.
   */
  interface InputChangeEvent extends ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {
    FAKE_EVENT?: boolean;
  }

  interface InputProps {
    /** Extra class name merged into the container */
    className?: string;
    /** Native input type (only applied to <input>, ignored by <textarea>) (default 'text') */
    type?: string;
    /** Placeholder text (default '') */
    placeholder?: string;
    /** Initial value (default '') */
    defaultValue?: string;
    /** Change handler. Called with a real event, or a fake event from clear(). */
    onChange?: (e: InputChangeEvent) => void;
    /** When true, renders a <textarea> instead of an <input> (default false) */
    multiline?: boolean;
    /** When multiline && autoHeight, auto-grows the textarea (default true) */
    autoHeight?: boolean;
    /** Minimum textarea height in px (default 25) */
    minHeight?: number;
    /** Maximum textarea height in px (default 200) */
    maxHeight?: number;
    /** Inline style applied to the input/textarea (default null) */
    inputStyle?: CSSProperties | null;
    /** Custom ref callback; also receives the internal input/textarea element */
    inputRef?: ((ref: HTMLInputElement | HTMLTextAreaElement | null) => void) | null;
    /** Max character length. Exceeding it truncates and calls onMaxLengthExceed. */
    maxlength?: number | null;
    /** Called when maxlength is exceeded */
    onMaxLengthExceed?: (() => void) | null;
    /** Focus the input on mount (default false) */
    autofocus?: boolean;
    /** React node rendered in the left buttons container */
    leftButtons?: ReactNode;
    /** React node rendered in the right buttons container */
    rightButtons?: ReactNode;

    // --- Native handlers forwarded to <input> / <textarea> ---
    onCopy?: ClipboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onCut?: ClipboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onPaste?: ClipboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onSelect?: ReactEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onSubmit?: FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onReset?: FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onKeyDown?: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onKeyPress?: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onKeyUp?: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  }

  /** The Input component exposes a clear() method via its instance. */
  class Input extends Component<InputProps> {
    /** Programmatically clears the value and dispatches a fake onChange event. */
    clear(): void;
    /** Internal reference to the rendered input/textarea */
    input: HTMLInputElement | HTMLTextAreaElement;
  }

  // ==================== LocationMessage Component ====================
  interface LocationMessageData {
    /** Latitude substituted into LATITUDE in the URL templates */
    latitude?: number | string;
    /** Longitude substituted into LONGITUDE in the URL templates */
    longitude?: number | string;
    /** Custom static map URL template (overrides the built-in STATIC_URL) */
    staticURL?: string;
    /** Custom map link URL template (overrides the built-in MAP_URL) */
    mapURL?: string;
    [key: string]: any;
  }

  interface LocationMessageProps {
    /** Extra class name merged into the link; adds 'rce-mbox-location-has-text' when text is set */
    className?: string;
    /** Coordinates and optional URL templates */
    data?: LocationMessageData;
    /** Caption text; when set, also adds the has-text class */
    text?: ReactNode;
    /** Full static map image URL override (skips buildURL) */
    src?: string;
    /** Full map link URL override (skips buildURL) */
    href?: string;
    /** Anchor target (default '_blank') */
    target?: string;
    /** Google Maps API key substituted into KEY in the static URL (default '') */
    apiKey?: string;
    /** Zoom level substituted into ZOOM in the URL templates (default 14) */
    zoom?: number;
    /** Marker color substituted into MARKER_COLOR in the static URL (default 'red') */
    markerColor?: string;
    /** Static map image load error handler */
    onError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
    /** Anchor click handler */
    onOpen?: (e: MouseEvent<HTMLAnchorElement>) => void;
  }

  class LocationMessage extends Component<LocationMessageProps> {}

  class MeetingItem extends Component<MeetingItemProps> {}

  // ==================== MeetingItem Component ====================
  interface MeetingAvatarConfig {
    /** Avatar image url */
    src?: string;
    /** Avatar alt text */
    alt?: string;
    /** Letter avatar config */
    letterItem?: AvatarLetterItem;
    /** Status dot color; rendered in Avatar's sideElement */
    statusColor?: string;
    /** 'encircle' renders a ring around the avatar instead of a filled dot */
    statusColorType?: 'badge' | 'encircle';
    /** Text inside the status span */
    statusText?: ReactNode;
    [key: string]: any;
  }

  interface MeetingItemProps {
    /** Unique id */
    id?: string | number;
    /** Extra class name merged into the container */
    className?: string;
    /** Subject/meeting title; truncated to subjectLimit with '...' when longer */
    subject?: string;
    /** Max characters of subject before truncation (default 60) */
    subjectLimit?: number;
    /** Container click handler */
    onClick?: ((e: MouseEvent<HTMLDivElement>) => void) | null;
    /** Container context menu handler */
    onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
    /** When true, avatar type becomes 'flexible' */
    avatarFlexible?: boolean;
    /** Fallback alt (declared in defaultProps; not directly used in render) */
    alt?: string;
    /** Title (declared in defaultProps; not directly used in render) */
    title?: string;
    /** Subtitle (declared in defaultProps; not directly used in render) */
    subtitle?: string;
    /** Date used with timeago format() when dateString is not provided */
    date?: Date | number;
    /** Pre-formatted date string; overrides timeago formatting */
    dateString?: string;
    /** Lazy loading placeholder image passed to each Avatar */
    lazyLoadingImage?: string;
    /** Max number of avatars rendered (default 5); extra count shown as '+N' */
    avatarLimit?: number;
    /** Avatars: either pre-built <Avatar> instances or config objects */
    avatars?: Array<ReactElement<AvatarProps> | MeetingAvatarConfig>;
    /** Muted state of the background audio (default true) */
    audioMuted?: boolean;
    /** Background audio source (default null) */
    audioSource?: string | null;
    /** Avatar load error handler passed to each Avatar */
    onAvatarError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
    /** Meeting button click handler */
    onMeetingClick?: (e: MouseEvent<HTMLDivElement>) => void;
    /** Share (link) icon click handler */
    onShareClick?: (e: MouseEvent<HTMLDivElement>) => void;
    /** When true, shows the close (call) button */
    closable?: boolean;
    /** Close button click handler (only rendered when closable is true) */
    onCloseClick?: (e: MouseEvent<HTMLDivElement>) => void;
  }

  class MeetingItem extends Component<MeetingItemProps> {}

  // ==================== MeetingLink Component ====================
  interface MeetingLinkProps {
    /** Meeting identifier passed to onMeetingMoreSelect */
    meetingID?: string;
    /** Link title text */
    title?: string;
    /** Called with the meetingID when the video button is clicked */
    onMeetingMoreSelect?: (meetingID: string) => void;
  }

  class MeetingLink extends Component<MeetingLinkProps> {}

  // ==================== MeetingList Component ====================
  interface MeetingListProps {
    /** Extra class name merged into the container */
    className?: string;
    /** Array of meeting items. Each object is spread onto a <MeetingItem>. */
    dataSource?: MeetingItemProps[];
    /** Ref forwarded to the container div */
    cmpRef?: Ref<HTMLDivElement> | null;
    /** Lazy loading placeholder image passed down to every MeetingItem */
    lazyLoadingImage?: string;
    /** Click handler — receives the item, its index, and the mouse event */
    onClick?: (item: MeetingItemProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    /** Context menu handler — receives item, index, and event (event.preventDefault is called first) */
    onContextMenu?: (item: MeetingItemProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    /** Avatar error handler — receives item, index, and image error event */
    onAvatarError?: (item: MeetingItemProps, index: number, e: SyntheticEvent<HTMLImageElement, Event>) => void;
    /** Meeting button handler — receives item, index, and mouse event */
    onMeetingClick?: (item: MeetingItemProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    /** Share icon handler — receives item, index, and mouse event */
    onShareClick?: (item: MeetingItemProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    /** Close button handler — receives item, index, and mouse event */
    onCloseClick?: (item: MeetingItemProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
  }

  class MeetingList extends Component<MeetingListProps> {}

  // ==================== MeetingMessage Component ====================
  /** An event avatar inside a meeting event — either an Avatar element or a config */
  interface MeetingEventAvatarConfig {
    src?: string;
    title?: string;
    [key: string]: any;
  }

  interface MeetingEventData {
    /** Event title */
    title?: string;
    /** Avatars shown for the event */
    avatars?: Array<ReactElement<AvatarProps> | MeetingEventAvatarConfig>;
    /** Max avatars to show; extra count becomes '+N' with a tooltip of remaining titles */
    avatarsLimit?: number;
    [key: string]: any;
  }

  interface MeetingRecordData {
    /** Avatar for the recorded call */
    avatar?: string;
    /** Record duration/time label */
    time?: string;
    /** Record title */
    title?: string;
    /** Who saved the record */
    savedBy?: string;
    [key: string]: any;
  }

  /** A single row in dataSource — either a message row or an event row */
  interface MeetingMessageRow {
    /** Avatar url for a normal message row (falsy → chat icon instead) */
    avatar?: string;
    /** Row title (message row) */
    title?: string;
    /** Row message text (message row) */
    message?: string;
    /** Row date used with timeago format() */
    date?: Date | number;
    /** Pre-formatted date string; overrides timeago formatting */
    dateString?: string;
    /** When set, this row is rendered as an event instead of a message */
    event?: MeetingEventData;
    /** When set (on an event row), renders the recorded-call block */
    record?: MeetingRecordData;
    [key: string]: any;
  }

  interface MeetingMessageProps {
    /** Date used with timeago format() when dateString is not provided */
    date?: Date | number;
    /** Pre-formatted date string; overrides timeago formatting (default '') */
    dateString?: string;
    /** Title text inside the body (default '') */
    title?: string;
    /** Subject text at the top; falls back to 'Unknown Meeting' */
    subject?: string;
    /** Title shown in the expanded state (default '') */
    collapseTitle?: string;
    /** Max participants listed before collapsing into ', +N' (default 3) */
    participantsLimit?: number;
    /** Participants shown in the collapsed summary; each uses .title */
    participants?: Array<{ title?: string; [key: string]: any }>;
    /** Items passed to the internal Dropdown (shown when non-empty) */
    moreItems?: Array<string | DropdownItem>;
    /** Rows rendered in the expandable content area */
    dataSource?: MeetingMessageRow[];
    /** Body click handler */
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    /** Called with (row, index, event) when a message row title is clicked */
    onMeetingTitleClick?: (row: MeetingMessageRow, index: number, e: MouseEvent<HTMLDivElement>) => void;
    /** Called with (row, index, event) when a recorded-call avatar is clicked */
    onMeetingVideoLinkClick?: (row: MeetingMessageRow, index: number, e: MouseEvent<HTMLDivElement>) => void;
    /** Passed to the internal Dropdown's onSelect — receives the selected index */
    onMeetingMoreSelect?: (index: number) => void;
    /** Declared in defaultProps but not used in render */
    avatarFlexible?: boolean;
    /** Declared in defaultProps but not passed to any Avatar in this component */
    onAvatarError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
  }

  class MeetingMessage extends Component<MeetingMessageProps> {}

  // ==================== MessageBox Component ====================
  interface MessageBoxReply {
    /** Photo url shown in the reply */
    photoURL?: string;
    /** Reply title */
    title?: string;
    /** Reply title color */
    titleColor?: string;
    /** Reply message text */
    message?: string;
    [key: string]: any;
  }

  interface MessageBoxProps {
    /** Extra class name merged into the container */
    className?: string;
    /** Message side: 'left' (default) or 'right' */
    position?: 'left' | 'right';
    /** Message type; determines which sub-component renders (default 'text') */
    type?: 'text' | 'photo' | 'file' | 'location' | 'spotify' | 'video' | 'audio' | 'meeting' | 'meetingLink' | 'system' | string;
    /** Message text (default '') */
    text?: string;
    /** Title text (default null) */
    title?: string | null;
    /** Title color (default null) */
    titleColor?: string | null;
    /** Letter avatar config passed to Avatar */
    letterItem?: AvatarLetterItem;
    /** Avatar url; when set with title, renders the title row */
    avatar?: string | null;
    /** Message date used with timeago format() */
    date?: Date | number;
    /** Pre-formatted date string; overrides timeago formatting */
    dateString?: string | null;
    /** Message data forwarded to the type-specific sub-component */
    data?: any;
    /** Show the message notch/tail (default true) */
    notch?: boolean;
    /** Whether the date is clickable/copiable (default false) */
    copiableDate?: boolean;
    /** Delivery status indicator */
    status?: 'waiting' | 'sent' | 'received' | 'read' | null;
    /** When true, renders the retracted state (block icon for text) */
    retracted?: boolean;
    /** When true, shows the forward button */
    forwarded?: boolean;
    /** When true, shows the reply button */
    replyButton?: boolean;
    /** When true, shows the remove button */
    removeButton?: boolean;
    /** Reply data; when set, renders ReplyMessage */
    reply?: MessageBoxReply | false;
    /** Highlight/focus the message; scrolls into view when it becomes true */
    focus?: boolean;

    // --- Container / body handlers ---
    /** Container click handler */
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    /** Body context menu handler */
    onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
    /** Called when focus becomes true and the message scrolls into view; receives nextProps */
    onMessageFocused?: (nextProps: MessageBoxProps) => void;

    // --- Title / action handlers ---
    /** Title row click handler */
    onTitleClick?: (e: MouseEvent<HTMLDivElement>) => void;
    /** Forward button click handler */
    onForwardClick?: (e: MouseEvent<HTMLDivElement>) => void;
    /** Reply button click handler */
    onReplyClick?: (e: MouseEvent<HTMLDivElement>) => void;
    /** Remove button click handler */
    onRemoveMessageClick?: (e: MouseEvent<HTMLDivElement>) => void;
    /** Reply message click handler (passed to ReplyMessage) */
    onReplyMessageClick?: (e: MouseEvent<HTMLDivElement>) => void;

    // --- Media handlers forwarded to sub-components ---
    /** Open handler (photo/video/location/audio) */
    onOpen?: (e: MouseEvent) => void;
    /** Download handler (photo/video/file/audio) */
    onDownload?: (e: MouseEvent) => void;
    /** Load handler (photo/video/audio) */
    onLoad?: (e: SyntheticEvent) => void;
    /** Photo/video error handler */
    onPhotoError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;

    // --- Photo/Video/Spotify sizing ---
    /** Width forwarded to photo/video/spotify */
    width?: number;
    /** Height forwarded to photo/video/spotify */
    height?: number;
    /** Spotify theme forwarded to SpotifyMessage */
    theme?: string;
    /** Spotify view forwarded to SpotifyMessage */
    view?: string;
    /** Spotify uri (falls back to text) */
    uri?: string;

    // --- Location props (forwarded to LocationMessage) ---
    /** Location target */
    target?: string;
    /** Location href override */
    href?: string;
    /** Google Maps API key */
    apiKey?: string;
    /** Location src override */
    src?: string;
    /** Map zoom level */
    zoom?: number;
    /** Marker color */
    markerColor?: string;

    // --- Meeting props ---
    /** Meeting config forwarded to MeetingMessage */
    meeting?: {
      subject?: string;
      title?: string;
      date?: Date | number;
      dateString?: string;
      collapseTitle?: string;
      participants?: Array<{ title?: string; [key: string]: any }>;
      moreItems?: Array<string | DropdownItem>;
      dataSource?: MeetingMessageRow[];
      [key: string]: any;
    };
    /** MeetingMessage body click handler */
    onMeetingMessageClick?: (e: MouseEvent<HTMLDivElement>) => void;
    /** MeetingMessage more-select handler (receives index) */
    onMeetingMoreSelect?: (index: number) => void;
    /** MeetingMessage video-link click handler (row, index, event) */
    onMeetingVideoLinkClick?: (row: MeetingMessageRow, index: number, e: MouseEvent<HTMLDivElement>) => void;
    /** MeetingMessage title click handler (row, index, event) */
    onMeetingTitleClick?: (row: MeetingMessageRow, index: number, e: MouseEvent<HTMLDivElement>) => void;

    // --- MeetingLink props ---
    /** MeetingLink meeting id */
    meetingID?: string;
    /** MeetingLink more-select handler (receives meetingID) */
    onMeetingLinkClick?: (meetingID: string) => void;

    // --- Extra render hook ---
    /** Optional render hook called before the message body */
    renderAddCmp?: (() => ReactNode) | null;
  }

  class MessageBox extends Component<MessageBoxProps> {}

  // ==================== MessageList Component ====================
  interface MessageListProps {
    /** Extra class name merged into the container */
    className?: string;
    /** Array of messages. Each object is spread onto a <MessageBox>. */
    dataSource?: MessageBoxProps[];
    /** Ref forwarded to the scrollable inner div */
    cmpRef?: ((ref: HTMLDivElement | null) => void) | null;
    /** Lock scroll position when new messages arrive (default false) */
    lockable?: boolean;
    /** Distance from bottom (px) under which auto-scroll kicks in; '100%' always scrolls (default 300) */
    toBottomHeight?: number | '100%';
    /** Show the scroll-to-bottom button (default true) */
    downButton?: boolean;
    /** Content rendered inside the scroll-to-bottom button badge */
    downButtonBadge?: ReactNode;
    /** Called when the scroll-to-bottom button is clicked */
    onDownButtonClick?: ((e: MouseEvent<HTMLDivElement>) => void) | null;
    /** Native scroll handler on the inner scrollable div */
    onScroll?: (e: UIEvent<HTMLDivElement>) => void;

    // --- MessageBox handlers, called as (item, index, event) ---
    onClick?: (item: MessageBoxProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    onTitleClick?: (item: MessageBoxProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    onForwardClick?: (item: MessageBoxProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    onReplyClick?: (item: MessageBoxProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    onReplyMessageClick?: (item: MessageBoxProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    onRemoveMessageClick?: (item: MessageBoxProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    onContextMenu?: (item: MessageBoxProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    onOpen?: (item: MessageBoxProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    onDownload?: (item: MessageBoxProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    onPhotoError?: (item: MessageBoxProps, index: number, e: SyntheticEvent<HTMLImageElement, Event>) => void;
    onMessageFocused?: (item: MessageBoxProps, index: number, e: MessageBoxProps) => void;
    onMeetingMessageClick?: (item: MessageBoxProps, index: number, e: MouseEvent<HTMLDivElement>) => void;
    onMeetingMoreSelect?: (item: MessageBoxProps, index: number, e: number) => void;
    onMeetingLinkClick?: (item: MessageBoxProps, index: number, e: string) => void;

    // --- Forwarded directly to MessageBox without the (item, index) wrapper ---
    onMeetingTitleClick?: (row: MeetingMessageRow, index: number, e: MouseEvent<HTMLDivElement>) => void;
    onMeetingVideoLinkClick?: (row: MeetingMessageRow, index: number, e: MouseEvent<HTMLDivElement>) => void;
  }

  class MessageList extends Component<MessageListProps> {}

  // ==================== Navbar Component ====================
  interface NavbarProps {
    /** Extra class name merged into the container */
    className?: string;
    /** Style type used as an extra class name, e.g. 'light' | 'dark' (default 'light') */
    type?: string;
    /** Content rendered in the left slot (default null) */
    left?: ReactNode;
    /** Content rendered in the center slot (default null) */
    center?: ReactNode;
    /** Content rendered in the right slot (default null) */
    right?: ReactNode;
  }

  class Navbar extends Component<NavbarProps> {}

  // ==================== PhotoMessage Component ====================
  interface PhotoMessageStatus {
    /** When true, shows the error overlay and hides download/loading */
    error?: boolean;
    /** When true, hides the download button (already downloaded) */
    download?: boolean;
    /** When true (and not downloading), the download button is hidden */
    click?: boolean;
    /** Numeric progress 0–1 for the circular loading indicator; 0 hides it */
    loading?: number;
    [key: string]: any;
  }

  interface PhotoMessageData {
    /** Image url */
    uri?: string;
    /** Image alt text */
    alt?: string;
    /** Container width (applied with height to size the wrapper) */
    width?: number | string;
    /** Container height (applied with width to size the wrapper) */
    height?: number | string;
    /** Status flags controlling overlays */
    status?: PhotoMessageStatus;
    [key: string]: any;
  }

  interface PhotoMessageProps {
    /** Caption text rendered below the image (default '') */
    text?: string;
    /** Photo data (uri, alt, size, status) — must be an object (default {}) */
    data?: PhotoMessageData;
    /** Download button click handler */
    onDownload?: ((e: MouseEvent<HTMLButtonElement>) => void) | null;
    /** Image click (open) handler */
    onOpen?: ((e: MouseEvent<HTMLImageElement>) => void) | null;
    /** Image load handler */
    onLoad?: ((e: SyntheticEvent<HTMLImageElement, Event>) => void) | null;
    /** Image error handler */
    onPhotoError?: ((e: SyntheticEvent<HTMLImageElement, Event>) => void) | null;
  }

  class PhotoMessage extends Component<PhotoMessageProps> {}

  // ==================== Popup Component ====================
  interface PopupProps {
    /** Extra class name merged into the wrapper */
    className?: string;
    /** Style type used as an extra class name on the wrapper */
    type?: string;
    /** When true, renders the popup; otherwise returns null (default false) */
    show?: boolean;
    /** Header text rendered next to the header buttons (default null) */
    header?: ReactNode;
    /** Content text rendered when renderContent is absent (default null) */
    text?: ReactNode;
    /** Buttons rendered in the header; only shown when header is truthy (default []) */
    headerButtons?: ButtonProps[];
    /** Buttons rendered in the footer (default []) */
    footerButtons?: ButtonProps[];
    /** Custom header renderer; overrides the default header (default null) */
    renderHeader?: (() => ReactNode) | null;
    /** Custom content renderer; overrides text (default null) */
    renderContent?: (() => ReactNode) | null;
    /** Custom footer renderer; overrides footerButtons (default null) */
    renderFooter?: (() => ReactNode) | null;
    /** Content text color applied as inline style (default '#333') */
    color?: string;
  }

  class Popup extends Component<PopupProps> {}

  // ==================== ReplyMessage Component ====================
  interface ReplyMessageProps {
    /** Thumbnail image url shown on the right (default null) */
    photoURL?: string | null;
    /** Reply owner/title text; falls back to 'Unknown' (default null) */
    title?: string | null;
    /** Border and title color; when set, adds the bordered style (default null) */
    titleColor?: string | null;
    /** Quoted message text; falls back to '...' (default null) */
    message?: string | null;
    /** Click handler on the whole reply block (default no-op) */
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  }

  class ReplyMessage extends Component<ReplyMessageProps> {}

  // ==================== SideBar Component ====================
  interface SideBarProps {
    /** Extra class name merged into the container */
    className?: string;
    /** Style type used as an extra class name, e.g. 'dark' | 'light' (default 'dark') */
    type?: string;
    /** Content rendered in the top slot (default null) */
    top?: ReactNode;
    /** Content rendered in the center slot (default null) */
    center?: ReactNode;
    /** Content rendered in the bottom slot (default null) */
    bottom?: ReactNode;
  }

  class SideBar extends Component<SideBarProps> {}

  // ==================== SpotifyMessage Component ====================
  interface SpotifyMessageProps {
    /** Spotify uri (e.g. 'spotify:track:...'); component renders null when falsy (default '') */
    uri?: string;
    /** Embed theme: 'black' (default) or other Spotify-supported themes */
    theme?: string;
    /** Embed view: 'list' (default) or other Spotify-supported views */
    view?: string;
    /** iframe width in px (default 300) */
    width?: number | string;
    /** iframe height in px (default 380) */
    height?: number | string;
  }

  class SpotifyMessage extends Component<SpotifyMessageProps> {}

  // ==================== SystemMessage Component ====================
  interface SystemMessageProps {
    /** Extra class name merged into the container */
    className?: string;
    /** System message text */
    text?: ReactNode;
  }

  class SystemMessage extends Component<SystemMessageProps> {}

  // ==================== VideoMessage Component ====================
  interface VideoMessageStatus {
    /** When true, shows the error overlay and hides download/loading */
    error?: boolean;
    /** When true, renders the <video> player instead of the thumbnail */
    download?: boolean;
    /** When true (and not downloaded), the download button is hidden */
    click?: boolean;
    /** Numeric progress 0–1 for the circular loading indicator; 0 hides it */
    loading?: number;
    [key: string]: any;
  }

  interface VideoMessageData {
    /** Thumbnail image url (shown when not downloaded) */
    uri?: string;
    /** Thumbnail alt text */
    alt?: string;
    /** Video file url (used as <source src> when downloaded) */
    videoURL?: string;
    /** Container width (applied with height to size the wrapper) */
    width?: number | string;
    /** Container height (applied with width to size the wrapper) */
    height?: number | string;
    /** Status flags controlling thumbnail/player/overlays */
    status?: VideoMessageStatus;
    [key: string]: any;
  }

  interface VideoMessageProps {
    /** Caption text rendered below the video (default '') */
    text?: string;
    /** Video data (uri, videoURL, size, status) — must be an object (default {}) */
    data?: VideoMessageData;
    /** Download button click handler */
    onDownload?: ((e: MouseEvent<HTMLButtonElement>) => void) | null;
    /** Thumbnail click (open) handler */
    onOpen?: ((e: MouseEvent<HTMLImageElement>) => void) | null;
    /** Thumbnail load handler */
    onLoad?: ((e: SyntheticEvent<HTMLImageElement, Event>) => void) | null;
    /** Thumbnail error handler */
    onPhotoError?: ((e: SyntheticEvent<HTMLImageElement, Event>) => void) | null;
  }

  class VideoMessage extends Component<VideoMessageProps> {}
}