import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'analytics' })
export class Analytics {
    @PrimaryColumn({ name: 'event_id', type: 'int' })
    eventId: number;

    @Column({ name: 'feedback_count', type: 'int' })
    feedbackCount: number;

    @Column({ name: 'feedback_rating', type: 'float' })
    feedbackRating: number;

    @Column({ name: 'attendee_count', type: 'int' })
    attendeeCount: number;
}