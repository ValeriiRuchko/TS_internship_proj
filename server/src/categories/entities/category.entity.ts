import { CategoryGroup } from 'src/category_groups/entities/category_group.entity';
import { Med } from 'src/meds/entities/meds.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  name: string;

  @ManyToOne(() => CategoryGroup, (categoryGroup) => categoryGroup.categories, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  categoryGroup: CategoryGroup;

  @ManyToMany(() => Med, (med) => med.categories)
  meds: Med[];
}
