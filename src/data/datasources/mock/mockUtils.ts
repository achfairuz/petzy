export const mockDelay = <T>(data: T, ms = 400): Promise<T> =>
    new Promise(resolve => setTimeout(() => resolve(data), ms));

export const mockId = (): string =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
