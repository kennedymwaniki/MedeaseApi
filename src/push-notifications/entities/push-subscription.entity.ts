// src/push-notifications/entities/push-subscription.entity.ts
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('push_subscriptions')
@Unique(['userId', 'endpoint']) // Prevent duplicate subscriptions per user
export class PushSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column('text')
  endpoint: string;

  @Column('text')
  p256dhKey: string;

  @Column('text')
  authKey: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.pushSubscriptions)
  user: User;
}
