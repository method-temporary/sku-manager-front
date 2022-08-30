import { observable, decorate } from 'mobx';

export default class CategoryModel {
  //
  categoryId: string = '';
  mainCategory: boolean = false;
  displayOrderInCategory: number = 0;

  constructor(category?: CategoryModel) {
    if (category) {
      //
      Object.assign(this, { ...category });
    }
  }

  static asMainCategories(id: string) {
    const category = new CategoryModel();

    return Object.assign(category, {
      categoryId: id,
      mainCategory: true,
      displayOrderInCategory: 0,
    });
  }

  static asSubCategories(id: string) {
    const category = new CategoryModel();

    return Object.assign(category, {
      categoryId: id,
      mainCategory: false,
      displayOrderInCategory: 0,
    });
  }
}
decorate(CategoryModel, {
  categoryId: observable,
  mainCategory: observable,
  displayOrderInCategory: observable,
});
