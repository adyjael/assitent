export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  /** True while an assistant message is still streaming in. */
  streaming?: boolean;
  /** True if generation failed and the message shows a retry affordance. */
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  /** Detected child age, used to auto-adapt future answers. */
  childAge: number | null;
}

export interface SuggestionCard {
  icon: string;
  title: string;
  prompt: string;
}
