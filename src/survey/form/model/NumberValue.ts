import { computed, decorate, observable } from 'mobx';
import { LangStrings } from 'shared/model';

export class NumberValue {
  number: string = '';
  values: LangStrings = new LangStrings();

  constructor(numberValueApiModel?: any) {
    if (numberValueApiModel) {
      Object.assign(this, numberValueApiModel);
      this.values = new LangStrings(numberValueApiModel.values);
      if (!this.values.defaultLanguage) this.values.defaultLanguage = 'ko';
    }
  }

  @computed
  get value() {
    if (this.values && this.values.langStringMap) {
      return this.values.langStringMap.get(this.values.defaultLanguage) || '';
    }
    return '';
  }

  getValue(lang: string) {
    if (this.values && this.values.langStringMap) {
      return this.values.langStringMap.get(lang) || '';
    }
    return '';
  }
}
decorate(NumberValue, {
  number: observable,
  values: observable,
});
