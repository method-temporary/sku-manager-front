import { autobind } from '@nara.platform/accent';
import { action, observable, runInAction } from 'mobx';
import _ from 'lodash';

import { PageModel, GroupBasedAccessRule, PolyglotModel } from 'shared/model';

import CardApi from '../apiclient/CardApi';

import { CardCdo } from '../../model/CardCdo';
import { CardAdminRdo } from '../../model/CardAdminRdo';
import { CardQueryModel } from '../../model/CardQueryModel';
import { CardWithContents } from '../../model/CardWithContents';
import { CardRejectedModel } from '../../model/CardRejectedModel';
import { CardContentsQueryModel } from '../../model/CardContentsQueryModel';
import { CardWithAccessRuleResult } from '../../model/CardWithAccessRuleResult';
import { LearningContentModel } from '../../../../_data/lecture/cards/model/vo';
import { CardCount } from '../../model/vo/CardCount';
import { CardOperatorIdentity } from '../../model/vo/CardOperatorIdentity';
import { CardPolyglotUdo } from '../../../../_data/lecture/cards/model/CardPolyglotUdo';
import { CardDuplicateRdo } from '../../model/vo/CardDuplicateRdo';

@autobind
class CardService {
  //
  static instance: CardService;

  cardApi: CardApi;

  @observable
  cardId: string = '';

  @observable
  cardWithContents: CardWithContents = new CardWithContents();

  @observable
  cardsWithAccessRule: CardWithAccessRuleResult[] = []; // Modal에서 조회한 card 목록 관리

  @observable
  cards: CardWithContents[] = []; // 부모 클래스에서 유지하는 card 목록 관리

  @observable
  relatedCardsResetIds: string[] = [];

  @observable
  cardsForExcel: CardWithContents[] = []; // ExcelDown 용 Card 목록

  @observable
  cardsApprovals: CardWithContents[] = []; // 부모 클래스에서 유지하는 card 목록 관리

  @observable
  selectedCards: CardWithContents[] = []; // Modal에서 선택한 card 목록 관리

  @observable
  singleSelectedCard: CardWithContents = new CardWithContents(); // Modal에서 선택한 단일 card 관리

  @observable
  selectedCardByCube: CardWithContents = new CardWithContents();

  @observable
  relatedCards: CardWithContents[] = []; // 관련 과정 Card 목록

  @observable
  prerequisiteCards: CardWithContents[] = []; // 선수 Card 목록

  @observable
  cardQuery: CardQueryModel = new CardQueryModel(); // card를 조회하기 위한 QM

  @observable
  cardContentsQuery: CardContentsQueryModel = new CardContentsQueryModel(); // cardContents QM

  @observable
  modalCardQuery: CardQueryModel = new CardQueryModel(); // Modal Card 조회 QM

  @observable
  relatedCardQuery: CardQueryModel = new CardQueryModel(); // Related Card 조회 QM

  @observable
  prerequisiteCardQuery: CardQueryModel = new CardQueryModel(); // 선수 Card 조회 QM

  @observable
  chapters: LearningContentModel[] = [];

  @observable
  chapterNames: PolyglotModel[] = [];

  @observable
  chapterDescriptions: PolyglotModel[] = [];

  @observable
  learningContents: LearningContentModel[] = [];

  @observable
  cardReacted: CardRejectedModel = new CardRejectedModel();

  @observable
  cardSearchQuery: CardQueryModel = new CardQueryModel();

  @observable
  cardApprovalSearchQuery: CardQueryModel = new CardQueryModel();

  @observable
  cardCount: CardCount = new CardCount();

  @observable
  cardApprovalCount: CardCount = new CardCount();

  @observable
  cardPolyglotUdos: CardPolyglotUdo[] = [];

  constructor(cardApi: CardApi) {
    this.cardApi = cardApi;
  }

