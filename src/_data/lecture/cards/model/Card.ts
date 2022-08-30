import { CardState, CardType, DifficultyLevel, PermittedCineroom } from './vo';
import { CardCategory, GroupBasedAccessRule, PatronKey, PolyglotModel } from 'shared/model';
import { LangSupport } from 'shared/components/Polyglot';
import { StudentEnrollmentType } from './vo/StudentEnrollmentType';

export default interface Card {
  //
  id: string;
  patronKey: PatronKey;

  langSupports: LangSupport[];
  name: PolyglotModel;
  type: CardType;
  // thumbImagePath: string;
  thumbnailImagePath: string;
  stampCount: number;
  simpleDescription: PolyglotModel;
  additionalLearningTime: number;
  difficultyLevel: DifficultyLevel;
  searchable: boolean;
  tags: PolyglotModel;
  categories: CardCategory[];
  permittedCinerooms: PermittedCineroom[];
  learningTime: number;
  cardState: CardState;
  cardStateModifiedTime: number;

  paid: boolean;

  studentEnrollmentType: StudentEnrollmentType;

  groupBasedAccessRule: GroupBasedAccessRule;

  mainCategory: CardCategory;
  opened: boolean;
}

export function getInitCard(): Card {
  return {
    additionalLearningTime: 0,
    cardState: '',
    cardStateModifiedTime: 0,
    categories: [],
    difficultyLevel: '',
    groupBasedAccessRule: new GroupBasedAccessRule(),
    id: '',
    langSupports: [],
    learningTime: 0,
    mainCategory: new CardCategory(),
    name: new PolyglotModel(),
    opened: false,
    paid: false,
    patronKey: new PatronKey(),
    permittedCinerooms: [],
    searchable: false,
    simpleDescription: new PolyglotModel(),
    stampCount: 0,
    tags: new PolyglotModel(),
    // thumbImagePath: '',
    thumbnailImagePath: '',
    studentEnrollmentType: 'Anyone',
    type: '',
  };
}
