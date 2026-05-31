import { IAppointmentRepository } from '../repositories/IAppointmentRepository';
import { Appointment } from '../entities/Appointment';

export const getAppointmentsUseCase =
    (repo: IAppointmentRepository) => (): Promise<Appointment[]> =>
        repo.getAll();

export const getUpcomingAppointmentsUseCase =
    (repo: IAppointmentRepository) => (): Promise<Appointment[]> =>
        repo.getUpcoming();

export const getAppointmentByIdUseCase =
    (repo: IAppointmentRepository) => (id: string): Promise<Appointment | null> =>
        repo.getById(id);

export const bookAppointmentUseCase =
    (repo: IAppointmentRepository) =>
        (input: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> =>
            repo.book(input);

export const cancelAppointmentUseCase =
    (repo: IAppointmentRepository) => (id: string): Promise<void> =>
        repo.cancel(id);
