import { decorate, observable } from 'mobx';
import moment from 'moment';

import { ReportFileBox, PolyglotModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import ExtraWork from '../../student/model/vo/ExtraWork';
import { LearningState } from '../../student/model/vo/LearningState';
import { StudentScoreModel } from '../../student/model/StudentScoreModel';

import { TrainingExcelListViewModel } from './TrainingExcelListViewModel';
import { ExtraWorkState } from '../../student/model/vo/ExtraWorkState';
import { LearningContentModel } from '../../_data/lecture/cards/model/vo/LearningContentModel';
import { TrainingForCardListViewModel } from './TrainingForCardListViewModel';

export class TrainingListViewModel {
  //
  id: string = ''; // Id
  name: string = ''; // 학습자 이름
  lectureId: string = ''; // Card or Cube Id
  lectureName: PolyglotModel = new PolyglotModel(); // 과정명
  extraWork: ExtraWork = new ExtraWork(); // 시험, 과제, 설문 여부
  category: string = ''; // Category
  type: string = ''; // 교육형태
  studentType: string = ''; // 교육형태
  learningTime: number = 0; // 학습 시간
  learningState: LearningState = LearningState.Empty; // 이수항태
  modifiedTime: number = 0; // 이수일 --> 이수상태가 Opened 일 때만 이수일
  studentScore: StudentScoreModel = new StudentScoreModel(); // 시험, 과제 점수
  stamped: boolean = false; // Stamp 여부
  tested: boolean = false;
  organizer: string = ''; // 교육기관 Id
  organizerName: PolyglotModel = new PolyglotModel(); // 교육기관 명
  surveyId: string = ''; // 설문 Id
  reportFileBox: ReportFileBox = new ReportFileBox(); // 과제 정보
  homeworkFileBoxId: string = ''; // 과제 제출 FileBoxId
  badgeNames: string = ''; // Badge 이름들

  learningContents: LearningContentModel[] = []; // 교육형태가 Card 일 때 보여줄 Chapter, Cube, Talk 목록

  constructor(training?: TrainingListViewModel) {
    //
    if (training) {
      const organizerName = (training.organizerName && new PolyglotModel(training.organizerName)) || this.organizerName;
      const lectureName = (training.lectureName && new PolyglotModel(training.lectureName)) || this.lectureName;

      Object.assign(this, { ...training, organizerName, lectureName });
    }
  }

  static asXLSX(training: TrainingListViewModel, index: number): TrainingExcelListViewModel {
    return {
      No: String(index + 1),
      Channel: training.category || '-',
      '과정명(Ko)': training.lectureName.ko || '-',
      '과정명(En)': training.lectureName.en || '-',
      '과정명(Zh)': training.lectureName.zh || '-',
      교육형태: training.type || '-',
      학습시간: training.learningTime + 'minute(s)',
      이수일:
        training.learningState === LearningState.Passed
          ? moment(training.modifiedTime).format('YYYY.MM.DD hh:mm:ss')
          : '-',
      'Test 결과': (training.studentScore && training.studentScore.examId && training.studentScore.latestScore) || '-',
      'Report 결과':
        training.reportFileBox?.fileBoxId || training.reportFileBox?.reportName
          ? training.homeworkFileBoxId &&
            (training.extraWork.reportStatus === ExtraWorkState.Pass ||
              training.extraWork.reportStatus === ExtraWorkState.Fail)
            ? training.studentScore.homeworkScore
            : '미제출'
          : '-',
      Survey: training.surveyId
        ? training.extraWork.surveyStatus === ExtraWorkState.Submit ||
          training.extraWork.surveyStatus === ExtraWorkState.Pass
          ? 'Y'
          : 'N'
        : '-',
      Stamp: training.stamped ? 'Y' : 'N',
      교육기관: getPolyglotToAnyString(training.organizerName) || '-',
    };
  }

  static fromTrainingForCard(trainingForCard: TrainingForCardListViewModel): TrainingListViewModel[] {
    //
    const trainingListView: TrainingListViewModel[] = [];

    if (trainingForCard) {
      const { cubeStudents } = trainingForCard;

      cubeStudents &&
        cubeStudents.forEach((training) => {
          trainingListView.push(new TrainingListViewModel(training));
        });
    }

    return trainingListView;
  }
}

decorate(TrainingListViewModel, {
  id: observable,
  lectureId: observable,
  lectureName: observable,
  extraWork: observable,
  category: observable,
  type: observable,
  studentType: observable,
  learningTime: observable,
  learningState: observable,
  modifiedTime: observable,
  studentScore: observable,
  stamped: observable,
  organizer: observable,
  organizerName: observable,
  badgeNames: observable,
  tested: observable,
});
