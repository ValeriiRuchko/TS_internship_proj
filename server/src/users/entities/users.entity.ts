import { Image } from 'src/images/entities/image.entity';
import { Med } from 'src/meds/entities/meds.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  name: string;

  @Column('text')
  surname: string;

  @Column('text')
  email: string;

  // password will be in hashed form
  @Column('text')
  password: string;

  // used for hash
  @Column('text')
  salt: string;

  @Column({ default: false })
  isPremium: boolean;

  @OneToMany(() => Med, (medication) => medication.user)
  meds: Med[];

  @OneToMany(() => Image, (img) => img.user)
  images: Image[];
}
