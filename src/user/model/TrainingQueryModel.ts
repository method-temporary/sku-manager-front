import { decorate, observable } from 'mobx';

import { QueryModel, PageModel } from 'shared/model';

import { LearningState } from 'student/model/vo/LearningState';
import { ServiceType } from 'student/model/vo/ServiceType';
import { TrainingRdo } from './TrainingRdo';

export class TrainingQueryModel extends QueryModel {
  //
  name: string = '';
  userDenizenId: string = '';
  learningState: LearningState[] | LearningState = LearningState.Empty; // 이수상태
  collegeId: string = '';
  channelId: string = '';
  studentType: ServiceType = ServiceType.Empty;

  type: string = 'LEARNING_STATE';
  learningStudentOnly: boolean = true;

  constructor(trainingQueryModel?: TrainingQueryModel) {
    super();
    if (trainingQueryModel) Object.assign(this, { ...trainingQueryModel });
  }

  static isBlank(trainingQuery: TrainingQueryModel): string {
    //
    if (trainingQuery && trainingQuery.searchPart !== '' && trainingQuery && !trainingQuery.searchWord) {
      return '검색어';
    }
    return 'success';
  }

  static asTrainingRdo(trainingQuery: TrainingQueryModel, pageModel: PageModel): TrainingRdo {
    //
    return {
      startDate: trainingQuery.period.startDateLong,
      endDate: trainingQuery.period.endDateLong,
      startTime: trainingQuery.period.startDateLong,
      endTime: trainingQuery.period.endDateLong,
      name: trainingQuery.searchPart === '과정명' ? trainingQuery.searchWord : '',
      userDenizenId: trainingQuery.userDenizenId,
      learningState: trainingQuery.learningState,
      // trainingQuery.learningState === LearningState.Waiting
      //   ? [
      //       LearningState.Waiting,
      //       LearningState.Progress,
      //       LearningState.TestPassed,
      //       LearningState.TestWaiting,
      //       LearningState.HomeworkWaiting,
      //       LearningState.Failed,
      //     ]
      //   : trainingQuery.learningState,
      collegeId: trainingQuery.channelId ? '' : trainingQuery.collegeId,
      channelId: trainingQuery.channelId,
      studentType: trainingQuery.studentType,
      type: trainingQuery.type,
      offset: pageModel.offset,
      limit: pageModel.limit,
      learningStudentOnly: trainingQuery.learningStudentOnly,
    };
  }
}

decorate(TrainingQueryModel, {
  name: observable,
  userDenizenId: observable,
  learningState: observable,
  collegeId: observable,
  channelId: observable,
  studentType: observable,
  learningStudentOnly: observable,
});
