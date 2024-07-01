import { Category } from 'src/categories/entities/category.entity';
import { Image } from 'src/images/entities/image.entity';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
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

  @OneToMany(() => Notification, (notification) => notification.med)
  notifications: Notification[];

  @OneToMany(() => Image, (image) => image.med)
  images: Image[];

  @ManyToMany(() => Category, (category) => category.meds)
  @JoinTable()
  categories: Category[];
}
