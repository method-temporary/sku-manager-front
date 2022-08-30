import { action, observable } from 'mobx';

import { GroupBasedAccessRule, PolyglotModel, YesNo } from 'shared/model';
import { DEFAULT_LANGUAGE, LangSupport } from 'shared/components/Polyglot';

import { DifficultyLevel, PermittedCineroom } from '_data/lecture/cards/model/vo';

import { CardOperator, getInitCardOperator } from './basic/model/vo';
import { PreRequisiteCardWithInfo } from './basic/model/PreRequisiteCardWithInfo';
import { RelatedCardWithInfo } from './basic/model/RelatedCardWithInfo';
import { TestWithViewInfo } from './basic/model/TestWithViewInfo';
import { CardCategoryWithInfo, getInitCardCategoryWithInfo } from './basic/model/CardCategoryWithInfo';
import { StudentEnrollmentType } from '../../_data/lecture/cards/model/vo/StudentEnrollmentType';
import { CardWithAccessAndOptional } from '../shared/components/cardSelectModal/model/CardWithAccessAndOptional';
import { useState } from 'react';

class CardCreateStore {
  //
  static instance: CardCreateStore;

  @observable
  activeIndex: number = 0;

  @observable
  createLoading: boolean = false;

  @observable
  copyCard?: CardWithAccessAndOptional = undefined;

  @action.bound
  setCopyCard(copyCard: CardWithAccessAndOptional) {
    this.copyCard = copyCard;
  }

  @action.bound
  setCreateLoading(createLoading: boolean) {
    this.createLoading = createLoading;
  }

  // 기본 정보
  @observable
  langSupports: LangSupport[] = [DEFAULT_LANGUAGE]; // 지원 언어

  @observable
  searchable: YesNo = 'Yes'; // 공개 여부

  @observable
  name: PolyglotModel = new PolyglotModel(); // 카드명

  @observable
  simpleDescription: PolyglotModel = new PolyglotModel(); // 카드 표시 문구

  @observable
  description: PolyglotModel = new PolyglotModel(); // 카드 설명

  @observable
  mainCategory: CardCategoryWithInfo = getInitCardCategoryWithInfo(); // 메인 채널

  @observable
  subCategories: CardCategoryWithInfo[] = []; // 서브 채널

  @observable
  hasStamp: boolean = true; // Stamp 여부

  @observable
  stampCount: number = 1; // Stamp 수

  @observable
  hasPrerequisite: YesNo = 'No'; // 선수 Card 여부

  @observable
  cardOperator: CardOperator = getInitCardOperator(); // 관리자

  @observable
  difficultyLevel: DifficultyLevel = ''; // 난이도

  @observable
  mandatory: boolean = false; // 법정 의무 교육 여부

  @action.bound
  setActiveIndex(activeIndex: number) {
    this.activeIndex = activeIndex;
  }

  @action.bound
  setSearchable(searchable: YesNo) {
    this.searchable = searchable;
  }

  @action.bound
  setLangSupports(langSupports: LangSupport[]) {
    this.langSupports = langSupports;
  }

  @action.bound
  setName(name: PolyglotModel) {
    this.name = name;
  }

  @action.bound
  setSimpleDescription(simpleDescription: PolyglotModel) {
    this.simpleDescription = simpleDescription;
  }

  @action.bound
  setDescription(description: PolyglotModel) {
    this.description = description;
  }

  @action.bound
  setMainCategory(mainCategory: CardCategoryWithInfo) {
    this.mainCategory = mainCategory;
  }

  @action.bound
  setSubCategories(subCategories: CardCategoryWithInfo[]) {
    this.subCategories = subCategories;
  }

  @action.bound
  setHasStamp(hasStamp: boolean) {
    this.hasStamp = hasStamp;
  }

  @action.bound
  setStampCount(stampCount: number) {
    this.stampCount = stampCount || 0;
  }

  @action.bound
  setHasPrerequisite(hasPrerequisite: YesNo) {
    this.hasPrerequisite = hasPrerequisite;
  }

  @action.bound
  setCardOperator(cardOperator: CardOperator) {
    this.cardOperator = cardOperator;
  }

  @action.bound
  setDifficultyLevel(difficultyLevel: DifficultyLevel) {
    this.difficultyLevel = difficultyLevel;
  }

  @action.bound
  setMandatory(mandatory: boolean) {
    this.mandatory = mandatory;
  }

  // 노출정보
  @observable
  thumbnailImagePath: string = ''; // 썸네일

  @observable
  permittedCinerooms: PermittedCineroom[] = []; // 적용 범위 설정 Model

  @observable
  tags: PolyglotModel = new PolyglotModel(); // 태그

  @action.bound
  setPermittedCinerooms(permittedCinerooms: PermittedCineroom[]) {
    this.permittedCinerooms = permittedCinerooms;
  }

  @action.bound
  setThumbnailImagePath(thumbnailImagePath: string) {
    this.thumbnailImagePath = thumbnailImagePath;
  }

  @action.bound
  setTags(tags: PolyglotModel) {
    this.tags = tags;
  }

  // 접근 제어 정보
  @observable
  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule(); // 접근 제어

  @action.bound
  setGroupBasedAccessRule(groupBasedAccessRule: GroupBasedAccessRule) {
    this.groupBasedAccessRule = groupBasedAccessRule;
  }

  // 선수 카드
  @observable
  prerequisiteCards: PreRequisiteCardWithInfo[] = []; // 선수 Card

