import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import { BadgeApproverModel } from '../../model/BadgeApproverModel';
import { BadgeApproverQueryModel } from '../../model/BadgeApproverQueryModel';
import BadgeApproverApi from '../apiclient/BadgeApproverApi';
import { BadgeApproverRdo } from '../../model/BadgeApproverRdo';
import { PageModel } from 'shared/model';
import { BadgeApproverRoleType } from '../../model/BadgeApproverRoleType';

@autobind
export class BadgeApproverService {
  //
  static instance: BadgeApproverService;

  approverApi: BadgeApproverApi;

  constructor(approverApi: BadgeApproverApi) {
    //
    this.approverApi = approverApi;
  }

  @observable
  badgeApprover: BadgeApproverModel = new BadgeApproverModel();

  @observable
  badgeApprovers: BadgeApproverModel[] = [];

  @observable
  badgeApproverList: BadgeApproverModel[] = [];

  @observable
  approverIdList: string[] = [];

  @observable
  badgeApproverQuery: BadgeApproverQueryModel = new BadgeApproverQueryModel();

  @observable
  badgeApproverModalQuery: BadgeApproverQueryModel = new BadgeApproverQueryModel();

  @action
  async findAllApproverByQuery(pageModel: PageModel): Promise<number> {
    //
    this.clearBadgeApprovers();
    this.changeBadgeApproverQueryProp('roles', [BadgeApproverRoleType.BadgeApprover]);

    const offsetElementList = await this.approverApi.findAllApproverByQuery(
      new BadgeApproverRdo(this.badgeApproverQuery, pageModel)
    );

    runInAction(() => {
      if (offsetElementList.results) {
        this.badgeApprovers = offsetElementList.results.map((approverQuery) => new BadgeApproverModel(approverQuery));
      }
    });

    return offsetElementList.totalCount;
  }

  @action
  async findAllApproverListByQuery(pageModel: PageModel): Promise<number> {
    //
    this.clearBadgeApproverList();
    this.changeBadgeApproverModalQueryProp('roles', [
      BadgeApproverRoleType.CollegeManager,
      BadgeApproverRoleType.CompanyManager,
    ]);

    const offsetElementList = await this.approverApi.findAllApproverByQuery(
      new BadgeApproverRdo(this.badgeApproverModalQuery, pageModel)
    );

    runInAction(() => {
      if (offsetElementList.results) {
        this.badgeApproverList = offsetElementList.results.map(
          (approverQuery) => new BadgeApproverModel(approverQuery)
        );
      }
    });

    return offsetElementList.totalCount;
  }

  @action
  registerApprover() {
    //
    return this.approverApi.registApprover(this.approverIdList);
  }

  @action
  removeApprover() {
    //
    return this.approverApi.removeApprover(this.approverIdList);
  }

  @action
  setApproverIds() {
    //
    const copied = this.badgeApproverList.filter((approver) => approver.checked === true);
    this.approverIdList = copied.map((approver) => approver.id);

    return this.approverIdList.length;
  }

  @action
  setApproversIds() {
    //
    const copied = this.badgeApprovers.filter((approver) => approver.checked === true);
    this.approverIdList = copied.map((approver) => approver.id);

    return this.approverIdList.length;
  }

  @action
  changeBadgeApproverQueryProp(name: string, value: any) {
    //
    this.badgeApproverQuery = _.set(this.badgeApproverQuery, name, value);
  }

  @action
  clearBadgeApproverQuery() {
    //
    this.badgeApproverQuery = new BadgeApproverQueryModel();
  }

  @action
  changeBadgeApproverModalQueryProp(name: string, value: any) {
    //
    this.badgeApproverModalQuery = _.set(this.badgeApproverModalQuery, name, value);
  }

  @action
  clearBadgeApproverModalQuery() {
    //
    this.badgeApproverModalQuery = new BadgeApproverQueryModel();
  }

  @action
  changeApproverListProp(index: number, name: string, value: any) {
    //
    this.badgeApproverList = _.set(this.badgeApproverList, `[${index}].${name}`, value);
  }

  @action
  changeApproversProp(index: number, name: string, value: any) {
    //
    this.badgeApprovers = _.set(this.badgeApprovers, `[${index}].${name}`, value);
  }

  @action
  clearCreateApproverIdList() {
    //
    this.approverIdList = [];
  }

  @action
  clearBadgeApprovers() {
    //
    this.badgeApprovers = [];
  }

  @action
  clearBadgeApproverList() {
    //
    this.badgeApproverList = [];
  }
}

BadgeApproverService.instance = new BadgeApproverService(BadgeApproverApi.instance);
export default BadgeApproverService;
