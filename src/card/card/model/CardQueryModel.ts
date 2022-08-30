import { decorate, observable } from 'mobx';

import { PatronKey } from '@nara.platform/accent/src/snap/index';

import {
  PageModel,
  QueryModel,
  CardCategory,
  PermittedCineroom,
  GroupBasedAccessRule,
  IconType,
  PolyglotModel,
} from 'shared/model';

import { DEFAULT_LANGUAGE, LangSupport } from 'shared/components/Polyglot';
import { booleanToYesNo, yesNoToBoolean } from '../ui/logic/CardHelper';

import CardRdo from '../../../_data/lecture/cards/model/CardRdo';
import { CardModel } from './CardModel';

import { CardAdminRdo } from './CardAdminRdo';
import { CardStates } from '../../../_data/lecture/cards/model/vo';
import { DifficultyLevel } from './vo/DifficultyLevel';

export class CardQueryModel extends QueryModel {
  //
  // 검색조건
  collegeId: string = '';
  channelId: string = '';
  searchCardState: CardStates = CardStates.All;
  searchSearchable: string = ''; // 공개 / 비공개
  creatorName: string = '';
  cineroomId: string = '';
  hasStamp: string = ''; // Stamp 획득 여부
  cardType: string = '';
  mainCategoryOnly: boolean = false;

  cardStateModifiedTime: number = 0;

  // Basic Information
  // 메인 채널, 서브 채널
  cardState: CardStates = CardStates.Empty;
  mainCategory: CardCategory = new CardCategory();
  subCategoryIds: string[] = [];
  subCategories: CardCategory[] = [];
  categories: CardCategory[] = [];
  name: PolyglotModel = new PolyglotModel(); // 카드명
  stampReady: boolean = true;
  stampCount: number = 1;

  fileName: string = '';
  iconType: IconType = IconType.SKUniversity;
  iconGroupId: string = '';
  iconPath: string = '';
  fileIconPath: string = '';
  thumbImagePath: string = '';
  thumbnailImagePath: string = '';
  searchable: string = 'Yes'; // 공개 / 비공개
  permittedRequireCineroomsIds: string[] = []; // 적용 범위 설정 Ids
  permittedCinerooms: PermittedCineroom[] = []; // 적용 범위 설정 Models
  tags: PolyglotModel = new PolyglotModel(); // 태그

  simpleDescription: PolyglotModel = new PolyglotModel(); // Card 표시 문구
  difficultyLevel: DifficultyLevel = DifficultyLevel.Empty; // 난이도

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  additionalLearningTime: number = 0; // 추가 학습 시간

  count: number = 20;
  lastN: number = 60;
  patronKey: PatronKey = {} as PatronKey;

  sharedOnly: boolean = false;

  ruleStrings: string = '';
  accessRule: number[] = [];
  learningTime: number = 0; // 총 Cube 학습 시간

  // languages: string[] = [];
  // defaultLanguage: string = '';

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  isAll: boolean = false;
  isRequiredAll: boolean = false;

  constructor(cardQueryModel?: CardQueryModel) {
    super();
    if (cardQueryModel) {
      const name = (cardQueryModel.name && new PolyglotModel(cardQueryModel.name)) || this.name;
      const tags = (cardQueryModel.tags && new PolyglotModel(cardQueryModel.tags)) || this.tags;
      const simpleDescription =
        (cardQueryModel.simpleDescription && new PolyglotModel(cardQueryModel.simpleDescription)) ||
        this.simpleDescription;
      const langSupports = cardQueryModel.langSupports.map((target) => new LangSupport(target));

      Object.assign(this, { ...cardQueryModel, name, tags, simpleDescription, langSupports });
    }
  }

  static asCardRdo(cardQueryModel: CardQueryModel, pageModel: PageModel): CardRdo {
    //
    return {
      offset: pageModel.offset,
      limit: pageModel.limit,
      cardOrderBy: pageModel.sortFilter,
      name: cardQueryModel.searchPart === '과정명' ? cardQueryModel.searchWord : '',
      registrantName: cardQueryModel.searchPart === '생성자' ? cardQueryModel.searchWord : '',
      collegeId: cardQueryModel.channelId || cardQueryModel.collegeId === '전체' ? '' : cardQueryModel.collegeId,
      channelId: cardQueryModel.channelId,
      mainCategoryOnly: !cardQueryModel.mainCategoryOnly,
      startDate: cardQueryModel.period.startDateLong,
      endDate: cardQueryModel.period.endDateLong,
      hasStamp:
        cardQueryModel.hasStamp === '전체' || cardQueryModel.hasStamp === ''
          ? undefined
          : yesNoToBoolean(cardQueryModel.hasStamp),
      cardState: cardQueryModel.searchCardState === CardStates.All ? CardStates.Empty : cardQueryModel.searchCardState,
      searchable: cardQueryModel.searchSearchable === '' ? undefined : cardQueryModel.searchSearchable === 'SearchOn',
      sharedOnly: cardQueryModel.sharedOnly,
      userGroupSequences: cardQueryModel.accessRule.map((sequence) => sequence),
      cardType: cardQueryModel.cardType === '전체' ? '' : cardQueryModel.cardType,
    };
  }

