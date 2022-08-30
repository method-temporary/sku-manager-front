import { decorate, observable } from 'mobx';
import { LangStrings } from 'shared/model';

export class QuestionGroupModel {
  sequence: number = 0;
  number: string = '';
  titles: LangStrings = new LangStrings();
  description: string = '';

  constructor(questionGroup?: QuestionGroupModel) {
    //
    if (questionGroup) {
      const titles = (questionGroup.titles && new LangStrings(questionGroup.titles)) || this.titles;
      Object.assign(this, { ...questionGroup, titles });
    }
  }
}

decorate(QuestionGroupModel, {
  sequence: observable,
  number: observable,
  titles: observable,
  description: observable,
});
