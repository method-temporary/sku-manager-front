import { CardDiscussion } from './CardDiscussion';
import { CardCategory } from './vo/CardCategory';
import { GroupBasedAccessRule, PolyglotModel } from '../../../../shared/model';
import {
  DifficultyLevel,
  InstructorInCard,
  PermittedCineroom,
  PrerequisiteCard,
  RelatedCard,
  ReportFileBox,
  Test,
} from './vo';
import { EnrollmentCard } from './EnrollmentCard';
import { LangSupport } from '../../../../shared/components/Polyglot';
import { LearningContentSdo } from './LearningContentSdo';
import { StudentEnrollmentType } from './vo/StudentEnrollmentType';
import { DatePeriod } from '../../../shared';

export interface CardSdo {
  //
  additionalLearningTime: number;
  approvalProcess: boolean;
  cancellationPenalty: string;
  cardDiscussions: CardDiscussion[];
  cardOperator: string;
  categories: CardCategory[];
  communityId: string;
  description: PolyglotModel;
  difficultyLevel: DifficultyLevel;
  enrollmentCards: EnrollmentCard[];
  fileBoxId: string;
  groupBasedAccessRule: GroupBasedAccessRule;
  instructors: InstructorInCard[];
  langSupports: LangSupport[];
  learningContents: LearningContentSdo[];
  learningPeriod: DatePeriod;
  mandatory: boolean;
  name: PolyglotModel;
  permittedCinerooms: PermittedCineroom[];
  pisAgreementDepotId: PolyglotModel;
  pisAgreementRequired: boolean;
  pisAgreementTitle: PolyglotModel;
  prerequisiteCards: PrerequisiteCard[];
  relatedCards: RelatedCard[];
  reportFileBox: ReportFileBox;
  restrictLearningPeriod: boolean;
  searchable: boolean;
  sendingMail: boolean;
  sequentialStudyRequired: boolean;
  simpleDescription: PolyglotModel;
  stampCount: number;
  surveyId: string;
  tags: PolyglotModel;
  tests: Test[];
  thumbnailImagePath: string;
  validLearningDate: number;
  studentEnrollmentType: StudentEnrollmentType;
  enrollingAvailable: boolean;
}
