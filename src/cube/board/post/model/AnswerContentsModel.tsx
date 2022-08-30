import { PolyglotModel } from '../../../../shared/model';
import { decorate, observable } from 'mobx';

export class AnswerContentsModel {
  //
  contents: PolyglotModel = new PolyglotModel();
  depotId: string = '';
  constructor(answerContents?: AnswerContentsModel) {
    //
    if (answerContents) {
      const contents = (answerContents.contents && new PolyglotModel(answerContents.contents)) || this.contents;
      Object.assign(this, { ...answerContents, contents });
    }
  }
}

decorate(AnswerContentsModel, {
  contents: observable,
  depotId: observable,
});
