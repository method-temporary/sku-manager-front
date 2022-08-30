import { LearningState } from '../../../shared/LearningState';
import { ProposalState } from '../../../shared/ProposalState';
import { StudentOrderBy } from './vo/StudentOrderBy';
import { ExtraTaskType } from './vo/ExtraTaskType';
import { ExtraTaskStatus } from './vo/ExtraTaskStatus';
import dayjs from 'dayjs';

export interface CardStudentQdo {
  //
  cardId: string;
  offset: number;
  limit: number;
  learningState: LearningState[];
  proposalState: ProposalState;
  name: string;
  company: string;
  department: string;
  email: string;
  startTime: number;
  endTime: number;
  phaseCompleteState: boolean;
  examAttendance?: boolean;
  surveyCompleted?: boolean | '';
  employed: boolean | ''; // 재직여부

  studentOrderBy: StudentOrderBy;

  extraTaskTypes: ExtraTaskType[];
  extraTaskStatuses: ExtraTaskStatus[];

  // 학습자
  childLecture: string;
  round?: number;
}

export const initializeCardStudentQdo = (): CardStudentQdo => {
  //
  return {
    cardId: '',
    offset: 1,
    limit: 20,
    learningState: [],
    proposalState: '',
    name: '',
    company: '',
    department: '',
    email: '',
    startTime: dayjs().subtract(2, 'year').toDate().getTime(),
    endTime: dayjs().subtract(0, 'd').endOf('d').valueOf(),
    phaseCompleteState: false,
    examAttendance: undefined,
    surveyCompleted: '',
    studentOrderBy: 'RegisteredTimeDesc',
    extraTaskTypes: ['Test', 'Report'],
    extraTaskStatuses: [],
    employed: '',
    childLecture: '',
    round: undefined,
  };
};
