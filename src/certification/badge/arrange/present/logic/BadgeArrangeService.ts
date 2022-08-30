import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import { NewDatePeriod } from 'shared/model';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import BadgeCategoryApi from '_data/badge/badgeCategories/api/BadgeCategoryApi';

import BadgeRdo from '../../../../../_data/badge/badges/model/BadgeRdo';
import { BadgeState } from '../../../../../_data/badge/badges/model/vo/BadgeType';
import BadgeApi from '../../../../../_data/badge/badges/api/BadgeApi';
import BadgeWithStudentCountRomModel from '../../../../../_data/badge/badges/model/BadgeWithStudentCountRomModel';
import { BadgeCategoryModel } from '../../../../../_data/badge/badgeCategories/model/BadgeCategoryModel';
import { BadgeCategoryQueryModel } from '../../../category/model/BadgeCategoryQueryModel';
import ChartTreeViewModel from '../../model/ChartTreeViewModel';
import { BadgeArrangeFlowUdoModel } from '../../model/BadgeArrangeFlowUdoModel';
import { BadgeArrangeTreeModel } from '../../model/BadgeArrangeTreeModel';
import BadgeArrangeApi from '../apiclient/BadgeArrangeApi';

@autobind
class BadgeArrangeService {
  //
  static instance: BadgeArrangeService;

  badgeCategoryApi: BadgeCategoryApi;
  badgeArrangeApi: BadgeArrangeApi;
  badgeApi: BadgeApi;

  constructor(badgeArrangeApi: BadgeArrangeApi, badgeCategoryApi: BadgeCategoryApi, badgeApi: BadgeApi) {
    this.badgeArrangeApi = badgeArrangeApi;
    this.badgeCategoryApi = badgeCategoryApi;
    this.badgeApi = badgeApi;
  }

  @observable
  badges: BadgeWithStudentCountRomModel[] = [];

  @observable
  badgeCategoryQuery: BadgeCategoryQueryModel = new BadgeCategoryQueryModel();

  @observable
  selectedCategory: BadgeArrangeTreeModel = new BadgeArrangeTreeModel();

  async findAllArrangesTree(categories: BadgeCategoryModel[]) {
    //
    const arrangeTree: ChartTreeViewModel[] = [];

    let treeIndex = 0;
    arrangeTree.push({
      key: 'root',
      label: 'Badge 편성 관리',
      type: '',
      index: String(treeIndex++),
      level: '0',
      language: '',
      company: '',
      treeId: '',
      nodes: [],
      categoryId: '',
    });

    categories.forEach((menu) => {
      arrangeTree[0].nodes.push({
        key: 'category-' + menu.id,
        label: getPolyglotToAnyString(menu.name, getDefaultLanguage(menu.langSupports)),
        type: menu.id || '',
        index: String(treeIndex++),
        level: '1',
        language: '',
        company: '',
        nodes: [],
        categoryId: menu.id,
        treeId: menu.id,
      });
    });

    return arrangeTree;
  }

  @action
  async findAllBadgeArrangeByCategory() {
    //
    const badges = await this.badgeApi.findBadges({
      offset: 0,
      limit: 99999999,
      categoryId: this.selectedCategory.categoryId,
      cineroomId: this.badgeCategoryQuery.cineroomId,
      startDate: 0,
      endDate: new NewDatePeriod().endDateLong,
      state: BadgeState.Opened,
      displayCategory: true,
    } as BadgeRdo);

    return runInAction(
      () =>
        (this.badges = badges.results.map((badgeWithStudent) => new BadgeWithStudentCountRomModel(badgeWithStudent)))
    );
  }

  modifyBadgeArrange() {
    //
    return this.badgeArrangeApi.modifyBadgeArrange(
      new BadgeArrangeFlowUdoModel(
        this.selectedCategory.categoryId,
        this.badges.map((badge) => badge.id)
      )
    );
  }

  @action
  setSelectedCategory(treeId: string, name: string, categoryId: string) {
    //
    this.selectedCategory = new BadgeArrangeTreeModel({
      categoryId,
      name,
      treeId,
    } as BadgeArrangeTreeModel);
  }

  @action
  setBadgeResultsSet(badge: BadgeWithStudentCountRomModel, oldSeq: number, newSeq: number) {
    //
    this.badges.splice(oldSeq, 1);
    this.badges.splice(newSeq, 0, badge);
  }

  @action
  setCineroomId(cineroomId: string) {
    //
    this.badgeCategoryQuery = _.set(this.badgeCategoryQuery, 'cineroomId', cineroomId);
  }

  @action
  clearBadgeList() {
    //
    this.badges = [];
  }
}

BadgeArrangeService.instance = new BadgeArrangeService(
  BadgeArrangeApi.instance,
  BadgeCategoryApi.instance,
  BadgeApi.instance
);
export default BadgeArrangeService;
