import { User } from '../entities/User';

export interface IAuthRepository {
    login(email: string, password: string): Promise<User>;
    register(name: string, email: string, password: string): Promise<User>;
    refresh(refreshToken: string): Promise<User>;
}
