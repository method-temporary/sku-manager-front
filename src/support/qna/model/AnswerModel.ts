import { DramaEntityObservableModel, PolyglotModel } from 'shared/model';
import { decorate, observable } from 'mobx';

export default class AnswerModel extends DramaEntityObservableModel {
  //
  questionId: string = '';
  content: string = '';
  depotId: string = '';

  operatorMailSentTime: number = 0;
  checkMail: boolean = false;

  satisfactionPoint: number = 0;
  satisfactionComment: string = '';
  satisfactionRegisteredTime: number = 0;

  registrant: string = '';
  registeredTime: number = 0;
  registrantName: PolyglotModel = new PolyglotModel();
  modifier: string = '';
  modifiedTime: number = 0;
  modifierName: PolyglotModel = new PolyglotModel();

  memo: string = '';

  constructor(answer?: AnswerModel) {
    super();
    if (answer) {
      const registrantName = new PolyglotModel(answer.registrantName);
      const modifierName = new PolyglotModel(answer.modifierName);
      Object.assign(this, { ...answer, registrantName, modifierName });
    }

    if (this.operatorMailSentTime > 0) {
      this.checkMail = true;
    }
  }
}

decorate(AnswerModel, {
  questionId: observable,
  content: observable,
  depotId: observable,

  operatorMailSentTime: observable,
  checkMail: observable,

  satisfactionPoint: observable,
  satisfactionComment: observable,
  satisfactionRegisteredTime: observable,
  memo: observable,
});
