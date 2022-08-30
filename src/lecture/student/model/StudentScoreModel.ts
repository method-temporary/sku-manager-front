import { decorate, observable } from 'mobx';

export class StudentScoreModel {
  //
  testScoreList: number[] = [];
  testTotalScore: number = 0;
  homeworkScore: number = 0;
  numberOfTrials: number = 0;
  latestScore: number = 0;
  gotEssay: boolean = false;
  examId: string = '';
  paperId: string = '';

  constructor(studentScoreModel?: StudentScoreModel) {
    //
    if (studentScoreModel) {
      Object.assign(this, { ...studentScoreModel });
    }
  }
}

decorate(StudentScoreModel, {
  testScoreList: observable,
  testTotalScore: observable,
  homeworkScore: observable,
  numberOfTrials: observable,
  latestScore: observable,
  gotEssay: observable,
  examId: observable,
  paperId: observable,
});
