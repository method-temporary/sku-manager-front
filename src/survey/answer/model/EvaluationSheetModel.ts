import { decorate, observable } from 'mobx';
import { NameValueList } from '@nara.platform/accent';
import { DramaEntityObservableModel } from 'shared/model';
import AnswerModel from './AnswerModel';

export default class EvaluationSheetModel extends DramaEntityObservableModel {
  //
  questionCount: number = 0;
  answers: AnswerModel[] = [];

  constructor(evaluationSheet?: EvaluationSheetModel) {
    super();
    if (evaluationSheet) {
      Object.assign(this, evaluationSheet);
      this.answers = evaluationSheet.answers.map((answer: AnswerModel) => new AnswerModel(answer));
    }
  }

  static getNameValueList(evaluationSheet: EvaluationSheetModel) {
    const nameValues = [];
    nameValues.push({ name: 'questionCount', value: evaluationSheet.questionCount });
    nameValues.push({ name: 'answers', value: JSON.stringify(evaluationSheet.answers) });

    return { nameValues } as NameValueList;
  }
}

decorate(EvaluationSheetModel, {
  questionCount: observable,
  answers: observable,
});
