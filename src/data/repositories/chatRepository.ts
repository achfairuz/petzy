import { IChatRepository } from '@/domain/repositories/IChatRepository';
import { ChatMessage } from '@/domain/entities/Chat';
import { CHAT_THREADS, SEED_MESSAGES } from '../datasources/mock/seed';
import { mockDelay, mockId } from '../datasources/mock/mockUtils';

const messagesStore: Record<string, ChatMessage[]> = { ...SEED_MESSAGES };

export const chatRepository: IChatRepository = {
    getThreads: () => mockDelay(CHAT_THREADS),

    getMessages: (threadId: string) =>
        mockDelay([...(messagesStore[threadId] ?? [])]),

    sendMessage: (threadId: string, text: string) => {
        const message: ChatMessage = {
            id: mockId(),
            threadId,
            fromMe: true,
            text,
            sentAtISO: new Date().toISOString(),
        };
        messagesStore[threadId] = [...(messagesStore[threadId] ?? []), message];
        return mockDelay(message, 200);
    },
};
