export interface ChatMessage {
    id: string;
    threadId: string;
    fromMe: boolean;
    text: string;
    sentAtISO: string;
}

export interface ChatThread {
    id: string;
    name: string;
    avatarUrl: string;
    role: 'Vet' | 'Groomer' | 'Trainer' | 'Support';
    lastMessage: string;
    lastSentAtISO: string;
    unreadCount: number;
    online: boolean;
}
