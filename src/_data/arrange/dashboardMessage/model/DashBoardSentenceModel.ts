import { PolyglotModel } from 'shared/model';

export default interface DashBoardSentenceModel {
  id: string;
  name: string;
  state: string;
  exposureDateOption: boolean;
  startDate: number;
  endDate: number;
  registrantName: PolyglotModel;
  modifiedTime: number;
  updatedAt: number;
  show: boolean;
}

export interface DashBoardSentenceViewModel extends DashBoardSentenceModel {
  checked?: boolean;
}
