import { decorate, observable } from 'mobx';
import { DomainEntity, NameValueList } from '@nara.platform/accent';
import { PolyglotModel } from 'shared/model';

export class CategoryModel implements DomainEntity {
  //
  id: string = '';
  entityVersion: number = 0;

  categoryId: string = '';
  name: PolyglotModel = new PolyglotModel();
  boardId: string = '';
  deleted: boolean = false;
  time: number = 0;

  constructor(category?: CategoryModel) {
    //
    if (category) {
      const name = (category.name && new PolyglotModel(category.name)) || this.name;

      Object.assign(this, { ...category, name });
    }
  }

  static isBlank(category: CategoryModel): string {
    //
    if (category.name.en === '' || category.name.ko === '' || category.name.zh === '') return '카테고리';
    return 'success';
  }

  static isListBlank(categories: CategoryModel[]): string {
    //
    for (let i = 0; i < categories.length; i++) {
      if (!categories[i].name) return '카테고리';
    }
    return 'success';
  }

  static asNameValueList(category: CategoryModel): NameValueList {
    //
    const asNameValues = {
      nameValues: [
        {
          name: 'name',
          value: JSON.stringify(category.name),
        },
        {
          name: 'deleted',
          value: String(category.deleted),
        },
      ],
    };
    return asNameValues;
  }
}

decorate(CategoryModel, {
  id: observable,
  entityVersion: observable,

  categoryId: observable,
  name: observable,
  boardId: observable,
  deleted: observable,
  time: observable,
});
