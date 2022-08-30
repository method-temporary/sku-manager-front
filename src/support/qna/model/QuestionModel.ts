import { decorate, observable } from 'mobx';
import { DramaEntityObservableModel, PolyglotModel } from 'shared/model';

import { RequestChannel } from './vo/RequestChannel';
import { QuestionState } from './vo/QuestionState';

export default class QuestionModel extends DramaEntityObservableModel {
  //
  denizenId: string = '';
  requestChannel: RequestChannel | '' = '';

  mainCategoryId: string = '';
  subCategoryId: string = '';

  relatedCardId: string = '';
  relatedCardName: PolyglotModel = new PolyglotModel();
  relatedQuestionId: string = '';

  operatorIds: string[] = [];

  title: string = '';
  content: string = '';

  depotId: string = '';

  state: QuestionState = QuestionState.QuestionReceived;

  registeredTime: number = 0;
  modifiedTime: number = 0;

  visibleForQuestioner: boolean = false;

  constructor(question?: QuestionModel) {
    super();
    if (question) {
      Object.assign(this, { ...question });
    }
  }
}

decorate(QuestionModel, {
  denizenId: observable,
  requestChannel: observable,

  mainCategoryId: observable,
  subCategoryId: observable,

  relatedCardId: observable,
  relatedCardName: observable,
  relatedQuestionId: observable,

  operatorIds: observable,

  title: observable,
  content: observable,

  depotId: observable,
  state: observable,

  registeredTime: observable,
  modifiedTime: observable,

  visibleForQuestioner: observable,
});
