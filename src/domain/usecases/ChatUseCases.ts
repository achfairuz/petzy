import { IChatRepository } from '../repositories/IChatRepository';
import { ChatMessage, ChatThread } from '../entities/Chat';

export const getChatThreadsUseCase =
    (repo: IChatRepository) => (): Promise<ChatThread[]> =>
        repo.getThreads();

export const getChatMessagesUseCase =
    (repo: IChatRepository) => (threadId: string): Promise<ChatMessage[]> =>
        repo.getMessages(threadId);

export const sendChatMessageUseCase =
    (repo: IChatRepository) =>
        (threadId: string, text: string): Promise<ChatMessage> =>
            repo.sendMessage(threadId, text);