  @action
  async findCards(pageModel: PageModel) {
    //
    const cards = await this.cardApi.findAdminCards(CardQueryModel.asCardRdo(this.cardSearchQuery, pageModel));

    runInAction(() => {
      this.cards = cards.results.map((cardWiths) => new CardWithContents(cardWiths));
    });

    return cards.totalCount;
  }

  @action
  async findAllCardsForExcel() {
    const cards = await this.cardApi.findAdminCards(
      CardQueryModel.asCardRdo(this.cardSearchQuery, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.cardsForExcel = cards.results;
    });
  }

  @action
  async findApprovalCards(pageModel: PageModel) {
    //
    const cardsApprovals = await this.cardApi.findAdminCards(
      CardQueryModel.asCardApprovalRdo(this.cardApprovalSearchQuery, pageModel)
    );

    runInAction(() => {
      this.cardsApprovals = cardsApprovals.results;
    });

    return cardsApprovals.totalCount;
  }

  @action
  async findCardsByRdo(cardRdo: CardAdminRdo, groupAccessRoles: GroupBasedAccessRule): Promise<number> {
    //
    const offsetElementList = await this.cardApi.findByRdoForAdmin(cardRdo, groupAccessRoles);

    runInAction(() => {
      this.cardsWithAccessRule = offsetElementList.results.map((card) => new CardWithAccessRuleResult(card));
    });
    return offsetElementList.totalCount;
  }

  @action
  async findCardIgnoringAccessibilityByQdoForAdmin(
    cardRdo: CardAdminRdo,
    groupAccessRoles: GroupBasedAccessRule
  ): Promise<number> {
    //
    const offsetElementList = await this.cardApi.findCardIgnoringAccessibilityByQdoForAdmin(cardRdo, groupAccessRoles);

    runInAction(() => {
      this.cardsWithAccessRule = offsetElementList.results.map((card) => new CardWithAccessRuleResult(card));
    });
    return offsetElementList.totalCount;
  }

  @action
  async findCardsByIds(cardIds: string[]): Promise<CardWithContents[]> {
    //
    const cards = await this.cardApi.findCardsForAdmin(cardIds);
    runInAction(() => {
      this.cards = cards.map((card) => new CardWithContents(card));
    });
    return cards;
  }

  @action
  async findByCubeId(cubeId: string): Promise<CardWithContents[]> {
    //
    const cards = await this.cardApi.findByCubeIdForAdmin(cubeId);
    runInAction(() => {
      this.cards = cards.map((card) => new CardWithContents(card));
    });
    return cards;
  }

  @action
  async findCardsForAdminByIds(cardIds: string[]): Promise<CardWithContents[]> {
    //
    const cards = await this.cardApi.findCardsForAdmin(cardIds);

    const newCards: CardWithContents[] = [];
    runInAction(() => {
      cardIds &&
        cardIds.forEach((id) => {
          cards &&
            cards.forEach((cardWiths) => {
              if (cardWiths.card.id === id) {
                newCards.push(new CardWithContents(cardWiths));
              }
            });
        });

      // this.cards = cards.map((card) => new CardWithContents(card));
      this.cards = newCards;
    });

    return newCards;
  }

  @action
  setCards(cards: CardWithContents[]): void {
    //
    this.cards = [...cards];
  }

  @action
  async findCardById(cardId: string, cineroomId: string = 'me1-n2-c2') {
    //
    const cardWithContents = await this.cardApi.findCard(cardId);

    runInAction(() => {
      // this.cardWithContents = card;
      this.cardId = cardWithContents.card.id;
      this.cardQuery = CardQueryModel.asCardQueryByCardModel(cardWithContents.card, cineroomId);
      this.cardContentsQuery = CardContentsQueryModel.asCardContentsByCardContentsModel(
        cardWithContents.cardContents,
        new CardOperatorIdentity(cardWithContents.cardOperatorIdentity)
      );
    });

    return cardWithContents;
  }

