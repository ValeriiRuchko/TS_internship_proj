import { Category } from '../../categories/entities/category.entity';
import { Image } from '../../images/entities/image.entity';
import { Notification } from '../../notifications/entities/notifications.entity';
import { User } from '../../users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'meds' })
export class Med {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column()
  pillsAmount: number;

  @Column('date')
  expirationDate: Date;

  @ManyToOne(() => User, (user) => user.meds)
  user: User;

  @OneToOne(() => Notification, (notification) => notification.med, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  notification: Notification;

  @OneToMany(() => Image, (image) => image.med, { onDelete: 'CASCADE' })
  images: Image[];

  @ManyToMany(() => Category, (category) => category.meds, { cascade: true })
  @JoinTable({ name: 'categories_to_meds' })
  categories: Category[];
}
