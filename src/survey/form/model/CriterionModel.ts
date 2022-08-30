import { decorate, observable } from 'mobx';
import { CriteriaItemModel } from './CriteriaItemModel';

export class CriterionModel {
  number: string = '';
  minValue: number = 0;
  maxValue: number = 0;
  increase: number = 0;
  criteriaItems: CriteriaItemModel[] = [];

  constructor(criterion?: CriterionModel) {
    //
    if (criterion) {
      Object.assign(this, { ...criterion });
      this.criteriaItems = criterion.criteriaItems && criterion.criteriaItems.length
        && criterion.criteriaItems.map(item => new CriteriaItemModel(item)) || this.criteriaItems;
    }
  }

  static checkValidation(prop: string, criterion: CriterionModel) {
    const min = criterion.minValue;
    const max = criterion.maxValue;
    const increase = criterion.increase;

    let validation = false;
    switch (prop) {
      case 'minValue':
        validation = min >= 0; break;
      case 'maxValue':
        validation = max > 0 && max > min; break;
      case 'increase':
        validation = increase > 0 && (max - min) % increase === 0;
        break;
      case 'all':
        validation = min >= 0
          && max > 0
          && max > min
          && increase > 0
          && (max - min) % increase === 0; break;
    }
    return validation;
  }
}

decorate(CriterionModel, {
  number: observable,
  minValue: observable,
  maxValue: observable,
  increase: observable,
  criteriaItems: observable,
});
