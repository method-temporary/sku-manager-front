import { decorate } from 'mobx';
import { PolyglotModel, CardCategory, CubeType } from 'shared/model';

export class CubeWithReactiveModel {
  //
  cubeId: string = '';
  name: PolyglotModel = new PolyglotModel();
  type: CubeType = CubeType.ALL;
  registeredTime: number = 0; // registeredTime
  collegeId: string = '';
  channelId: string = '';
  registrantName: PolyglotModel = new PolyglotModel();
  organizerId: string = '';
  otherOrganizerName: string = '';
  passedStudentCount: number = 0;
  studentCount: number = 0;
  starCount: number = 0;
  usingCardCount: number = 0;

  categories: CardCategory[] = [];
  enabled: boolean = false;

  constructor(cubeWithReactiveModel?: CubeWithReactiveModel) {
    if (cubeWithReactiveModel) {
      const name = new PolyglotModel(cubeWithReactiveModel.name);
      const registrantName = new PolyglotModel(cubeWithReactiveModel.registrantName);
      Object.assign(this, { ...cubeWithReactiveModel, name, registrantName });
    }
  }

  getMainCategory(): CardCategory {
    let cardCategory = new CardCategory();
    this.categories.forEach((category) => {
      if (category.mainCategory) {
        cardCategory = category;
      }
    });
    return cardCategory;
  }

  getSubCategories(): CardCategory[] {
    const cardCategories: CardCategory[] = [];
    this.categories.forEach((category) => {
      if (!category.mainCategory) {
        cardCategories.push(category);
      }
    });
    return cardCategories;
  }
}

decorate(CubeWithReactiveModel, {
  // cube: observable,
  // cubeContents: observable,
  // cubeReactiveModel: observable,
});
