import { Med } from 'src/meds/entities/meds.entity';
import { User } from 'src/users/entities/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'images' })
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  pathToImage: string;

  @ManyToOne(() => User, (user) => user.images, { nullable: true })
  user: User;

  @ManyToOne(() => Med, (meds) => meds.images, { nullable: true })
  med: Med;
}
