import { decorate, observable } from 'mobx';
import { DenizenKey } from '@nara.platform/accent';

import {
  PatronKey,
  PolyglotModel,
  CardCategory,
  PermittedCineroom,
  GroupBasedAccessRule,
  DramaEntityObservableModel,
} from 'shared/model';

import { DEFAULT_LANGUAGE, LangSupport } from 'shared/components/Polyglot';

import { CardStates } from '../../../_data/lecture/cards/model/vo/CardStates';
import { DifficultyLevel } from './vo/DifficultyLevel';
import { CardRelatedCount } from './vo/CardRelatedCount';
import { CardType } from './vo/CardType';
import { CardSdo } from './CardSdo';
import { Instructor } from 'cube/cube';

export class CardModel extends DramaEntityObservableModel {
  //
  name: PolyglotModel = new PolyglotModel(); // Card 명
  type: CardType = CardType.DEFAULT;
  thumbImagePath: string = ''; // 아이콘 경로
  thumbnailImagePath: string = ''; //썸네일 이미지 경로
  stampCount: number = 0; // stamp - > 0 있다고 판단
  simpleDescription: PolyglotModel = new PolyglotModel();
  difficultyLevel: DifficultyLevel = DifficultyLevel.Empty; // 난이도
  searchable: boolean = true; // 공개여부
  tags: PolyglotModel = new PolyglotModel(); // Tag 들
  // type: string = ''; // Card 타입

  categories: CardCategory[] = []; // Channel
  permittedCinerooms: PermittedCineroom[] = []; // 선수 Card 들
  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule(); // 접근 제어

  learningTime: number = 0; // 수업시간
  additionalLearningTime: number = 0;
  cardState: CardStates = CardStates.Empty; // Card 제공 상태
  cardStateModifiedTime: number = 0; // Card 제공상태 변경 시간
  cardRelatedCount: CardRelatedCount = new CardRelatedCount(); //
  //
  selected: boolean = false;
  accessible: boolean = true;

  // Rdo Field
  hasStamp: string = ''; // Stamp 획득여부
  collegeId: string = ''; // college Id

  patronKey: DenizenKey = new PatronKey();

  // languages: string[] = [];
  // defaultLanguage: string = '';
  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  constructor(cardModel?: CardModel) {
    //
    super();
    if (cardModel) {
      const groupBasedAccessRule = new GroupBasedAccessRule(cardModel.groupBasedAccessRule);
      const name = cardModel.name && new PolyglotModel(cardModel.name);
      const tags = cardModel.tags && new PolyglotModel(cardModel.tags);
      const simpleDescription = cardModel.simpleDescription && new PolyglotModel(cardModel.simpleDescription);

      const langSupports =
        cardModel.langSupports.map((langSupport) => new LangSupport(langSupport)) || this.langSupports;
      Object.assign(this, { ...cardModel, groupBasedAccessRule, name, tags, simpleDescription, langSupports });
    }
  }

  static isBlank(cardModel: CardModel): string {
    if (!cardModel.categories.some((target) => target.mainCategory)) return '메인 채널';
    if (!cardModel.categories.some((channel) => channel.channelId)) return '채널';
    if (!cardModel.categories.some((college) => college.collegeId)) return '카테고리';

    return 'success';
  }
}

decorate(CardModel, {
  name: observable,
  thumbImagePath: observable,
  stampCount: observable,
  simpleDescription: observable,
  difficultyLevel: observable,
  searchable: observable,
  tags: observable,
  type: observable,

  categories: observable,
  permittedCinerooms: observable,
  groupBasedAccessRule: observable,

  learningTime: observable,
  cardState: observable,
  cardStateModifiedTime: observable,
  cardRelatedCount: observable,

  selected: observable,
  accessible: observable,

  // languages: observable,
  // defaultLanguage: observable,
  langSupports: observable,
});
