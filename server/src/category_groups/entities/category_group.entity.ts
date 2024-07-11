import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'category_groups' })
export class CategoryGroup {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  name: string;

  @OneToMany(() => Category, (category) => category.categoryGroup, {
    onDelete: 'CASCADE',
  })
  categories: Category[];

  @ManyToOne(() => User, (user) => user.categoryGroups)
  user: User;
}
