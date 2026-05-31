import { Appointment } from '../entities/Appointment';

export interface IAppointmentRepository {
    getAll(): Promise<Appointment[]>;
    getUpcoming(): Promise<Appointment[]>;
    getById(id: string): Promise<Appointment | null>;
    book(input: Omit<Appointment, 'id' | 'status'>): Promise<Appointment>;
    cancel(id: string): Promise<void>;
}
