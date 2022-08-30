import { computed, decorate, observable } from 'mobx';
import { LangStrings } from 'shared/model';

export class CriteriaItemModel {
  index: number = 0;
  names: LangStrings = new LangStrings();
  value: number = 0;

  constructor(criteriaItem?: CriteriaItemModel) {
    //
    if (criteriaItem) {
      const names = (criteriaItem.names && new LangStrings(criteriaItem.names)) || this.names;
      Object.assign(this, { ...criteriaItem, names });
    }
  }

  @computed
  get name() {
    if (this.names && this.names.langStringMap) {
      return this.names.langStringMap.get(this.names.defaultLanguage) || '';
    }
    return '';
  }

  getName(lang: string) {
    if (this.names && this.names.langStringMap) {
      return this.names.langStringMap.get(lang) || '';
    }
    return '';
  }
}

decorate(CriteriaItemModel, {
  index: observable,
  names: observable,
  value: observable,
});
