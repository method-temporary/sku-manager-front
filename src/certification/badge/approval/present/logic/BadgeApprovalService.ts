import { autobind } from '@nara.platform/accent';
import { action, observable, runInAction } from 'mobx';
import _ from 'lodash';

import BadgeApprovalApi from '../apiclient/BadgeApprovalApi';

import { PageModel } from 'shared/model';

import { BadgeWithStudentCountRomModel } from '_data/badge/badges/model';
import { BadgeQueryModel } from '../../../badge/model/BadgeQueryModel';
import BadgeApproveUdo from '../../model/BadgeApproveUdo';
import { fromBadgeRdo } from '../../../badge/shared/util/badge.util';

@autobind
class BadgeApprovalService {
  //
  static instance: BadgeApprovalService;

  badgeApprovalApi: BadgeApprovalApi;

  @observable
  badgeApprovals: BadgeWithStudentCountRomModel[] = [];

  @observable
  badgeApprovalsExcel: BadgeWithStudentCountRomModel[] = [];

  @observable
  badgeApprovalQueryModel: BadgeQueryModel = new BadgeQueryModel();

  @observable
  selectedAllBadgeApprovalPages: number[] = [];

  @observable
  badgeApproveUdo: BadgeApproveUdo = new BadgeApproveUdo();

  constructor(badgeApprovalApi: BadgeApprovalApi) {
    //
    this.badgeApprovalApi = badgeApprovalApi;
  }

  @action
  async findBadgeApprovals(pageModel: PageModel) {
    //
    const offsetElementList = await this.badgeApprovalApi.findBadges(
      fromBadgeRdo(this.badgeApprovalQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.badgeApprovals = offsetElementList.results.map(
          (badgeWithStudent) => new BadgeWithStudentCountRomModel(badgeWithStudent)
        );
      });
    }
    return offsetElementList.totalCount;
  }

  @action
  async findExcelBadgeApprovals() {
    //
    const offsetElementList = await this.badgeApprovalApi.findBadges(
      fromBadgeRdo(this.badgeApprovalQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.badgeApprovalsExcel = offsetElementList.results.map(
        (badgeWithStudent) => new BadgeWithStudentCountRomModel(badgeWithStudent)
      );
    });

    return offsetElementList.totalCount;
  }

  //뱃지 승인
  @action
  modifyAllBadgeStatesOpened() {
    //
    return this.badgeApprovalApi.modifyAllBadgeStatesOpened(this.badgeApproveUdo);
  }

  //뱃지 반려
  @action
  modifyAllBadgesStatesRejected() {
    //
    return this.badgeApprovalApi.modifyAllBadgesStatesRejected(this.badgeApproveUdo);
  }

  @action
  changeBadgeApprovalQueryPros(name: string, value: any) {
    //
    this.badgeApprovalQueryModel = _.set(this.badgeApprovalQueryModel, name, value);
  }

  @action
  setSelectedBadgeApproval(name: string, value: any) {
    //
    this.badgeApproveUdo = _.set(this.badgeApproveUdo, name, value);
  }

  @action
  addSelectedBadgeApproval(id: string) {
    //
    const copied = [...this.badgeApproveUdo.badgeIds];
    copied.push(id);

    return (this.badgeApproveUdo.badgeIds = [...copied]);
  }

  @action
  removeSelectedBadgeApproval(id: string) {
    //
    const copied = [...this.badgeApproveUdo.badgeIds];
    this.badgeApproveUdo.badgeIds = copied.filter((sId) => sId !== id);
    return copied.indexOf(id);
  }

  @action
  addSelectedAllBadgeApprovalPages(page: number) {
    //
    const copied = [...this.selectedAllBadgeApprovalPages];
    copied.push(page);

    this.selectedAllBadgeApprovalPages = [...copied];
  }

  @action
  removeSelectedAllBadgeApprovalPages(page: number) {
    //
    const copied = [...this.selectedAllBadgeApprovalPages];
    this.selectedAllBadgeApprovalPages = copied.filter((sId) => sId !== page);
  }

  @action
  clearBadgeApprovalUdo() {
    //
    this.badgeApproveUdo = new BadgeApproveUdo();
  }

  @action
  clearSelectedAllBadgeApprovalPages() {
    //
    this.selectedAllBadgeApprovalPages = [];
  }

  @action
  clearBadgeApprovalQueryProps() {
    //
    this.badgeApprovalQueryModel = new BadgeQueryModel();
  }
}

BadgeApprovalService.instance = new BadgeApprovalService(BadgeApprovalApi.instance);
export default BadgeApprovalService;
