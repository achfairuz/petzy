import { IAppointmentRepository } from '@/domain/repositories/IAppointmentRepository';
import { Appointment } from '@/domain/entities/Appointment';
import { UPCOMING_APPOINTMENTS } from '../datasources/mock/seed';
import { mockDelay, mockId } from '../datasources/mock/mockUtils';

const store: Appointment[] = [...UPCOMING_APPOINTMENTS];

export const appointmentRepository: IAppointmentRepository = {
    getAll: () => mockDelay([...store]),

    getUpcoming: () =>
        mockDelay(store.filter(a => a.status === 'upcoming')),

    getById: id => mockDelay(store.find(a => a.id === id) ?? null),

    book: input => {
        const created: Appointment = { ...input, id: mockId(), status: 'upcoming' };
        store.unshift(created);
        return mockDelay(created);
    },

    cancel: id => {
        const index = store.findIndex(a => a.id === id);
        if (index >= 0) store[index] = { ...store[index], status: 'cancelled' };
        return mockDelay(undefined as unknown as void);
    },
};