  @action.bound
  setPrerequisiteCards(prerequisiteCards: PreRequisiteCardWithInfo[]) {
    this.prerequisiteCards = prerequisiteCards;
  }

  // 부가 정보

  @observable
  fileBoxId: string = ''; // 교육자료

  @observable
  relatedCards: RelatedCardWithInfo[] = []; // 관련 과정

  @observable
  pisAgreementRequired: boolean = false; // 서약 진행 여부

  @observable
  pisAgreementTitle: PolyglotModel = new PolyglotModel(); // 서약명

  @observable
  pisAgreementDepotId: PolyglotModel = new PolyglotModel(); // 서약서 fileId

  @observable
  communityId: string = ''; // 커뮤니티 Id

  @observable
  communityName: string = ''; // 커뮤니티 명

  @action.bound
  setFileBoxId(fileBoxId: string) {
    this.fileBoxId = fileBoxId;
  }

  @action.bound
  setRelatedCards(relatedCards: RelatedCardWithInfo[]) {
    this.relatedCards = relatedCards;
  }

  @action.bound
  setPisAgreementRequired(pisAgreementRequired: boolean) {
    this.pisAgreementRequired = pisAgreementRequired;
  }

  @action.bound
  setPisAgreementTitle(pisAgreementTitle: PolyglotModel) {
    this.pisAgreementTitle = pisAgreementTitle;
  }

  @action.bound
  setPisAgreementDepotId(pisAgreementDepotId: PolyglotModel) {
    this.pisAgreementDepotId = pisAgreementDepotId;
  }

  @action.bound
  setCommunityId(communityId: string) {
    this.communityId = communityId;
  }

  @action.bound
  setCommunityName(communityName: string) {
    this.communityName = communityName;
  }

  // Report / Survey / Test
  @observable
  report: boolean = false;

  @observable
  reportName: PolyglotModel = new PolyglotModel();

  @observable
  reportQuestion: PolyglotModel = new PolyglotModel();

  @observable
  reportFileBoxId: string = '';

  @observable
  surveyId: string = '';

  @observable
  surveyCaseId: string = '';

  @observable
  surveyTitle: string = '';

  @observable
  surveyDesignerName: string = '';

  @observable
  tests: TestWithViewInfo[] = [];

  @action.bound
  setReport(report: boolean) {
    this.report = report;
  }

  @action.bound
  setReportName(reportName: PolyglotModel) {
    this.reportName = reportName;
  }

  @action.bound
  setReportQuestion(reportQuestion: PolyglotModel) {
    this.reportQuestion = reportQuestion;
  }

  @action.bound
  setReportFileBoxId(reportFileBoxId: string) {
    this.reportFileBoxId = reportFileBoxId;
  }

  @action.bound
  setSurveyId(surveyId: string) {
    this.surveyId = surveyId;
  }

  @action.bound
  setSurveyCaseId(surveyCaseId: string) {
    this.surveyCaseId = surveyCaseId;
  }

  @action.bound
  setSurveyTitle(surveyTitle: string) {
    this.surveyTitle = surveyTitle;
  }

  @action.bound
  setSurveyDesignerName(surveyDesignerName: string) {
    this.surveyDesignerName = surveyDesignerName;
  }

  @action.bound
  setTests(tests: TestWithViewInfo[]) {
    this.tests = tests;
  }

  @action.bound
  reset() {
    this.activeIndex = 0;
    this.langSupports = [DEFAULT_LANGUAGE]; // 지원 언어
    this.searchable = 'Yes'; // 공개 여부
    this.name = new PolyglotModel(); // 카드명
    this.simpleDescription = new PolyglotModel(); // 카드 표시 문구
    this.description = new PolyglotModel(); // 카드 설명
    this.mainCategory = getInitCardCategoryWithInfo(); // 메인 채널
    this.subCategories = []; // 서브 채널
    this.hasStamp = true; // Stamp 여부
    this.stampCount = 1; // Stamp 수
    this.hasPrerequisite = 'No'; // 선수 Card 여부
    this.cardOperator = getInitCardOperator(); // 관리자
    this.difficultyLevel = ''; // 난이도
    this.mandatory = false;
    this.thumbnailImagePath = ''; // 썸네일
    this.permittedCinerooms = []; // 적용 범위 설정 Model
    this.tags = new PolyglotModel(); // 태그
    this.groupBasedAccessRule = new GroupBasedAccessRule(); // 접근 제어
    this.prerequisiteCards = []; // 선수 Card
    this.fileBoxId = ''; // 교육자료
    this.relatedCards = []; // 관련 과정
    this.pisAgreementRequired = false; // 서약 진행 여부
    this.pisAgreementTitle = new PolyglotModel(); // 서약명
    this.pisAgreementDepotId = new PolyglotModel(); // 서약서 fileId
    this.communityId = ''; // 커뮤니티 Id
    this.communityName = ''; // 커뮤니티 명
    this.report = false;
    this.reportName = new PolyglotModel();
    this.reportQuestion = new PolyglotModel();
    this.reportFileBoxId = '';
    this.surveyId = '8460bf79-12d2-4c1e-9051-a0acab151c83';
    this.surveyCaseId = 'default';
    this.surveyTitle = '';
    this.surveyDesignerName = '';
    this.tests = [];
  }
}

CardCreateStore.instance = new CardCreateStore();
export default CardCreateStore;