  static asCardApprovalRdo(cardQueryModel: CardQueryModel, pageModel: PageModel): CardRdo {
    //
    return {
      offset: pageModel.offset,
      limit: pageModel.limit,
      cardOrderBy: pageModel.sortFilter,
      name: cardQueryModel.searchPart === '과정명' ? cardQueryModel.searchWord : '',
      registrantName: cardQueryModel.searchPart === '생성자' ? cardQueryModel.searchWord : '',
      collegeId: cardQueryModel.channelId || cardQueryModel.collegeId === '전체' ? '' : cardQueryModel.collegeId,
      channelId: cardQueryModel.channelId,
      startDate: cardQueryModel.period.startDateLong,
      endDate: cardQueryModel.period.endDateLong,
      hasStamp:
        cardQueryModel.hasStamp === '전체' || cardQueryModel.hasStamp === ''
          ? undefined
          : yesNoToBoolean(cardQueryModel.hasStamp),
      cardState:
        cardQueryModel.searchCardState === CardStates.All
          ? [CardStates.Opened, CardStates.OpenApproval, CardStates.Rejected]
          : cardQueryModel.searchCardState,
      searchable:
        cardQueryModel.searchSearchable === '전체' || cardQueryModel.searchSearchable === ''
          ? undefined
          : cardQueryModel.searchSearchable === 'SearchOn',
      sharedOnly: cardQueryModel.sharedOnly,
      userGroupSequences: cardQueryModel.accessRule.map((sequence) => sequence),
      cardType: cardQueryModel.cardType,
      mainCategoryOnly: false,
    };
  }

  static asCardAdminRdo(cardQueryModel: CardQueryModel, pageModel: PageModel): CardAdminRdo {
    //

    return {
      offset: pageModel.offset,
      limit: pageModel.limit,

      name: cardQueryModel.searchPart === '과정명' ? cardQueryModel.searchWord : '',
      registrantName: cardQueryModel.searchPart === '생성자' ? cardQueryModel.searchWord : '',
      cineroomId: cardQueryModel.cineroomId,
      collegeId: cardQueryModel.channelId || cardQueryModel.collegeId === '전체' ? '' : cardQueryModel.collegeId,
      channelId: cardQueryModel.channelId,
      startDate: cardQueryModel.period.startDateLong,
      endDate: cardQueryModel.period.endDateLong,
      sharedOnly: cardQueryModel.sharedOnly,
      searchable:
        cardQueryModel.searchSearchable === '' || cardQueryModel.searchSearchable === '전체'
          ? undefined
          : cardQueryModel.searchSearchable === '1',
    };
  }

  static asCardQueryByCardModel(cardModel: CardModel, cineroomId: string): CardQueryModel {
    //
    const cardQuery = new CardQueryModel();

    const name = cardModel.name && new PolyglotModel(cardModel.name);
    const tags = cardModel.tags && new PolyglotModel(cardModel.tags);
    const simpleDescription = cardModel.simpleDescription && new PolyglotModel(cardModel.simpleDescription);

    const langSupports = cardModel.langSupports.map((target) => new LangSupport(target));

    const mySUNI = cardModel.permittedCinerooms.find((cineroom) => cineroom.cineroomId === cineroomId);

    const isAll = !!mySUNI;
    const isRequiredAll = mySUNI ? mySUNI.required : false;

    return Object.assign(cardQuery, {
      ...cardModel,
      permittedRequireCineroomsIds: cardModel.permittedCinerooms.map((cinerooms) => cinerooms.cineroomId),
      searchable: booleanToYesNo(cardModel.searchable),
      name,
      tags,
      simpleDescription,
      langSupports,
      isAll,
      isRequiredAll,
    });
  }

  static asClearWithOutSearchProps(cardQuery: CardQueryModel): CardQueryModel {
    //
    const newCardQuery = new CardQueryModel();

    return {
      ...newCardQuery,
      collegeId: cardQuery.collegeId,
      channelId: cardQuery.channelId,
      searchCardState: cardQuery.searchCardState,
      searchSearchable: cardQuery.searchSearchable,
      hasStamp: cardQuery.hasStamp,
      period: cardQuery.period,
      searchPart: cardQuery.searchPart,
      searchWord: cardQuery.searchWord,
    };
  }
}

decorate(CardQueryModel, {
  collegeId: observable,
  channelId: observable,
  searchCardState: observable,
  searchSearchable: observable,
  cardType: observable,
  creatorName: observable,
  cineroomId: observable,
  hasStamp: observable,
  mainCategoryOnly: observable,
  cardStateModifiedTime: observable,
  cardState: observable,
  mainCategory: observable,
  subCategoryIds: observable,
  subCategories: observable,
  categories: observable,
  name: observable,
  stampReady: observable,
  stampCount: observable,
  fileName: observable,
  iconGroupId: observable,
  iconType: observable,
  thumbImagePath: observable,
  iconPath: observable,
  fileIconPath: observable,
  searchable: observable,
  permittedRequireCineroomsIds: observable,
  permittedCinerooms: observable,
  tags: observable,
  simpleDescription: observable,
  difficultyLevel: observable,
  groupBasedAccessRule: observable,
  additionalLearningTime: observable,
  count: observable,
  lastN: observable,
  patronKey: observable,
  sharedOnly: observable,
  ruleStrings: observable,
  accessRule: observable,
  learningTime: observable,

  // languages: observable,
  // defaultLanguage: observable,
  langSupports: observable,
  isAll: observable,
  isRequiredAll: observable,
});
