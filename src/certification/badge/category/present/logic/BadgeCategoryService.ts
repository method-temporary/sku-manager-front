import { OffsetElementList } from 'shared/model';
import { action, observable, runInAction } from 'mobx';
import _ from 'lodash';

import { NameValueList } from '@nara.platform/accent';

import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import BadgeCategoryApi from '../../../../../_data/badge/badgeCategories/api/BadgeCategoryApi';
import { BadgeCategoryModel } from '../../../../../_data/badge/badgeCategories/model/BadgeCategoryModel';
import { BadgeCategoryRdo } from '../../../../../_data/badge/badgeCategories/model/BadgeCategoryRdo';
import { BadgeCategoryQueryModel } from '../../model/BadgeCategoryQueryModel';
import { BadgeCategoryCdo } from '../../../../../_data/badge/badgeCategories/model/BadgeCategoryCdo';

export default class BadgeCategoryService {
  //
  static instance: BadgeCategoryService;
  badgeCategoryApi: BadgeCategoryApi;

  @observable
  badgeCategory: BadgeCategoryModel = new BadgeCategoryModel();

  @observable
  badgeCategories: BadgeCategoryModel[] = [];

  @observable
  badgeCategoryQuery: BadgeCategoryQueryModel = new BadgeCategoryQueryModel();

  @observable
  badgeCategoryMap: Map<string, string> = new Map<string, string>();

  @observable
  fileName: string = '';

  @observable
  backGroundFileName: string = '';

  @observable
  topIconFileName: string = '';

  @observable
  emptyCategories: boolean = false;

  constructor(badgeCategoryApi: BadgeCategoryApi) {
    //
    this.badgeCategoryApi = badgeCategoryApi;
  }

  @action
  async findAllBadgeCategories(badgeCategoryRdo: BadgeCategoryRdo): Promise<OffsetElementList<BadgeCategoryModel>> {
    //
    const offsetElementList = await this.badgeCategoryApi.findAllBadgeCategories(badgeCategoryRdo);

    runInAction(() => {
      this.badgeCategories = offsetElementList.results.map((badgeCategory) => new BadgeCategoryModel(badgeCategory));
      this.emptyCategories = offsetElementList.empty;

      this.badgeCategories.forEach((badgeCategory) => {
        this.badgeCategoryMap.set(
          badgeCategory.id,
          getPolyglotToAnyString(badgeCategory.name, getDefaultLanguage(badgeCategory.langSupports))
        );
      });
    });

    return offsetElementList;
  }

  @action
  async findBadgeCategoryById(badgeCategoryId: string): Promise<BadgeCategoryModel> {
    //
    const badgeCategory = await this.badgeCategoryApi.findBadgeCategory(badgeCategoryId);

    runInAction(() => {
      this.badgeCategory = new BadgeCategoryModel(badgeCategory);
    });
    return badgeCategory;
  }

  async registerBadgeCategory(badgeCategoryCdo: BadgeCategoryCdo): Promise<string> {
    //
    return this.badgeCategoryApi.registerBadgeCategory(badgeCategoryCdo);
  }

  modifyBadgeCategory(badgeCategoryId: string, nameValues: NameValueList): Promise<string> {
    //
    return this.badgeCategoryApi.modifyBadgeCategory(badgeCategoryId, nameValues);
  }

  @action
  modifyBadgeCategoryOrder() {
    //
    return this.badgeCategoryApi.modifyBadgeDisplayOrder(this.badgeCategories.map((badgeCategory) => badgeCategory.id));
  }

  removeBadgeCategory(badgeCategoryIds: string[]) {
    //
    return this.badgeCategoryApi.removeBadgeCategory(badgeCategoryIds);
  }
  ////////

  @action
  changeBadgeCategoryQueryProps(name: string, value: any) {
    //
    this.badgeCategoryQuery = _.set(this.badgeCategoryQuery, name, value);
  }

  @action
  changeBadgeCategoryProps(name: string, value: any) {
    this.badgeCategory = _.set(this.badgeCategory, name, value);
  }

  @action
  changeTargetBadgeCategoryProps(index: number, name: string, value: any): void {
    //
    this.badgeCategories = _.set(this.badgeCategories, `[${index}].${name}`, value);
  }

  @action
  changeBadgeCategorySequences(badgeCategoryModel: BadgeCategoryModel, oldSeq: number, newSeq: number) {
    //
    this.badgeCategories.splice(oldSeq, 1);
    this.badgeCategories.splice(newSeq, 0, badgeCategoryModel);
  }

  @action
  changeFileName(name: string, id: string) {
    //
    if (id === 'iconPath') {
      this.fileName = name;
    } else if (id === 'backgroundImagePath') {
      this.backGroundFileName = name;
    } else {
      this.topIconFileName = name;
    }
  }

  @action
  clearBadgeCategory() {
    this.badgeCategory = new BadgeCategoryModel();
  }

  @action
  clearBadgeCategories() {
    this.badgeCategories = [];
  }

  @action
  clearFileName() {
    this.fileName = '';
    this.backGroundFileName = '';
    this.topIconFileName = '';
  }

  @action
  clearBadgeCategoryQueryProps() {
    //
    this.badgeCategoryQuery = new BadgeCategoryQueryModel();
  }
}

Object.defineProperty(BadgeCategoryService, 'instance', {
  value: new BadgeCategoryService(BadgeCategoryApi.instance),
  writable: false,
  configurable: false,
});
