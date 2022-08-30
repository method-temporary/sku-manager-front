import { ExtraWorkState } from '../model/vo/ExtraWorkState';
import { PolyglotModel } from 'shared/model';

export interface ReportViewModel {
  studentId: string;
  homework: Homework;
  homeworkOperatorComment: string;
  homeworkOperatorFileBoxId: string;
  homeworkScore: number;
  homeworkState: ExtraWorkState;
}

export interface Homework {
  reportName: PolyglotModel;
  reportQuestion: PolyglotModel;
  homeworkContent: string;
  homeworkFileBoxId: string;
}
