import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
// import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReqWithToken } from 'src/types_&_interfaces/request.interface';
import { CategoryGroup } from 'src/category_groups/entities/category_group.entity';
import { User } from 'src/users/entities/users.entity';

const categoryGr = new CategoryGroup();
categoryGr.id = '1';
categoryGr.name = 'pills';
const user = new User();
user.id = '11';
categoryGr.user = user;

const testCategoryOne = new Category();
testCategoryOne.id = '1';
testCategoryOne.name = 'vitamins';
testCategoryOne.categoryGroup = categoryGr;
const testCategoryTwo = new Category();
testCategoryTwo.id = '2';
testCategoryTwo.name = 'painkillers';
testCategoryTwo.categoryGroup = categoryGr;

const categoriesArray = [testCategoryOne, testCategoryTwo];

const reqWithToken: ReqWithToken = {
  user: {
    sub: '11',
    isPremium: false,
  },
};

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;
  // let repo: jest.Mocked<Repository<Category>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAllInCategoryGroup: jest
              .fn()
              .mockResolvedValue([testCategoryOne, testCategoryTwo]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                ...testCategoryOne,
                id,
              }),
            ),
            create: jest
              .fn()
              .mockImplementation((category: CreateCategoryDto) =>
                Promise.resolve({ id: '1', ...category }),
              ),
            updateOne: jest
              .fn()
              .mockImplementation((category: UpdateCategoryDto) =>
                Promise.resolve({ id: '1', ...category }),
              ),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get(CategoriesService);
    // repo = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll categories in category group controller', () => {
    it('should return all categories', async () => {
      const categories = await controller.findAll(categoryGr, reqWithToken);
      const serviceSpy = jest.spyOn(service, 'findAllInCategoryGroup');

      expect(categories).toEqual(categoriesArray);
      expect(serviceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('create category controller', () => {
    it('should return created category', async () => {
      const category = await controller.create({
        name: 'vitamins',
        categoryGroup: categoryGr,
      });
      const serviceSpy = jest.spyOn(service, 'create');

      expect(category).toEqual(testCategoryOne);
      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(serviceSpy).toHaveBeenCalledWith({
        name: testCategoryOne.name,
        categoryGroup: testCategoryOne.categoryGroup,
      });
    });
  });
});
