import { decorate, observable } from 'mobx';
import AnswerRdoModel from './AnswerRdoModel';

export default class EvaluationSheetExcelRdoModel {
  //
  email: string = '';
  employeeId: string = '';
  name: string = '';
  company: string = '';
  companyCode: string = '';
  department: string = '';
  departmentCode: string = '';

  answers: AnswerRdoModel[] = [];
  surveyFormId: string = '';

  constructor(evaluationSheet?: EvaluationSheetExcelRdoModel) {
    if (evaluationSheet) {
      Object.assign(this, evaluationSheet);
      this.answers = evaluationSheet.answers.map((answer: AnswerRdoModel) => new AnswerRdoModel(answer));
    }
  }
}

decorate(EvaluationSheetExcelRdoModel, {
  email: observable,
  employeeId: observable,
  name: observable,
  company: observable,
  companyCode: observable,
  department: observable,
  departmentCode: observable,
  answers: observable,
  surveyFormId: observable,
});
