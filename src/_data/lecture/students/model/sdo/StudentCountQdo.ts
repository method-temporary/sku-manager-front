import { StudentType } from '../vo/StudentType';
import { LearningState } from '../../../../shared/LearningState';
import { ProposalState } from '../../../../shared/ProposalState';
import { ExtraTaskStatus } from '../vo/ExtraTaskStatus';
import { StudentCountType } from './StudentCountType';
import dayjs from 'dayjs';

export interface StudentCountQdo {
  //
  cardId: string;
  round?: number;
  userDenizenId: string;
  studentType: StudentType;
  learningState: LearningState[];
  proposalState: ProposalState;
  name: string;
  company: string;
  department: string;
  email: string;
  startTime: number;
  endTime: number;
  surveyStatus?: ExtraTaskStatus;

  learningStudentOnly?: boolean;
  collegeId?: string;
  channelId?: string;

  type: StudentCountType;
}

export const initializeStudentCountQdo = (): StudentCountQdo => {
  //
  return {
    // 공통
    cardId: '',
    round: undefined,
    userDenizenId: '',
    studentType: 'Card',
    learningState: [],
    proposalState: '',
    name: '',
    company: '',
    department: '',
    email: '',
    startTime: dayjs().subtract(2, 'year').toDate().getTime(),
    endTime: dayjs().subtract(0, 'd').endOf('d').valueOf(),
    surveyStatus: undefined,
    learningStudentOnly: undefined,
    collegeId: undefined,
    channelId: undefined,
    type: 'LEARNING_STATE',
  };
};
