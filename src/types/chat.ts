// types/chat.ts
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content?: string;
  structured?: {
    component: string;
    props: any;
  }[];
};