  @action
  async findLastNApproved(lastN: number): Promise<CardWithContents[]> {
    //
    const cards = await this.cardApi.findLastNApprovedForAdmin(lastN);

    runInAction(() => {
      this.cards = cards.map((card) => new CardWithContents(card));
    });
    return cards;
  }

  @action
  async findTopNStudentPassedCardsByLastDay(topN: number, lastDay: number): Promise<CardWithContents[]> {
    //
    const cards = await this.cardApi.findTopNStudentPassedCardsByLastDayForAdmin(topN, lastDay);

    runInAction(() => {
      this.cards = cards.map((card) => new CardWithContents(card));
    });
    return cards;
  }

  @action
  async findCardRelatedCounts() {
    //
    const ids = this.cards.map((cardWithContents) => cardWithContents.card.id);

    const cardRelatedCounts = await this.cardApi.findCardRelatedCounts(ids);

    runInAction(() => {
      cardRelatedCounts &&
        cardRelatedCounts.forEach((cardRelatedCount) => {
          const index = ids.indexOf(cardRelatedCount.id, 0);
          if (index > -1) {
            this.cards = _.set(this.cards, `[${index}].card.cardRelatedCount`, cardRelatedCount);
          }
        });
    });
  }

  @action
  async findCardCount() {
    //
    const count = await this.cardApi.findCardCount(
      CardQueryModel.asCardRdo(this.cardSearchQuery, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.cardCount = count;
    });
  }

  @action
  async findCardApprovalCount() {
    //
    const count = await this.cardApi.findCardCount(
      CardQueryModel.asCardRdo(this.cardApprovalSearchQuery, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.cardApprovalCount = count;
    });
  }

  @action
  findCardDuplicateCardName(cardDuplicateRdo: CardDuplicateRdo) {
    //
    return this.cardApi.findCardDuplicateCardName(cardDuplicateRdo);
  }

  @action
  registerCard() {
    //
    return this.cardApi.registerCard(CardCdo.asCardCdo(this.cardQuery, this.cardContentsQuery));
  }

  @action
  modifyCard(cardId: string) {
    //
    return this.cardApi.modifyCard(cardId, CardCdo.asCardCdo(this.cardQuery, this.cardContentsQuery));
  }

  @action
  approvalCard(cardId: string) {
    //
    return this.cardApi.approvalCard(cardId);
  }

  @action
  openedCard(cardId: string) {
    //
    return this.cardApi.openedCard(cardId);
  }

  @action
  rejectedCard(cardId: string) {
    //
    return this.cardApi.rejectedCard(cardId, CardRejectedModel.asNameValues(this.cardReacted.remark));
  }

  @action
  changeCardQueryProps(name: string, value: any) {
    // if (isNaN(value)) return;
    this.cardQuery = _.set(this.cardQuery, name, value);
  }

  @action
  changeCardSearchQueryProps(name: string, value: any) {
    //
    this.cardSearchQuery = _.set(this.cardSearchQuery, name, value);
  }

  @action
  changeCardApprovalSearchQueryProps(name: string, value: any) {
    //
    this.cardApprovalSearchQuery = _.set(this.cardApprovalSearchQuery, name, value);
  }

  @action
  changeCardContentsQueryProps(name: string, value: any) {
    // if (isNaN(value)) return;
    this.cardContentsQuery = _.set(this.cardContentsQuery, name, value);
  }

  @action
  changeCardContentsLearningContentProps(index: number, name: string, value: any) {
    //
    this.cardContentsQuery = _.set(this.cardContentsQuery, `learningContents[${index}].${name}`, value);
  }

  @action
  changeChildrenLearningContentProps(index: number, cIndex: number, name: string, value: any) {
    //
    this.cardContentsQuery = _.set(
      this.cardContentsQuery,
      `learningContents[${index}].children[${cIndex}].${name}`,
      value
    );
  }

