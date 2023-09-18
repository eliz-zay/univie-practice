import { Message } from '../model/Message';
import * as Yup from 'yup';

export const IdSchema = Yup.number().integer().min(1).required();

export const UserAndEventSchema = Yup.object({
    user: Yup.object({ id: IdSchema }),
    eventId: IdSchema
});

export const UserSchema = Yup.object({
    user: Yup.object({ id: IdSchema }),
});

export const AddMessageSchema = Yup.object({
    user: Yup.object({ id: IdSchema }),
    eventId: IdSchema,
    text: Yup.string().required(),
});

export type UserAndEventReq = Yup.InferType<typeof UserAndEventSchema>;
export type UserReq = Yup.InferType<typeof UserSchema>;
export type AddMessageReq = Yup.InferType<typeof AddMessageSchema>;

export class MessageSchema {
    id: number;
    
    eventId: number;
    
    senderId: number;

    text: string;
}

export class AttendeeSchema {
    id: number;

    username: string;

    firstname: string;

    lastname: string;

    role: string;
}

export class EventSchema {
    id: number;

    organizerId: number;

    title: string;

    capacity: number;
}

export function toMessageSchema(message: Message): MessageSchema {
    const { id, eventId, senderId, text } = message;
    return { id, eventId, senderId, text };
}