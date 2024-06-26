import { Med } from 'src/meds/entities/meds.entity';
import { NotificationTime } from 'src/notification_times/entities/notification_time.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('date')
  start_date: Date;

  // string which represent one byte: 0000 0000
  // where each 1 is responsible for true/false of Notification appearence for a day.
  // first bit is ignored
  @Column('text')
  reminderDays: string;

  @Column()
  intakePillsAmount: number;

  @Column('text')
  notificationMsg: string;

  @ManyToOne(() => Med, (med) => med.notifications)
  med: Med;

  @OneToMany(
    () => NotificationTime,
    (notificationTime) => notificationTime.notification,
  )
  notificationTimes: NotificationTime[];
}
