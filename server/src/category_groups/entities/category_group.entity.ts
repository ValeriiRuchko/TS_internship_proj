import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'category_groups' })
export class CategoryGroup {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  name: string;

  @OneToMany(() => Category, (category) => category.categoryGroup)
  categories: Category[];
}
