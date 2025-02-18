import { apiRequest } from "./queryClient";
import type { Message } from "@shared/schema";

export async function sendMessage(content: string): Promise<Message[]> {
  const res = await apiRequest("POST", "/api/messages", {
    role: "user",
    content,
  });
  return res.json();
}

export async function clearChat(): Promise<void> {
  await apiRequest("DELETE", "/api/messages");
}

export async function getChatSessions(): Promise<ChatSession[]> {
  const res = await apiRequest("GET", "/api/chat-sessions");
  return res.json();
}

export async function createChatSession(name: string): Promise<ChatSession> {
  const res = await apiRequest("POST", "/api/chat-sessions", { name });
  return res.json();
}

export async function deleteChatSession(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/chat-sessions/${id}`);
}