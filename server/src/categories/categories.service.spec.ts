import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryGroup } from 'src/category_groups/entities/category_group.entity';
import { CategoryGroupsService } from 'src/category_groups/category_groups.service';

const testCategoryOne = new Category();
testCategoryOne.id = '1';
testCategoryOne.name = 'vitamins';
const testCategoryTwo = new Category();
testCategoryOne.id = '2';
testCategoryTwo.name = 'painkillers';

const categoriesArray = [testCategoryOne, testCategoryTwo];

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repo: jest.Mocked<Repository<Category>>;
  // let smtg: jest.Mocked

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: jest.fn().mockResolvedValue(categoriesArray),
            findOneBy: jest.fn().mockResolvedValue(testCategoryOne),
            create: jest.fn().mockReturnValue(testCategoryOne),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
        CategoryGroupsService,
        {
          provide: getRepositoryToken(CategoryGroup),
          useValue: {
            // find: jest.fn().mockResolvedValue(categoriesArray),
            // findOneBy: jest.fn().mockResolvedValue(testCategoryOne),
            // create: jest.fn().mockReturnValue(testCategoryOne),
            // save: jest.fn(),
            // update: jest.fn().mockResolvedValue(true),
            // delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    // TODO: AAA pattern in testing
    // - stubs VS mocks
    // - questions about Libs for UI
    //
    // - delete abundant tests

    service = module.get<CategoriesService>(CategoriesService);
    repo = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getOne', () => {
    it('should return a category with the same id', async () => {
      const repoSpy = jest.spyOn(repo, 'findOneBy');
      const category = await service.findOne('1');
      expect(category).toEqual(testCategoryOne);
      expect(repoSpy).toHaveBeenCalledWith({ id: '1' });
    });
  });
});
