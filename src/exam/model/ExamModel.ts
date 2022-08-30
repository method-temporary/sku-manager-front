import { decorate, observable } from 'mobx';
import { QuestionSelectionType } from './QuestionSelectionType';

export class ExamModel {
  authorId: string = '';
  authorName: string = '';
  questionSelectionType: QuestionSelectionType = QuestionSelectionType.ALL;
  successPoint: number = 0;
  totalPoint: number = 0;
  finalCopy: boolean = false;
  finalCopyKr: string = '';
  id: string = '';
  questions: any[] = [];
  registDate: string = '';
  title: string = '';
  year: string = '';

  // onlyView
  multipleChoicePoint: number = 0;
  assayPoint: number = 0;

  constructor(examModel?: ExamModel) {
    //
    if (examModel) Object.assign(this, { ...examModel });
  }
}

decorate(ExamModel, {
  authorId: observable,
  authorName: observable,
  questionSelectionType: observable,
  successPoint: observable,
  totalPoint: observable,
  finalCopy: observable,
  finalCopyKr: observable,
  id: observable,
  questions: observable,
  registDate: observable,
  title: observable,
  year: observable,
  multipleChoicePoint: observable,
  assayPoint: observable,
});
