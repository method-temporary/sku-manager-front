import { action, observable, runInAction } from 'mobx';
import { autobind, OffsetElementList } from '@nara.platform/accent';

import _ from 'lodash';
import { Moment } from 'moment';
import ApprovalCubeApi from '../apiclient/ApprovalCubeApi';
import { ApprovalCubeModel } from '../../model/ApprovalCubeModel';
import ApprovalCubeQueryModel from '../../model/ApprovalCubeQueryModel';
import { ApprovalCubeWithOtherModel } from '../../model/ApprovalCubeWithOtherModel';

@autobind
export default class ApprovalCubeService {
  //
  static instance: ApprovalCubeService;

  approvalCubeApi: ApprovalCubeApi;

  @observable
  // approvalCube: ApprovalCubeModel = new ApprovalCubeModel();
  approvalCube: ApprovalCubeWithOtherModel = new ApprovalCubeWithOtherModel();

  @observable
  approvalQueryCube: ApprovalCubeQueryModel = new ApprovalCubeQueryModel();

  @observable
  approvalCubeOffsetList: OffsetElementList<ApprovalCubeModel> = { results: [], totalCount: 0 };

  @observable
  searchOrderBy: string = '';

  @observable
  searchEndDate: number = 0;

  @observable
  lectures: any[] = [];

  @observable
  approvalCubesExcelWrite: ApprovalCubeModel[] = [];

  constructor(approvalCubeApi: ApprovalCubeApi) {
    //
    this.approvalCubeApi = approvalCubeApi;
  }

  @observable
  selectedList: string[] = [];

  @observable
  proposalStateList: string[] = [];

  @action
  changeSelectedStudentProps(selectedList: string[]) {
    //
    this.selectedList = selectedList;
  }

  @action
  changeSelectedProposalStateProps(selectedList: string[]) {
    //
    this.proposalStateList = selectedList;
  }

  // ApprovalCube ------------------------------------------------------------------------------------------------------
  @action
  clearApprovalCube() {
    //
    // this.approvalCube = new ApprovalCubeModel();
    this.approvalCube = new ApprovalCubeWithOtherModel();
  }

  @action
  changeApprovalCubeProps(name: string, value: string | Moment | number | boolean) {
    //
    if (value === '전체') value = '';
    this.approvalQueryCube = _.set(this.approvalQueryCube, name, value);
  }

  @action
  async findApprovalCube(studentId: string) {
    //
    const approvalCube = await this.approvalCubeApi.findApprovalCube(studentId);

    if (approvalCube) {
      // return runInAction(() => (this.approvalCube = new ApprovalCubeModel(approvalCube)));
      return runInAction(() => (this.approvalCube = new ApprovalCubeWithOtherModel(approvalCube)));
    }
    return null;
  }

  // ApprovalCubeOffsetList --------------------------------------------------------------------------------------------
  @action
  async findApprovalCubesForSearch() {
    //
    const approvalCubeOffsetList = await this.approvalCubeApi.findApprovalCubesForSearch(
      ApprovalCubeQueryModel.asApprovalRdo(this.approvalQueryCube)
    );

    runInAction(() => {
      this.approvalCubeOffsetList = {
        results:
          approvalCubeOffsetList && approvalCubeOffsetList.results && approvalCubeOffsetList.results.length > 0
            ? approvalCubeOffsetList.results
            : [],
        totalCount: approvalCubeOffsetList && approvalCubeOffsetList.totalCount && approvalCubeOffsetList.totalCount,
      };
    });

    return this.approvalCubeOffsetList;
  }

  @action
  clear() {
    this.approvalCubeOffsetList = { results: [], totalCount: 0 } as OffsetElementList<ApprovalCubeModel>;
  }

  // SearchState --------------------------------------------------------------------------------------------

  @action
  changeSearchOrderBy(orderBy: string) {
    //
    this.searchOrderBy = orderBy;
  }

  @action
  changeSearchEndDate(endDate: number) {
    //
    this.searchEndDate = endDate;
  }

  @action
  async findLectureApprovalSelect() {
    //
    const lectures = await this.approvalCubeApi.findLectureApprovalSelect();
    return runInAction(() => (this.lectures = lectures));
  }

  @action
  async findApprovalCubesForExcel() {
    //
    const approvalCubes = await this.approvalCubeApi.findApprovalCubesForExcel(
      ApprovalCubeQueryModel.asApprovalExcelRdo(this.approvalQueryCube)
    );

    runInAction(() => {
      this.approvalCubesExcelWrite = approvalCubes && approvalCubes.results.map((cube) => new ApprovalCubeModel(cube));
    });

    return this.approvalCubesExcelWrite;
  }
}

Object.defineProperty(ApprovalCubeService, 'instance', {
  value: new ApprovalCubeService(ApprovalCubeApi.instance),
  writable: false,
  configurable: false,
});
