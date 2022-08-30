import { DenizenKey } from '@nara.platform/accent';
import { PatronKey, PolyglotModel, ReportFileBox } from '../../../../shared/model';
import { EnrollmentCard } from './EnrollmentCard';
import { OpenRequest, PrerequisiteCard, RelatedCard, LearningContent, Test, InstructorInCard } from './vo';
import { DatePeriod, DatePeriodFunc } from '../../../shared';
import dayjs from 'dayjs';

export default interface CardContents {
  //
  id: string;
  patronKey: PatronKey;

  registrantName: PolyglotModel;
  restrictLearningPeriod: boolean;
  learningPeriod: DatePeriod;
  surveyId: string;
  surveyCaseId: string;
  description: PolyglotModel;
  instructors: InstructorInCard[];
  tests: Test[];
  relatedCards: RelatedCard[];
  cardOperator: DenizenKey;
  reportFileBox: ReportFileBox;

  learningContents: LearningContent[];
  prerequisiteCards: PrerequisiteCard[];

  communityId: string;
  registeredTime: number;
  openRequests: OpenRequest[];
  reviewFeedbackId: string;
  commentFeedbackId: string;
  validLearningDate: number;
  fileBoxId: string;

  sequentialStudyRequired: boolean;

  pisAgreementRequired: boolean;
  pisAgreementTitle: PolyglotModel;
  pisAgreementDepotId: PolyglotModel;

  modifiedTime: number;
  modifier: string;

  enrollingAvailable: boolean;
  enrollmentCards: EnrollmentCard[];
  approvalProcess: boolean;
  sendingMail: boolean;
  cancellationPenalty: string;
  mandatory: boolean;
}

export function getInitCardContents(): CardContents {
  //
  const now = dayjs();
  const startDate = now.add(1, 'month').add(1, 'day').toDate().getTime();
  const endDate = now.add(2, 'month').add(1, 'day').toDate().getTime();

  return {
    cardOperator: new PatronKey(),
    commentFeedbackId: '',
    communityId: '',
    description: new PolyglotModel(),
    fileBoxId: '',
    id: '',
    instructors: [],
    learningContents: [],
    learningPeriod: DatePeriodFunc.setDatePeriod(startDate, endDate),
    modifiedTime: 0,
    modifier: '',
    openRequests: [],
    patronKey: new PatronKey(),
    pisAgreementDepotId: new PolyglotModel(),
    pisAgreementRequired: false,
    pisAgreementTitle: new PolyglotModel(),
    prerequisiteCards: [],
    registeredTime: 0,
    registrantName: new PolyglotModel(),
    relatedCards: [],
    reportFileBox: new ReportFileBox(),
    restrictLearningPeriod: false,
    reviewFeedbackId: '',
    surveyCaseId: '',
    surveyId: '',
    tests: [],
    validLearningDate: 0,
    sequentialStudyRequired: true,
    approvalProcess: false,
    cancellationPenalty: '',
    enrollmentCards: [],
    sendingMail: false,
    enrollingAvailable: false,
    mandatory: false,
  };
}
