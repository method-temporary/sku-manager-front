import { decorate, observable } from 'mobx';
import { NewDatePeriod, PolyglotModel, ReportFileBox } from 'shared/model';

import { OpenRequest } from '../../../_data/lecture/cards/model/vo/OpenRequest';
import { PrerequisiteCard } from '../../../_data/lecture/cards/model/vo/PrerequisiteCard';
import { CardContentsModel } from './CardContentsModel';
import { CardOperatorModel } from '../../shared/model/CardOperatorModel';

import { CardRelatedCardModel } from '../../../_data/lecture/cards/model/vo/CardRelatedCardModel';
import { LearningContentModel } from '../../../_data/lecture/cards/model/vo/LearningContentModel';
import CardInstructorsModel from './vo/CardInstructorsModel';
import { LearningContentType } from './vo/LearningContentType';
import { CardOperatorIdentity } from './vo/CardOperatorIdentity';
import Discussion from '../../../discussion/model/Discussion';
import { CubeTermModel } from '../../../cube/cube/model/CubeTermModel';
import { TestModel } from './vo/TestModel';

export class CardContentsQueryModel {
  //
  terms: CubeTermModel[] = [];

  restrictLearningPeriod: boolean = false;
  learningContents: LearningContentModel[] = [];

  learningPeriod: NewDatePeriod = new NewDatePeriod(); // 강의 일자
  // 유효 학습  기간
  hasValidLearningDate: boolean = false;
  validLearningDate: number = 0;

  cardOperator: CardOperatorModel = new CardOperatorModel(); // 관리자
  fileBoxId: string = ''; // Attached files

  reportFileBox: ReportFileBox = new ReportFileBox(); // 레포트

  hasPrerequisite: 'Yes' | 'No' = 'No'; // 선수 Card 여부
  prerequisiteCards: PrerequisiteCard[] = []; // 선수 Card

  description: PolyglotModel = new PolyglotModel(); // Card 소개

  // 관련 과정
  relatedCards: CardRelatedCardModel[] = [];

  commentFeedbackId: string = '';

  // 커뮤니티
  communityId: string = '';
  communityName: string = '';

  // 강사 정보
  instructors: CardInstructorsModel[] = [];

  // 설문
  surveyId: string = '';
  surveyCaseId: string = '';
  surveyTitle: string = '';
  surveyDesignerName: string = '';

  // test
  // testId: string = '';
  examTitle: string = '';
  examAuthorName: string = '';
  paperId: string = '';
  // examinationCdo: ExaminationCdoModel = new ExaminationCdoModel();
  tests: TestModel[] = [];

  registeredTime: number = 0;
  openRequests: OpenRequest[] = [];
  registrantName: PolyglotModel = new PolyglotModel();
  email: string = '';

  cardDiscussions: Discussion[] = [];

  pisAgreementRequired: boolean = false;
  pisAgreementTitle: PolyglotModel = new PolyglotModel();
  pisAgreementDepotId: PolyglotModel = new PolyglotModel();

  constructor(cardContentsQuery?: CardContentsQueryModel) {
    //
    if (cardContentsQuery) {
      const description =
        (cardContentsQuery.description && new PolyglotModel(cardContentsQuery.description)) || this.description;
      const registrantName =
        (cardContentsQuery.registrantName && new PolyglotModel(cardContentsQuery.registrantName)) ||
        this.registrantName;
      const pisAgreementTitle =
        (cardContentsQuery.pisAgreementTitle && new PolyglotModel(cardContentsQuery.pisAgreementTitle)) ||
        this.pisAgreementTitle;
      const pisAgreementDepotId =
        (cardContentsQuery.pisAgreementDepotId && new PolyglotModel(cardContentsQuery.pisAgreementDepotId)) ||
        this.pisAgreementDepotId;
      Object.assign(this, {
        ...cardContentsQuery,
        description,
        registrantName,
        pisAgreementTitle,
        pisAgreementDepotId,
      });
    }
  }

  static asCardContentsByCardContentsModel(
    cardContentsModel: CardContentsModel,
    cardOperatorIdentity: CardOperatorIdentity
  ): CardContentsQueryModel {
    //
    const cardContentsQuery = new CardContentsQueryModel();

    const newDatePeriod = new NewDatePeriod();
    const cardOperator = new CardOperatorModel();
    const modelTests = cardContentsModel.tests;
    const tests: TestModel[] = [];
    const learningContents: LearningContentModel[] = [];

    const description = cardContentsModel.description && new PolyglotModel(cardContentsModel.description);
    const registrantName = cardContentsModel.registrantName && new PolyglotModel(cardContentsModel.registrantName);
    const pisAgreementTitle =
      cardContentsModel.registrantName && new PolyglotModel(cardContentsModel.pisAgreementTitle);
    const pisAgreementDepotId =
      cardContentsModel.registrantName && new PolyglotModel(cardContentsModel.pisAgreementDepotId);

    newDatePeriod.setStartDateObj(
      new Date(cardContentsModel.learningPeriod && cardContentsModel.learningPeriod.startDate)
    );
    newDatePeriod.setEndDateObj(new Date(cardContentsModel.learningPeriod && cardContentsModel.learningPeriod.endDate));

    cardOperator.setOperator(
      cardOperatorIdentity.id,
      cardOperatorIdentity.name,
      cardOperatorIdentity.email,
      cardOperatorIdentity.companyCode,
      cardOperatorIdentity.departmentName
    );

    modelTests && modelTests.forEach((test) => tests.push(new TestModel(test)));

    if (cardContentsModel.learningContents) {
      cardContentsModel.learningContents.forEach((content) => {
        if (content.learningContentType === LearningContentType.Chapter) {
          const newChildren: LearningContentModel[] = [];

          content.children.forEach((cContent) => {
            newChildren.push(new LearningContentModel({ ...cContent }));
          });

          newChildren.length > 0 &&
            learningContents.push(new LearningContentModel({ ...content, children: newChildren }));
        } else {
          learningContents.push(new LearningContentModel({ ...content }));
        }
      });
    }

    return Object.assign(cardContentsQuery, {
      ...cardContentsModel,
      reportFileBox: new ReportFileBox(cardContentsModel.reportFileBox),
      hasPrerequisite: cardContentsModel.prerequisiteCards.length > 0 ? 'Yes' : 'No',
      learningPeriod: newDatePeriod,
      hasValidLearningDate: cardContentsModel.validLearningDate > 0,
      cardOperator,
      tests,
      learningContents,
      description,
      registrantName,
      pisAgreementTitle,
      pisAgreementDepotId,
    });
  }
}

decorate(CardContentsQueryModel, {
  terms: observable,
  learningContents: observable,
  restrictLearningPeriod: observable,
  learningPeriod: observable,
  cardOperator: observable,
  hasValidLearningDate: observable,
  hasPrerequisite: observable,
  prerequisiteCards: observable,
  validLearningDate: observable,
  description: observable,

  fileBoxId: observable,
  reportFileBox: observable,
  commentFeedbackId: observable,
  surveyId: observable,
  surveyCaseId: observable,
  surveyTitle: observable,
  surveyDesignerName: observable,
  // testId: observable,
  examTitle: observable,
  examAuthorName: observable,
  paperId: observable,
  tests: observable,
  registeredTime: observable,
  openRequests: observable,
  registrantName: observable,
  instructors: observable,

  communityId: observable,
  communityName: observable,
  email: observable,
  cardDiscussions: observable,

  pisAgreementRequired: observable,
  pisAgreementTitle: observable,
  pisAgreementDepotId: observable,
});
