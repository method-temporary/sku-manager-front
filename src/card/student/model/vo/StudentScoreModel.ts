import { decorate, observable } from 'mobx';

export class StudentScoreModel {
  //
  examId: string = '';
  homeworkScore: number = 0; // 과제 점수
  latestScore: number = 0; // 마지막 시험 점수
  numberOfTrials: number = 0; // 시험 응시 횟수
  paperId: string = '';
  submittedEssay: boolean = false; // 설문 여부
  testScoreList: number[] = []; // 응시한 시험 점수들
  testTotalScore: number = 0; // ...to...tal??

  constructor(studentScoreModel?: StudentScoreModel) {
    //
    if (studentScoreModel) {
      Object.assign(this, { ...studentScoreModel });
    }
  }
}

decorate(StudentScoreModel, {
  examId: observable,
  homeworkScore: observable,
  latestScore: observable,
  numberOfTrials: observable,
  paperId: observable,
  submittedEssay: observable,
  testTotalScore: observable,
  testScoreList: observable,
});