  @action
  changeChildrenLearningContent(index: number, cIndex: number, learningContent: LearningContentModel) {
    //
    this.cardContentsQuery = _.set(
      this.cardContentsQuery,
      `learningContents[${index}].children[${cIndex}]`,
      learningContent
    );
  }

  @action
  changeModalCardQueryProps(name: string, value: any) {
    // if (isNaN(value)) return;
    this.modalCardQuery = _.set(this.modalCardQuery, name, value);
  }

  @action
  changeRelatedCardQueryProps(name: string, value: any) {
    // if (isNaN(value)) return;
    this.relatedCardQuery = _.set(this.relatedCardQuery, name, value);
  }

  @action
  changePrerequisiteCardQueryProps(name: string, value: any) {
    // if (isNaN(value)) return;
    this.prerequisiteCardQuery = _.set(this.prerequisiteCardQuery, name, value);
  }

  @action
  changeTargetCardWithAccessRuleProp(index: number, name: string, value: any): void {
    this.cardsWithAccessRule = _.set(this.cardsWithAccessRule, `cardWithContents.card.[${index}].${name}`, value);
  }

  @action
  changeTargetCardProp(index: number, name: string, value: any): void {
    this.cards = _.set(this.cards, `[${index}].${name}`, value);
  }

  @action
  changeCardSequence(card: CardWithContents, oldSeq: number, newSeq: number): void {
    //
    if (newSeq > -1 && newSeq < this.cards.length) {
      this.cards.splice(oldSeq, 1);
      this.cards.splice(newSeq, 0, card);
    }
  }

  @action
  changePrerequisiteCardsProp(index: number, name: string, value: any) {
    //
    this.prerequisiteCards = _.set(this.prerequisiteCards, `[${index}].${name}`, value);
  }

  @action
  changeChaptersProps(index: number, name: string, value: any) {
    //
    this.chapters = _.set(this.chapters, `[${index}].${name}`, value);
  }

  @action
  changeChapterNames(index: number, name: PolyglotModel) {
    //
    this.chapterNames = _.set(this.chapterNames, `[${index}]`, name);
  }

  @action
  changeChapterDescriptions(index: number, description: PolyglotModel) {
    //
    this.chapterDescriptions = _.set(this.chapterDescriptions, `[${index}]`, description);
  }

  @action
  changeLearningContentsProps(index: number, name: string, value: any) {
    //
    this.learningContents = _.set(this.learningContents, `[${index}].${name}`, value);
  }

  @action
  changeCardReactedProps(name: string, value: any) {
    //
    this.cardReacted = _.set(this.cardReacted, name, value);
  }

  @action
  setModalCards(cards: CardWithContents[]): void {
    //
    this.cards = [...cards];
  }

  @action
  setSelectedCards(cards: CardWithContents[]): void {
    //
    this.selectedCards = [...cards];
  }

  @action
  setSingleSelectedCards(card: CardWithContents): void {
    //
    this.singleSelectedCard = new CardWithContents(card);
  }

  @action
  setSelectedCardByCube(card: CardWithContents): void {
    //
    this.selectedCardByCube = card;
  }

  @action
  clearSelectedCardByCube(): void {
    //
    this.selectedCardByCube = new CardWithContents();
  }

  @action
  clearSingleSelectedCard(): void {
    this.singleSelectedCard = new CardWithContents();
  }

  @action
  setRelatedCards(cards: CardWithContents[]): void {
    //
    this.relatedCards = [...cards];
  }

  @action
  setPrerequisiteCards(cards: CardWithContents[]): void {
    //
    this.prerequisiteCards = [...cards];
  }

  @action
  setChapters(chapters: LearningContentModel[]): void {
    //
    this.chapters = chapters;

    const names: PolyglotModel[] = [];
    const descriptions: PolyglotModel[] = [];
    chapters &&
      chapters.forEach((chapter) => {
        names.push(chapter.name);
        descriptions.push(chapter.description);
      });
    this.chapterNames = names;
    this.chapterDescriptions = descriptions;
  }

