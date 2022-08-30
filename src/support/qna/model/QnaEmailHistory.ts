import { decorate, observable } from 'mobx';
import { DramaEntityObservableModel } from 'shared/model';
import { QnaEmailReceiver } from './vo/QnaEmailReceiver';

export default class QnaEmailHistory extends DramaEntityObservableModel {
  //
  questionId: string = '';
  emailTemplate: string = '';
  sender: string = '';

  receiver: string = '';
  receiverType: QnaEmailReceiver = QnaEmailReceiver.Inquirer;

  registeredTime: number = 0;

  constructor(history?: QnaEmailHistory) {
    super();
    if (history) {
      Object.assign(this, { ...history });
    }
  }
}

decorate(QnaEmailHistory, {
  questionId: observable,
  emailTemplate: observable,
  sender: observable,

  receiver: observable,
  receiverType: observable,

  registeredTime: observable,
});
