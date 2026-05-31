import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

export const refreshTokenUseCase = (repository: IAuthRepository) =>
    (refreshToken: string): Promise<User> =>
        repository.refresh(refreshToken);
