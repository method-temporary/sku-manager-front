import {
  CardCategory,
  NewDatePeriod,
  PermittedCineroom,
  GroupBasedAccessRule,
  IconType,
  PolyglotModel,
  ReportFileBox,
} from 'shared/model';
import { LangSupport, langSupportCdo } from 'shared/components/Polyglot';

import { PrerequisiteCard, LearningContentModel } from '_data/lecture/cards/model/vo';

import { yesNoToBoolean } from '../ui/logic/CardHelper';
import { CardQueryModel } from './CardQueryModel';
import { DifficultyLevel } from './vo/DifficultyLevel';
import { CardContentsQueryModel } from './CardContentsQueryModel';
import CardInstructorsModel from './vo/CardInstructorsModel';
import Discussion from '../../../discussion/model/Discussion';
import { TestModel } from './vo/TestModel';
import { CardRelatedCardModel } from '../../../_data/lecture/cards/model/vo/CardRelatedCardModel';

export class CardCdo {
  //
  // CardQueryModel
  categories: CardCategory[] = [];
  name: PolyglotModel = new PolyglotModel();
  stampCount: number = 0;
  prerequisiteCards: PrerequisiteCard[] = [];

  thumbImagePath: string = '';
  thumbnailImagePath: string = '';
  searchable: boolean = true;
  permittedCinerooms: PermittedCineroom[] = [];
  tags: PolyglotModel = new PolyglotModel();

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  simpleDescription: PolyglotModel = new PolyglotModel(); // Card 표시 문구
  description: PolyglotModel = new PolyglotModel(); // Card 소개

  difficultyLevel: DifficultyLevel = DifficultyLevel.Empty; // 난이도

  // CardContentsModel
  communityId: string = '';

  learningContents: LearningContentModel[] = [];
  restrictLearningPeriod: boolean = false;
  learningPeriod: NewDatePeriod = new NewDatePeriod(new NewDatePeriod()); // 교육 기간
  validLearningDate: number | null = 0; // 유효 학습 시간
  additionalLearningTime: number = 0; // 추가 학습 시간
  fileBoxId: string = ''; // Course Material

  cardOperator: string = ''; // 관리자

  reportFileBox: ReportFileBox = new ReportFileBox(); // 레포트
  surveyId: string = ''; // 설문
  tests: TestModel[] = []; // 테스트

  instructors: CardInstructorsModel[] = [];
  relatedCards: CardRelatedCardModel[] = [];

  cardDiscussions: Discussion[] = [];

  langSupports: LangSupport[] = [];

  pisAgreementRequired: boolean = false;
  pisAgreementTitle: PolyglotModel = new PolyglotModel();
  pisAgreementDepotId: PolyglotModel = new PolyglotModel();

  static asCardCdo(cardQuery: CardQueryModel, cardContentsQuery: CardContentsQueryModel): CardCdo {
    //
    let thumbImagePath = '';

    if (cardQuery.thumbImagePath === '') {
      cardQuery.iconType === IconType.SKUniversity
        ? (thumbImagePath = cardQuery.iconPath)
        : (thumbImagePath = cardQuery.fileIconPath);
    } else {
      thumbImagePath = cardQuery.thumbImagePath;
    }

    return {
      // CardQueryModel
      categories: cardQuery.categories,
      name: cardQuery.name,
      stampCount: cardQuery.stampReady ? cardQuery.stampCount : 0,
      thumbImagePath,
      thumbnailImagePath: cardQuery.thumbnailImagePath,
      searchable: yesNoToBoolean(cardQuery.searchable),
      permittedCinerooms: cardQuery.permittedCinerooms,
      tags: cardQuery.tags,
      simpleDescription: cardQuery.simpleDescription,
      difficultyLevel: cardQuery.difficultyLevel,
      groupBasedAccessRule: cardQuery.groupBasedAccessRule,
      additionalLearningTime: cardQuery.additionalLearningTime,
      langSupports: langSupportCdo(cardQuery.langSupports),

      // CardContentsModel
      communityId: cardContentsQuery.communityId,
      description: cardContentsQuery.description,
      prerequisiteCards: cardContentsQuery.hasPrerequisite === 'Yes' ? cardContentsQuery.prerequisiteCards : [],
      learningContents: cardContentsQuery.learningContents,
      restrictLearningPeriod: cardContentsQuery.restrictLearningPeriod,
      learningPeriod: new NewDatePeriod(cardContentsQuery.learningPeriod),
      fileBoxId: cardContentsQuery.fileBoxId,
      validLearningDate: cardContentsQuery.hasValidLearningDate ? cardContentsQuery.validLearningDate : null,
      cardOperator: cardContentsQuery.cardOperator.id,
      reportFileBox: cardContentsQuery.reportFileBox,
      surveyId: cardContentsQuery.surveyId,
      tests: cardContentsQuery.tests,
      relatedCards: cardContentsQuery.relatedCards,
      instructors: cardContentsQuery.instructors,
      cardDiscussions: cardContentsQuery.cardDiscussions,
      pisAgreementRequired: cardContentsQuery.pisAgreementRequired,
      pisAgreementTitle: cardContentsQuery.pisAgreementTitle,
      pisAgreementDepotId: cardContentsQuery.pisAgreementDepotId,
    };
  }
}
