import _ from 'lodash';
import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import { NameValueList } from '@nara.platform/accent';
import CategoryApi from '../apiclient/CategoryApi';
import { CategoryModel } from '../../model/CategoryModel';
import { CategoryListModel } from '../../model/CategoryListModel';

@autobind
export default class CategoryService {
  //
  static instance: CategoryService;

  categoryApi: CategoryApi;

  @observable
  category: CategoryModel = new CategoryModel();

  @observable
  categories: CategoryModel[] = [];

  @observable
  newCategories: CategoryModel[] = [];

  @observable
  addNewCategories: CategoryListModel = new CategoryListModel();

  @observable
  result: string = '';

  constructor(categoryApi: CategoryApi) {
    //
    this.categoryApi = categoryApi;
  }

  registerCategories(addNewCategories: CategoryListModel) {
    //
    return this.categoryApi.registerCategories(addNewCategories);
  }

  @action
  async findCategoriesByBoardId(boardId: string) {
    //
    const categories = await this.categoryApi.findCategoriesByBoardId(boardId);
    return runInAction(() => (this.categories = categories));
  }

  modifyCategory(categoryId: string, nameValues: NameValueList) {
    //
    this.categoryApi.modifyCategory(categoryId, nameValues);
  }

  @action
  async removeCategory(categoryId: string) {
    //
    const result = await this.categoryApi.removeCategory(categoryId);
    return runInAction(() => (this.result = result));
  }

  @action
  changeCategoriesModifyProps(index: number, name: string, value: string | {}) {
    //
    this.categories = _.set(this.categories, `[${index}].${name}`, value);
  }

  @action
  changeCategoryProps(name: string, value: string | {}) {
    //
    this.category = _.set(this.category, name, value);
  }

  @action
  changeCategoriesProps(index: number, name: string, value: string | {}) {
    //
    this.newCategories = _.set(this.newCategories, `[${index}].${name}`, value);
  }

  @action
  addNewCategory() {
    //
    const addCategories = this.newCategories.concat(new CategoryModel());
    this.newCategories = addCategories;
    this.addNewCategories = _.set(this.addNewCategories, 'categoryCdoList', this.newCategories);
  }

  @action
  initNewCategories() {
    //
    this.newCategories = [];
  }

  @action
  initCategories() {
    //
    this.categories = [];
  }

  @action
  removeNewCategory(index: number) {
    //
    const removeCategory = this.newCategories.slice(0, index).concat(this.newCategories.slice(index + 1));
    this.newCategories = removeCategory;
    this.addNewCategories = _.set(this.addNewCategories, 'categoryCdoList', this.newCategories);
  }
}

Object.defineProperty(CategoryService, 'instance', {
  value: new CategoryService(CategoryApi.instance),
  writable: false,
  configurable: false,
});
