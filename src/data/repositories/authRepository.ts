import { apiClient } from '../datasources/remote/apiClient';
import { AuthResponseDto } from '../models/AuthDto';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { endpoints } from '@/core/constants/endpoint';
import { ENV } from '@/core/constants/env';
import { mockDelay } from '../datasources/mock/mockUtils';

const toUser = (dto: AuthResponseDto): User => ({
    token: dto.data.tokens.access_token,
    refreshToken: dto.data.tokens.refresh_token,
});

const fakeUser = (): User => ({
    token: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
});

export const authRepository: IAuthRepository = {
    login: async (email: string, password: string): Promise<User> => {
        if (ENV.MOCK_API) {
            if (!email || !password) throw new Error('Invalid credentials');
            return mockDelay(fakeUser(), 600);
        }
        const response = await apiClient.post<AuthResponseDto>(endpoints.auth.login, { email, password });
        return toUser(response.data);
    },

    register: async (name: string, email: string, password: string): Promise<User> => {
        if (ENV.MOCK_API) {
            if (!name || !email || !password) throw new Error('Invalid input');
            return mockDelay(fakeUser(), 600);
        }
        const response = await apiClient.post<AuthResponseDto>(endpoints.auth.register, { name, email, password });
        return toUser(response.data);
    },

    refresh: async (refreshToken: string): Promise<User> => {
        if (ENV.MOCK_API) return mockDelay(fakeUser(), 400);
        const response = await apiClient.post<AuthResponseDto>(endpoints.auth.refresh, { refresh_token: refreshToken });
        return toUser(response.data);
    },
};
