import { ChatMessage, ChatThread } from '../entities/Chat';

export interface IChatRepository {
    getThreads(): Promise<ChatThread[]>;
    getMessages(threadId: string): Promise<ChatMessage[]>;
    sendMessage(threadId: string, text: string): Promise<ChatMessage>;
}
