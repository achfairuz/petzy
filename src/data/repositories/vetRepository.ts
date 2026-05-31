import { IVetRepository } from '@/domain/repositories/IVetRepository';
import { ALL_VETS } from '../datasources/mock/seed';
import { mockDelay } from '../datasources/mock/mockUtils';

export const vetRepository: IVetRepository = {
    getAll: () => mockDelay(ALL_VETS),
    getById: id => mockDelay(ALL_VETS.find(v => v.id === id) ?? null),
};
