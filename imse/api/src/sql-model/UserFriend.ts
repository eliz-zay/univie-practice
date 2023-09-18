import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { User } from '@/sql-model';

@Entity()
export class UserFriend {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'initiator_id' })
  initiator: User;

  @PrimaryColumn({ name: 'initiator_id', type: 'uuid' })
  initiatorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @PrimaryColumn({ name: 'receiver_id', type: 'uuid' })
  receiverId: string;

  @Column({ name: 'is_accepted', type: 'bool' })
  isAccepted: boolean;
}
