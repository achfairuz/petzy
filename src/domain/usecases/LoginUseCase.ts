import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

export const loginUseCase = (repository: IAuthRepository) =>
    (email: string, password: string): Promise<User> =>
        repository.login(email, password);
