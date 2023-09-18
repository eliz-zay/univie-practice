import * as Yup from 'yup';

export const IdSchema = Yup.number().integer().min(1).required();

export const UserAndCountSchema = Yup.object({
    user: Yup.object({ id: IdSchema }),
    count: Yup.number().integer().min(0).default(10)
});

export const OnRegistrationSchema = Yup.object({
    eventId: IdSchema,
    attendeeId: IdSchema
});

export const OnFeedbackSchema = Yup.object({
    eventId: IdSchema,
    overallRating: Yup.number().required()
});

export type UserAndCountReq = Yup.InferType<typeof UserAndCountSchema>;
export type OnRegistrationReq = Yup.InferType<typeof OnRegistrationSchema>;
export type OnFeedbackReq = Yup.InferType<typeof OnFeedbackSchema>;

export class EventSchema {
    id: number;

    organizerId: number;

    title: string;
}

export class ReportItemSchema {
    event: EventSchema;

    feedbackCount: number;

    feedbackRating: number;

    attendeeCount: number;
}
