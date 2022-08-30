import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';

import { LearningState } from '../../../lecture/student/model/LearningState';
import { PageModel } from 'shared/model';
import { StudentRdoModel } from './StudentRdoModel';

export class StudentQueryModel extends QueryModel {
  //
  childLecture: string = ''; // 완료 Phase
  learningState: LearningState = LearningState.Empty; // 이수상태

  scoringState: string = ''; // 채점상태
  numberOfTrials: string = ''; // 응시횟수
  phaseCompleteState: boolean = false; // 완료여부

  static asStudentRdo(cardId: string, studentQuery: StudentQueryModel, pageModel: PageModel): StudentRdoModel {
    //
    return {
      // 공통
      cardId,
      startDate: studentQuery.period.startDateLong,
      endDate: studentQuery.period.endDateLong,
      company: studentQuery.searchPart === '소속사' ? studentQuery.searchWord : '',
      department: studentQuery.searchPart === '소속조직' ? studentQuery.searchWord : '',
      name: studentQuery.searchPart === '성명' ? studentQuery.searchWord : '',
      email: studentQuery.searchPart === 'Email' ? studentQuery.searchWord : '',
      learningState: studentQuery.learningState,
      offset: pageModel.offset,
      limit: pageModel.limit,
      // 학습자
      childLecture: studentQuery.childLecture,
      // 결과관리
      numberOfTrials: studentQuery.numberOfTrials,
      scoringState: studentQuery.scoringState,
      phaseCompleteState: studentQuery.phaseCompleteState,
    };
  }
}

decorate(StudentQueryModel, {
  childLecture: observable,
  learningState: observable,
  scoringState: observable,
  numberOfTrials: observable,
  phaseCompleteState: observable,
});
