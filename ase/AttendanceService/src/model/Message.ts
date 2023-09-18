import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'message' })
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'event_id', type: 'int' })
    eventId: number;

    @Column({ name: 'sender_id', type: 'int' })
    senderId: number;

    @Column({ name: 'text', type: 'varchar' })
    text: string;
}