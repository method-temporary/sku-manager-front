import { autobind } from '@nara.platform/accent';
import UserCubeApi from '../apiclient/UserCubeApi';
import { action, observable, runInAction } from 'mobx';
import { UserCubeWithIdentity } from '../../model/sdo/UserCubeWithIdentity';
import { UserCubeQueryModel } from '../../model/UserCubeQueryModel';
import { CubeSdo } from '../../model/sdo/CubeSdo';
import { UserCubeAdminRdo } from '../../model/sdo/UserCubeAdminRdo';
import { OffsetElementList } from 'shared/model';
import { UserCubeCounts } from '../../model/vo/UserCubeCounts';
import _ from 'lodash';
import { UserCubeModel } from '../../model/UserCubeModel';
import { StudentRequestCdoModel } from '../../../../lecture/student/model/StudentRequestCdoModel';

@autobind
class UserCubeService {
  //
  static instance: UserCubeService;

  userCubeApi: UserCubeApi;

  @observable
  userCubeWithIdentity: UserCubeWithIdentity = new UserCubeWithIdentity();

  @observable
  userCube: UserCubeModel = new UserCubeModel();

  @observable
  userCubesWithIdentity: UserCubeWithIdentity[] = [];

  @observable
  selectedList: UserCubeWithIdentity[] = [];

  @observable
  userCubeCounts: UserCubeCounts = new UserCubeCounts();

  @observable
  userCubeQuery: UserCubeQueryModel = new UserCubeQueryModel();

  @observable
  cubeRequestCdo: StudentRequestCdoModel = new StudentRequestCdoModel();

  constructor(userCubeApi: UserCubeApi) {
    this.userCubeApi = userCubeApi;
  }

  registerUserCube(cubeSdo: CubeSdo): Promise<string> {
    //
    return this.userCubeApi.registerUserCube(cubeSdo);
  }

  @action
  async findUserCubeWithIdentitiesForAdmin(
    userCubeAdminRdo: UserCubeAdminRdo
  ): Promise<OffsetElementList<UserCubeWithIdentity>> {
    //
    const offsetElements = await this.userCubeApi.findUserCubeWithIdentitiesForAdmin(userCubeAdminRdo);

    runInAction(() => {
      this.userCubesWithIdentity = offsetElements.results.map((userCube) => new UserCubeWithIdentity(userCube));
    });

    return offsetElements;
  }

  @action
  async findUserCubeForAdmin(cubeId: string): Promise<void> {
    //
    const userCube = await this.userCubeApi.findUserCubeForAdmin(cubeId);
    runInAction(() => {
      this.userCube = new UserCubeModel(userCube);
    });
  }

  modifyUserCube(cubeId: string, cubeSdo: CubeSdo): Promise<void> {
    //
    return this.userCubeApi.modifyUserCube(cubeId, cubeSdo);
  }

  requestOpenUserCube(cubeId: string): Promise<void> {
    //
    return this.userCubeApi.requestOpenUserCube(cubeId);
  }

  openUserCubes(ids: string[]): Promise<void> {
    //
    return this.userCubeApi.openUserCubes(ids);
  }

  rejectUserCubes(ids: string[], remark: string) {
    //
    return this.userCubeApi.rejectUserCubes(ids, remark);
  }

  async countUserCubesForAdmin(userCubeAdminRdo: UserCubeAdminRdo): Promise<UserCubeCounts> {
    //
    const userCubeCounts = await this.userCubeApi.countUserCubesForAdmin(userCubeAdminRdo);

    runInAction(() => {
      this.userCubeCounts = userCubeCounts;
    });

    return userCubeCounts;
  }

  ////

  @action
  setSelectedList(userCubesWithIdentity: UserCubeWithIdentity[]): void {
    //
    this.selectedList = userCubesWithIdentity;
  }

  @action
  clearSelectedList(): void {
    //
    this.selectedList = [];
  }

  @action
  clearUserCubesWithIdentity() {
    //
    this.userCubesWithIdentity = [];
  }

  @action
  changeUserCubeQueryProp(name: string, value: any): void {
    //
    this.userCubeQuery = _.set(this.userCubeQuery, name, value);
  }

  @action
  changeUserCubeProp(name: string, value: any): void {
    //
    this.userCubeWithIdentity = _.set(this.userCubeWithIdentity, name, value);
  }

  @action
  setMemberName(value: any): void {
    //
    this.userCube = _.set(this.userCube, 'approverName', value);
  }

  @action
  clearUserCubeQuery(): void {
    //
    this.userCubeQuery = new UserCubeQueryModel();
  }

  @action
  clearUserCube(): void {
    //
    this.userCubeWithIdentity = new UserCubeWithIdentity();
    this.userCube = new UserCubeModel();
  }

  @action
  changeCubeRequestProps(name: string, value: string) {
    //
    this.cubeRequestCdo = _.set(this.cubeRequestCdo, name, value);
  }

  ////
}

UserCubeService.instance = new UserCubeService(UserCubeApi.instance);
export default UserCubeService;
