import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

export const registerUseCase = (repository: IAuthRepository) =>
    (name: string, email: string, password: string): Promise<User> =>
        repository.register(name, email, password);
