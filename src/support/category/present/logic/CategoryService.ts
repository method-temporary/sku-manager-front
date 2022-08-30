import { autobind } from '@nara.platform/accent';
import { action, observable, runInAction } from 'mobx';
import _ from 'lodash';

import { NameValueList, NameValue } from 'shared/model';

import CategoryModel from '../../model/CategoryModel';
import CategoryCdo from '../../model/sdo/CategoryCdo';
import { SupportType } from '../../model/vo/SupportType';

import CategoryApi from '../apiclient/CategoryApi';

@autobind
class CategoryService {
  //
  static instance: CategoryService;
  categoryApi: CategoryApi;

  constructor(categoryApi: CategoryApi) {
    this.categoryApi = categoryApi;
  }

  @observable
  category: CategoryModel = new CategoryModel();

  @observable
  categories: CategoryModel[] = [];

  registerCategory(categoryCdo: CategoryCdo): Promise<string> {
    //
    return this.categoryApi.registerCategory(categoryCdo);
  }

  modifyCategory(categoryId: string, nameValueList: NameValueList): Promise<void> {
    //
    return this.categoryApi.modifyCategory(categoryId, nameValueList);
  }

  // Remove 지만 enable을 true에서 false로 바꿔주는 것을 삭제로 생각
  removeCategory(categoryId: string) {
    //
    const nameValueList = new NameValueList();
    const nameValue: NameValue = { name: 'enabled', value: 'false' };
    nameValueList.nameValues = [nameValue];

    return this.categoryApi.modifyCategory(categoryId, nameValueList);
  }

  @action
  async findAll(supportType: SupportType): Promise<CategoryModel[]> {
    //
    const categories = await this.categoryApi.findAll(supportType);

    runInAction(() => {
      const nextCategories: CategoryModel[] = [];

      categories.forEach((category) => {
        if (category.parentId === '' || category.parentId === null) {
          category.subCategories = categories
            .filter((c) => c.parentId === category.id)
            .map((c) => new CategoryModel(c));

          nextCategories.push(new CategoryModel(category));
        }
      });

      this.categories = nextCategories;
    });

    return this.categories;
  }

  // subCategory 포함
  @action
  async findAllCategory(supportType: SupportType): Promise<CategoryModel[]> {
    //
    const categories = await this.categoryApi.findAll(supportType);

    const nextCategories: CategoryModel[] = [];
    runInAction(() => {
      categories.forEach((category) => {
        nextCategories.push(new CategoryModel(category));
      });
    });

    return nextCategories;
  }

  @action
  addCategories(newCategory: CategoryModel) {
    //
    this.categories.push(newCategory);
  }

  @action
  addSubCategories(index: number, category: CategoryModel) {
    //
    const targetCategory = this.categories[index];

    if (targetCategory.subCategories) {
      targetCategory.subCategories.push(category);
    } else {
      targetCategory.subCategories = [category];
    }
  }

  @action
  removeCategories(index: number) {
    //
    this.categories.splice(index, 1);
  }

  @action
  removeSubCategories(index: number, parentIndex: number) {
    //
    const category = this.categories[parentIndex];

    const subCategories = category.subCategories;
    subCategories.splice(index, 1);

    this.categories = _.set(this.categories, `[${parentIndex}].subCategories`, subCategories);
  }

  @action
  changeCategoriesProps(index: number, name: string, value: any) {
    //
    this.categories = _.set(this.categories, `[${index}].${name}`, value);
  }

  @action
  changeCategoriesSubCategoriesProps(index: number, name: string, value: any, parentIndex: number) {
    //
    this.categories = _.set(this.categories, `[${parentIndex}].subCategories[${index}].${name}`, value);
  }

  @action
  changeCategoriesOrder(seq: number, newSeq: number) {
    //
    const category = this.categories[seq];

    this.categories.splice(seq, 1);
    this.categories.splice(newSeq, 0, category);
  }

  @action
  changeCategoriesSubCategoryOrder(seq: number, newSeq: number, parentIndex: number) {
    //
    const subCategory = this.categories[parentIndex].subCategories;
    const category = subCategory[seq];

    subCategory.splice(seq, 1);
    subCategory.splice(newSeq, 0, category);
  }

  @action
  getNewDisplayOrder(index?: number) {
    //
    let displayOrder: number = 0;

    if (index === undefined) {
      this.categories.forEach((category) => {
        if (category.displayOrder > displayOrder) displayOrder = category.displayOrder;
      });
    } else {
      const categories = this.categories[index].subCategories;

      categories.forEach((category) => {
        if (category.displayOrder > displayOrder) displayOrder = category.displayOrder;
      });
    }

    // 지금 제일 높은 displayOrder보다 1 높은 displayOrder을 넣어준다.
    return displayOrder + 1;
  }

  @observable
  mainCategories: CategoryModel[] = [];

  @observable
  subCategories: CategoryModel[] = [];

  @action
  async findMainCategories(supportType: SupportType): Promise<CategoryModel[]> {
    //
    const mainCategories = await this.categoryApi.findMainCategories(supportType);

    runInAction(() => {
      this.mainCategories = mainCategories.map((category) => new CategoryModel(category));
    });

    return this.mainCategories;
  }

  @action
  async findSubCategories(supportType: SupportType, parentId: string): Promise<CategoryModel[]> {
    //
    const subCategories = await this.categoryApi.findSubCategories(supportType, parentId);

    runInAction(() => {
      this.subCategories = subCategories.map((category) => new CategoryModel(category));
    });

    return this.subCategories;
  }

  // TODO FAQ 카테고리는 이전 api 사용으로 인한 임시 함수
  @action
  async findPrevAll(supportType: SupportType): Promise<CategoryModel[]> {
    //
    const categories = await this.categoryApi.findPrevAll(supportType);

    runInAction(() => {
      const nextCategories: CategoryModel[] = [];

      categories.forEach((category) => {
        category.subCategories = categories.filter((c) => c.parentId === category.id).map((c) => new CategoryModel(c));

        nextCategories.push(new CategoryModel(category));
      });

      this.categories = nextCategories;
    });

    return this.categories;
  }
}

export default CategoryService;
CategoryService.instance = new CategoryService(CategoryApi.instance);
