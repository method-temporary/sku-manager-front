import { decorate, observable } from 'mobx';

import {
  CardCategory,
  NewDatePeriod,
  PermittedCineroom,
  GroupBasedAccessRule,
  PolyglotModel,
  ReportFileBox,
} from 'shared/model';

import { RelatedCard, PrerequisiteCard, InstructorInCard, getInitInstructor } from '_data/lecture/cards/model/vo';
import { DifficultyLevel } from './vo/DifficultyLevel';
import { LearningContentSdo } from './vo/LearningContentSdo';
import { TestModel } from './vo/TestModel';

export class CardSdo {
  //
  name: PolyglotModel = new PolyglotModel();
  thumbImagePath: string = '';
  stampCount: number = 0;
  description: PolyglotModel = new PolyglotModel();
  searchable: boolean = true;
  tags: PolyglotModel = new PolyglotModel();
  difficultyLevel: DifficultyLevel = DifficultyLevel.Basic;
  categories: CardCategory[] = [];
  permittedCinerooms: PermittedCineroom[] = [];
  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  learningPeriod: NewDatePeriod = new NewDatePeriod();
  surveyId: string = '';
  instructors: InstructorInCard = getInitInstructor();
  tests: TestModel[] = [];
  relatedCards: RelatedCard[] = [];
  cardOperator: string = '';
  reportFileBox: ReportFileBox = new ReportFileBox();
  learningContents: LearningContentSdo[] = [];
  prerequisiteCards: PrerequisiteCard[] = [];
  additionalLearningTime: number = 0;
  validLearningDate: number = 0;

  constructor(cardSdo?: CardSdo) {
    //
    if (cardSdo) {
      Object.assign(this, { ...cardSdo });
    }
  }
}

decorate(CardSdo, {
  name: observable,
  thumbImagePath: observable,
  stampCount: observable,
  description: observable,
  searchable: observable,
  tags: observable,
  difficultyLevel: observable,
  categories: observable,
  permittedCinerooms: observable,
  groupBasedAccessRule: observable,

  learningPeriod: observable,
  surveyId: observable,
  instructors: observable,
  tests: observable,
  relatedCards: observable,
  cardOperator: observable,
  reportFileBox: observable,
  learningContents: observable,
  prerequisiteCards: observable,
  additionalLearningTime: observable,
});
