import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import { PageModel } from 'shared/model';

import BadgeApi from '_data/badge/badges/api/BadgeApi';
import {
  BadgeCdo,
  BadgeModel,
  BadgeCountModel,
  BadgeWithStudentCountRomModel,
  BadgeWithOperatorRom,
} from '_data/badge/badges/model';
import CategoryModel from '_data/badge/badges/model/vo/CategoryModel';

import { fromBadgeRdo } from '../../shared/util/badge.util';

import { UserIdentityModel } from '../../../../../cube/user/model/UserIdentityModel';
import { CardWithContents } from '../../../../../card';
import { BadgeQueryModel } from '../../model/BadgeQueryModel';

@autobind
class BadgeService {
  //
  static instance: BadgeService;

  badgeApi: BadgeApi;

  @observable
  badgeQueryModel: BadgeQueryModel = new BadgeQueryModel();

  @observable
  badgeModalQueryModel: BadgeQueryModel = new BadgeQueryModel();

  @observable
  badge: BadgeModel = new BadgeModel();

  @observable
  badgeWithOperator: BadgeWithOperatorRom = new BadgeWithOperatorRom();

  @observable
  badgeOperatorIdentity: UserIdentityModel = new UserIdentityModel();

  @observable
  badges: BadgeModel[] = [];

  @observable
  badgeCounts: BadgeCountModel = new BadgeCountModel();

  @observable
  badgesExcel: BadgeWithStudentCountRomModel[] = [];

  @observable
  badgeWithStudents: BadgeWithStudentCountRomModel[] = [];

  @observable
  badgeMainCategory: CategoryModel = new CategoryModel();

  @observable
  badgeSubCategories: CategoryModel[] = [];

  @observable
  badgeCategories: CategoryModel[] = [];

  @observable
  badgesForCards: BadgeModel[] = [];

  @observable
  requestApproval: boolean = false;

  @observable
  badgeCardIdsReset: string[] = [];

  @observable
  badgeCardsReset: CardWithContents[] = [];

  @observable
  relatedBadgesReset: BadgeWithStudentCountRomModel[] = [];

  @observable
  relatedBadgeResetIds: string[] = [];

  @observable
  creatorCineroomId: string = '';

  constructor(badgeApi: BadgeApi) {
    //
    this.badgeApi = badgeApi;
  }

  @action
  changeBadgeQueryProp(name: string, value: any) {
    //
    this.badgeQueryModel = _.set(this.badgeQueryModel, name, value);
  }

  @action
  changeBadgeProp(name: string, value: any) {
    //
    this.badge = _.set(this.badge, name, value);
  }

  @action
  changeBadgeModalQueryProp(name: string, value: any) {
    //
    this.badgeModalQueryModel = _.set(this.badgeModalQueryModel, name, value);
  }

