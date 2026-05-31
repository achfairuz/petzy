import { create } from 'zustand';
import { authRepository } from '../../data/repositories/authRepository';
import { loginUseCase } from '../../domain/usecases/LoginUseCase';
import { registerUseCase } from '../../domain/usecases/RegisterUseCase';
import { refreshTokenUseCase } from '../../domain/usecases/RefreshTokenUseCase';
import { User as UserProfile } from '../../domain/entities/UserProfile';

const login = loginUseCase(authRepository);
const register = registerUseCase(authRepository);
const refresh = refreshTokenUseCase(authRepository);

const DEFAULT_AVATAR = 'https://i.pravatar.cc/300?img=68';

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    user: UserProfile | null;

    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    refreshSession: () => Promise<string>;
    logout: () => void;
    setAuthenticated: (value: boolean) => void;
    updateProfile: (patch: Partial<UserProfile>) => void;
}

const makeUser = (name: string, email: string): UserProfile => ({
    id: 'me',
    name,
    email,
    avatarUrl: DEFAULT_AVATAR,
    bio: 'Pet lover & part-time treat dispenser.',
});

export const useAuthStore = create<AuthState>((set, get) => ({
    token: null,
    refreshToken: null,
    isLoading: false,
    isAuthenticated: false,
    user: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
            const session = await login(email, password);
            set({
                token: session.token,
                refreshToken: session.refreshToken,
                isAuthenticated: true,
                isLoading: false,
                user: makeUser(email.split('@')[0] || 'Friend', email),
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
            const session = await register(name, email, password);
            set({
                token: session.token,
                refreshToken: session.refreshToken,
                isAuthenticated: true,
                isLoading: false,
                user: makeUser(name, email),
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    refreshSession: async () => {
        const currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) {
            set({ token: null, refreshToken: null, isAuthenticated: false, user: null });
            throw new Error('No refresh token available');
        }
        try {
            const session = await refresh(currentRefreshToken);
            set({
                token: session.token,
                refreshToken: session.refreshToken,
                isAuthenticated: true,
            });
            return session.token;
        } catch (error) {
            set({ token: null, refreshToken: null, isAuthenticated: false, user: null });
            throw error;
        }
    },

    logout: () => {
        set({ token: null, refreshToken: null, isAuthenticated: false, user: null });
    },

    setAuthenticated: (value: boolean) => {
        set({ isAuthenticated: value });
    },

    updateProfile: (patch) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...patch } });
    },
}));
