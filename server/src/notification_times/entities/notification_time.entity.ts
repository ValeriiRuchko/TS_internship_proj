import { Notification } from 'src/notifications/entities/notifications.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notification_times' })
export class NotificationTime {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('time')
  time: string;

  @ManyToOne(() => Notification, (notif) => notif.notificationTimes)
  notification: Notification;
}