  @action
  async findBadges(pageModel: PageModel): Promise<number> {
    //
    const offsetElementList = await this.badgeApi.findBadges(fromBadgeRdo(this.badgeQueryModel, pageModel));

    if (offsetElementList.results) {
      runInAction(() => {
        this.badgeWithStudents = offsetElementList.results.map(
          (badgeWithStudent) => new BadgeWithStudentCountRomModel(badgeWithStudent)
        );
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findModalBadges(pageModel: PageModel): Promise<number> {
    //
    const offsetElementList = await this.badgeApi.findBadges(fromBadgeRdo(this.badgeModalQueryModel, pageModel));

    runInAction(() => {
      this.badgeWithStudents = offsetElementList.results.map(
        (badgeWithStudent) => new BadgeWithStudentCountRomModel(badgeWithStudent)
      );
    });

    return offsetElementList.totalCount;
  }

  @action
  async findExcelBadges(): Promise<number> {
    //
    const offsetElementList = await this.badgeApi.findBadges(
      fromBadgeRdo(this.badgeQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.badgesExcel = offsetElementList.results.map(
        (badgeWithStudent) => new BadgeWithStudentCountRomModel(badgeWithStudent)
      );
    });

    return offsetElementList.totalCount;
  }

  @action
  async findBadgeCounts() {
    //
    const counts = await this.badgeApi.findBadgeCounts(fromBadgeRdo(this.badgeQueryModel, new PageModel(0, 99999999)));

    runInAction(() => {
      this.badgeCounts = counts;
    });

    return counts.totalCount;
  }

  @action
  async findBadge(badgeId: string) {
    //
    const badgeWithOperator = await this.badgeApi.findBadge(badgeId);

    runInAction(() => {
      //
      this.badge = new BadgeModel(badgeWithOperator.badge);
      this.badgeOperatorIdentity = new UserIdentityModel(badgeWithOperator.badgeOperatorIdentity);

      this.badgeMainCategory = new CategoryModel(...this.badge.categories.filter((category) => category.mainCategory));
      this.badgeSubCategories = this.badge.categories
        .filter((category) => !category.mainCategory)
        .map((category) => new CategoryModel(category));
      this.creatorCineroomId = this.badge.patronKey.keyString.slice(this.badge.patronKey.keyString.indexOf('@') + 1);
    });
    return this.badge;
  }

  @action
  async findRelatedBadges(relatedBadgeIds: string[]) {
    //
    const badges = await this.badgeApi.findRelatedBadges(relatedBadgeIds);

    const badgesWithCount = badges.map((badge) => BadgeWithStudentCountRomModel.asBadgeWithCountStudents(badge));

    this.setBadgeRestProp(this.badge.relatedBadgeIds, badgesWithCount);

    return badgesWithCount;
  }

  @action
  async findBadgesByCardId(cardId: string) {
    //
    const badgeWithCategories = await this.badgeApi.findBadgeByCardId(cardId);
    const badges: BadgeModel[] = [];

    runInAction(() => {
      badgeWithCategories?.forEach((badgeWithCategory) => {
        badges.push(new BadgeModel(badgeWithCategory.badge));
      });
      this.badgesForCards = badges;
    });

    return badges;
  }

  @action
  setBadgeQuery(badge: BadgeModel) {
    //
    this.badge = badge;
  }

  @action
  async registerBadge(badge: BadgeModel) {
    return this.badgeApi.registerBadge(BadgeCdo.getBadgeCdo(badge, this.requestApproval));
  }

  @action
  async modifiedBadge(badgeId: string, badge: BadgeModel) {
    //
    return this.badgeApi.modifiedBadge(badgeId, BadgeModel.asModifiedNameValues(badge));
  }

  @action
  async modifiedBadgeApproval(badgeId: string) {
    //
    return this.badgeApi.modifiedBadge(badgeId, BadgeModel.asApprovalNameValues(moment().valueOf()));
  }

  @action
  clearBadgeQuery() {
    this.badge = new BadgeModel();
  }

  @action
  setMainCategories(categoryId: string) {
    //
    const mainCategory = CategoryModel.asMainCategories(categoryId);
    this.badgeMainCategory = mainCategory;

    this.setCategories();
  }

  @action
  setSubCategories(subCategoryIds: string[]) {
    const subCategories = subCategoryIds.map((subCategoryId) => CategoryModel.asSubCategories(subCategoryId));
    this.badgeSubCategories = subCategories;

    this.setCategories();
  }

  @action
  setCategories() {
    //
    this.badgeCategories = [this.badgeMainCategory, ...this.badgeSubCategories];

    this.changeBadgeProp('categories', this.badgeCategories);
  }

  @action
  clearCategory() {
    this.badgeMainCategory = new CategoryModel();
    this.badgeSubCategories = [];
    this.badgeCategories = [];
  }

  @action
  clearBadgeQueryProp() {
    //
    this.badgeQueryModel = new BadgeQueryModel();
  }

  @action
  setBadgeRequestApproval(isRequest: boolean) {
    //
    this.requestApproval = isRequest;
  }

  @action
  changeBadgeOperatorProp(name: string, value: string) {
    //
    this.badgeOperatorIdentity = _.set(this.badgeOperatorIdentity, name, value);
  }

  @action
  clearBadgeOperatorProp() {
    //
    this.badgeOperatorIdentity = new UserIdentityModel();
  }

  @action
  setCardRestProp(cardIds: string[], cards: CardWithContents[]) {
    //
    this.badgeCardIdsReset = cardIds;
    this.badgeCardsReset = cards;
  }

  @action
  setBadgeRestProp(relatedBadgeIds: string[], relatedBadges: BadgeWithStudentCountRomModel[]) {
    //
    this.relatedBadgesReset = relatedBadges;
    this.relatedBadgeResetIds = relatedBadgeIds;
  }

  @action
  clearRelatedBadgeAndCards() {
    this.relatedBadgesReset = [];
    this.relatedBadgeResetIds = [];
    this.badgeCardsReset = [];
    this.badgeCardIdsReset = [];
  }
}

BadgeService.instance = new BadgeService(BadgeApi.instance);
export default BadgeService;
