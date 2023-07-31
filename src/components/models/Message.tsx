export type MessageTypeString =
  | "text"
  | "image"
  | "voice_note"
  | "video"
  | "contact"
  | "location"
  | "document"
  | "gif"
  | "voice_note"
  | "voice_note"
  | "view_once_image"
  | "view_once_video"
  | "poll"
  | "unknown";

export interface DefaultMessage {
  id: number;
  from_me: boolean;
  text: string;
  timestamp: number;
  type: MessageTypeString;
}
