import { AnswerModel } from './AnswerModel';

export class AnswerFlowCdoModel {
  audienceKey: string = 'r2p8-r@nea-m5-c5';
  answerCdo: AnswerModel = new AnswerModel();

  constructor(answerCdo: AnswerModel) {
    if (answerCdo) {
      this.audienceKey = 'r2p8-r@nea-m5-c5';
      this.answerCdo = answerCdo;
    }
  }
}
