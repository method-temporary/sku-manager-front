import { DenizenKey } from '@nara.platform/accent';

import { PatronKey, ReportFileBox, PolyglotModel, DramaEntityObservableModel } from 'shared/model';
import {
  InstructorInCard,
  LearningContentModel,
  OpenRequest,
  PrerequisiteCard,
  RelatedCard,
} from '_data/lecture/cards/model/vo';
import { TestModel } from './vo/TestModel';
import { DatePeriod, DatePeriodFunc } from '../../../_data/shared';

export class CardContentsModel extends DramaEntityObservableModel {
  //
  registrantName: PolyglotModel = new PolyglotModel();
  learningPeriod: DatePeriod = DatePeriodFunc.initialize();
  surveyId: string = '';
  surveyCaseId: string = '';

  instructors: InstructorInCard[] = [];
  tests: TestModel[] = [];

  description: PolyglotModel = new PolyglotModel();

  relatedCards: RelatedCard[] = [];
  cardOperator: DenizenKey = new PatronKey();
  reportFileBox: ReportFileBox = new ReportFileBox();

  learningContents: LearningContentModel[] = [];
  prerequisiteCards: PrerequisiteCard[] = [];
  validLearningDate: number = 0;
  additionalLearningTime: number = 0;

  communityId: string = '';
  registeredTime: number = 0;
  modifiedTime: number = 0;
  openRequests: OpenRequest[] = [];

  reviewFeedbackId: string = '';
  commentFeedbackId: string = '';

  pisAgreementRequired: boolean = false;
  pisAgreementTitle: PolyglotModel = new PolyglotModel();
  pisAgreementDepotId: PolyglotModel = new PolyglotModel();

  mandatory: boolean = false;

  constructor(cardContents?: CardContentsModel) {
    super();
    if (cardContents) {
      const description = (cardContents.description && new PolyglotModel(cardContents.description)) || this.description;
      const registrantName =
        (cardContents.registrantName && new PolyglotModel(cardContents.registrantName)) || this.registrantName;
      const pisAgreementTitle =
        (cardContents.pisAgreementTitle && new PolyglotModel(cardContents.pisAgreementTitle)) || this.registrantName;
      const pisAgreementDepotId =
        (cardContents.pisAgreementDepotId && new PolyglotModel(cardContents.pisAgreementDepotId)) ||
        this.registrantName;
      Object.assign(this, { ...cardContents, description, registrantName, pisAgreementTitle, pisAgreementDepotId });
    }
  }
}