  @action
  setLearningContents(contents: LearningContentModel[]): void {
    //
    this.learningContents = contents;
  }

  @action
  addSelectedCards(cards: CardWithContents): void {
    //
    this.selectedCards = [...this.selectedCards, cards];
  }

  @action
  addSingleSelectedCard(card: CardWithContents): void {
    //
    this.singleSelectedCard = new CardWithContents(card);
  }

  @action
  addCards(...cards: CardWithContents[]): void {
    //
    this.cards = cards;
  }

  @action
  addRelatedCards(card: CardWithContents): void {
    //
    this.relatedCards = [...this.relatedCards, card];
  }

  @action
  addPrerequisiteCards(card: CardWithContents): void {
    //
    this.prerequisiteCards = [...this.prerequisiteCards, card];
  }

  @action
  addChapters(chapter: LearningContentModel): void {
    //
    this.chapters = [...this.chapters, chapter];
    this.chapterNames = [...this.chapterNames, chapter.name];
    this.chapterDescriptions = [...this.chapterDescriptions, chapter.description];
  }

  @action
  addLearningContent(content: LearningContentModel): void {
    //
    this.learningContents.push(content);
  }

  @action
  addLearningContents(contents: LearningContentModel[]): void {
    //
    this.learningContents.push(...contents);
  }

  @action
  removeChapter(index: number): void {
    //
    this.chapters.splice(index, 1);
    this.chapterNames.splice(index, 1);
    this.chapterDescriptions.splice(index, 1);
  }

  @action
  removeLearningContent(index: number): void {
    //
    this.learningContents.splice(index, 1);
  }

  @action
  removeTargetCard(): void {
    this.cards
      .filter((cardWithContents) => cardWithContents.card.selected)
      .forEach((cardWithContents) => {
        this.cards.splice(this.cards.indexOf(cardWithContents), 1);
      });
  }

  @action
  removeCard(cardId: string) {
    //
    this.cardApi.removeCard(cardId);
  }

  @action
  removeDiscussion(discussionId: string) {
    //
    this.cardApi.removeDiscussion(discussionId);
  }

  @action
  setCardUdos(cardUdos: CardPolyglotUdo[]): void {
    //
    this.cardPolyglotUdos = cardUdos;
  }

  modifyPolyglotsForAdmin(cardId: string, cardPolyglotUdo: CardPolyglotUdo): Promise<void> {
    //
    return this.cardApi.modifyPolyglotsForAdmin(cardId, cardPolyglotUdo);
  }

  @action
  clearCards(): void {
    this.cards = [];
  }

  @action
  initializeCards(cards: CardWithContents[]): void {
    this.cards = [];
  }

  @action
  clearCardsWithAccessRuleResult(): void {
    this.cardsWithAccessRule = [];
  }

  @action
  clearCardQuery(): void {
    this.cardQuery = new CardQueryModel();
  }

  @action
  clearCardQueryWithOutSearch(): void {
    //
    this.cardQuery = CardQueryModel.asClearWithOutSearchProps(this.cardQuery);
  }

  @action
  clearCardContentsQuery(): void {
    //
    this.cardContentsQuery = new CardContentsQueryModel();
  }

  @action
  clearModalCardQuery(): void {
    //
    this.modalCardQuery = new CardQueryModel();
  }

  @action
  clearRelatedCards(): void {
    //
    this.relatedCards = [];
  }

  @action
  clearPrerequisiteCards(): void {
    //
    this.prerequisiteCards = [];
  }

  @action
  clearSelectedCards(): void {
    this.selectedCards = [];
  }

  @action
  clearChapters(): void {
    //
    this.chapters = [];
  }

  @action
  clearCardRejected() {
    //
    this.cardReacted = new CardRejectedModel();
  }
}

CardService.instance = new CardService(CardApi.instance);
export default CardService;
