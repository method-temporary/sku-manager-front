import { decorate, observable } from 'mobx';
import { DramaEntityObservableModel, PolyglotModel, NameValueList } from 'shared/model';
import { SupportType } from './vo/SupportType';
import CategoryCdo from './sdo/CategoryCdo';

export default class CategoryModel extends DramaEntityObservableModel {
  //
  supportType: SupportType = SupportType.QNA;
  name: PolyglotModel = new PolyglotModel();
  parentId: string | null = null;
  displayOrder: number = 0;
  enabled: boolean = false;
  deleted: boolean = false;

  registrant: string = '';
  registeredTime: number = 0;
  modifier: string = '';
  modifiedTime: number = 0;

  // 임시 Field
  isModify: boolean = false;
  subCategories: CategoryModel[] = [];

  constructor(category?: CategoryModel) {
    super();
    if (category) {
      const name = new PolyglotModel(category.name);

      Object.assign(this, {
        ...category,
        name,
      });
    }
  }

  static asCdo(category: CategoryModel): CategoryCdo {
    //
    return {
      supportType: category.supportType,
      parentId: category.parentId,
      name: category.name,
      displayOrder: category.displayOrder,
    };
  }

  static asModifiedNameValueList(category: CategoryModel): NameValueList {
    //
    return {
      nameValues: [
        {
          name: 'name',
          value: JSON.stringify(category.name),
        },
        {
          name: 'displayOrder',
          value: String(category.displayOrder),
        },
      ],
    };
  }
}

decorate(CategoryModel, {
  supportType: observable,
  name: observable,
  parentId: observable,
  displayOrder: observable,
  enabled: observable,

  registrant: observable,
  registeredTime: observable,
  modifier: observable,
  modifiedTime: observable,

  // 임시
  isModify: observable,
  subCategories: observable,
});
