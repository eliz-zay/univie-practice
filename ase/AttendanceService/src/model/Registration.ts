import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'registration' })
export class Registration {
    @PrimaryColumn({ name: 'attendee_id', type: 'int' })
    attendeeId: number;

    @PrimaryColumn({ name: 'event_id', type: 'int' })
    eventId: number;
}
