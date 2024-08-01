import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryGroup } from 'src/category_groups/entities/category_group.entity';
import { CategoryGroupsService } from 'src/category_groups/category_groups.service';
import { User } from 'src/users/entities/users.entity';

const categoryGroup = new CategoryGroup();
categoryGroup.name = 'body-parts';
categoryGroup.id = '4';

const user = new User();
user.id = '5';

categoryGroup.user = user;

const testCategoryOne = new Category();
testCategoryOne.id = '1';
testCategoryOne.name = 'vitamins';
testCategoryOne.categoryGroup = categoryGroup;

const testCategoryTwo = new Category();
testCategoryTwo.id = '2';
testCategoryTwo.name = 'painkillers';
testCategoryTwo.categoryGroup = categoryGroup;

const categoriesArray = [testCategoryOne, testCategoryTwo];

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repo: jest.Mocked<Repository<Category>>;
  let categGroupRepo: jest.Mocked<Repository<CategoryGroup>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: jest.fn().mockResolvedValue(categoriesArray),
            findOneBy: jest.fn().mockResolvedValue(testCategoryOne),
            findOne: jest.fn().mockResolvedValue(testCategoryOne),
            create: jest.fn().mockResolvedValue(testCategoryOne),
            save: jest.fn().mockResolvedValue(testCategoryOne),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
        CategoryGroupsService,
        {
          provide: getRepositoryToken(CategoryGroup),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(categoryGroup),
            findOne: jest.fn().mockResolvedValue(categoryGroup),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repo = module.get(getRepositoryToken(Category));
    categGroupRepo = module.get(getRepositoryToken(CategoryGroup));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should create a category attached to category group', async () => {
      const repoSpy = jest.spyOn(categGroupRepo, 'findOneBy');
      const category = await service.create({
        name: 'vitamins',
        categoryGroup: categoryGroup,
      });
      expect(category).toEqual(testCategoryOne);

      expect(repoSpy).toHaveBeenCalledTimes(1);
      expect(repoSpy).toHaveBeenCalledWith({ id: '4' });
    });
  });

  describe('getOne', () => {
    it('should return a category with the same id', async () => {
      const repoSpy = jest.spyOn(repo, 'findOneBy');
      const category = await service.findOne('1');
      expect(category).toEqual(testCategoryOne);
      expect(repoSpy).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('findAllInCategoryGroup', () => {
    it('should return categories related to the specified group', async () => {
      const repoSpy = jest.spyOn(repo, 'find');
      const categories = await service.findAllInCategoryGroup(
        categoryGroup,
        user.id,
      );
      expect(repoSpy).toHaveBeenCalledTimes(1);
      expect(repoSpy).toHaveBeenCalledWith({
        where: {
          categoryGroup: {
            id: '4',
            user: {
              id: '5',
            },
          },
        },
      });
      expect(categories).toEqual(categoriesArray);
    });
  });

  describe('update category', () => {
    it('should update category with specified params', async () => {
      const repoSpy = jest.spyOn(repo, 'update');
      await service.update('1', { name: 'Changed' });
      expect(repoSpy).toHaveBeenCalledTimes(1);
      expect(repoSpy).toHaveBeenCalledWith({ id: '1' }, { name: 'Changed' });
    });
  });
});
