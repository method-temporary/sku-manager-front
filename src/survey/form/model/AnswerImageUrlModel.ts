import { decorate, observable } from 'mobx';

export class AnswerImageUrlModel {
  number: string = '';
  imageUrl: string = '';

  constructor(numberUrl?: AnswerImageUrlModel) {
    if (numberUrl) {
      Object.assign(this, numberUrl);
    }
  }
}

decorate(AnswerImageUrlModel, {
  number: observable,
  imageUrl: observable,
});
