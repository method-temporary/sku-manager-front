import autobind from 'autobind-decorator';
import { action, observable, runInAction } from 'mobx';
import _ from 'lodash';

import { NameValueList, OffsetElementList } from 'shared/model';

import { AudienceIdentity, SelectTypeModel, CineroomManagerRoleUdo } from 'shared/model';
import { StationApi } from 'shared/present';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import MemberApi from '_data/approval/members/api/MemberApi';
import { MemberModel, MemberRdo } from '_data/approval/members/model';

import { NonGdiMemberSdo } from 'userworkspace/model/dto/NonGdiMemberSdo';

import MemberSearchFormModel, { getInitMemberSearchFormModel } from '../../../approval/model/MemberSearchFormModel';
import UserWithRelatedInformationRom from '../../../user/model/UserWithRelatedInformationRom';
import UserApi from '../../../user/present/apiclient/UserApi';
import { UserRdo } from '../../../user/model/UserRdo';
import UserWorkspaceModel from '../../model/UserWorkspaceModel';
import UserWorkspaceRdo from '../../model/dto/UserWorkspaceRdo';
import { NonGdiMemberCitizenCdo } from '../../model/dto/NonGdiMemberCitizenCdo';
import { NonGdiMemberCitizenUdo } from '../../model/dto/NonGdiMemberCitizenUdo';
import NonGdiMemberCitizensApplicationSdo from '../../model/dto/NonGdiMemberCitizensApplicationSdo';
import UserWorkspaceManagerQueryModel from '../../model/UserWorkspaceManagerQueryModel';
import UserWorkspaceQueryModel from '../../model/UserWorkspaceQueryModel';
import NonGdiMemberCitizensApplicationResult from '../../model/dto/NonGdiMemberCitizensApplicationResult';
import UserWorkspaceApi from '../apiclient/UserWorkspaceApi';
import MemberCitizenApi from '../apiclient/MemberCitizenApi';

@autobind
class UserWorkspaceService {
  static instance: UserWorkspaceService;
  userWorkspaceApi: UserWorkspaceApi;
  memberApi: MemberApi;
  skProfileApi: UserApi;
  memberCitizenApi: MemberCitizenApi;
  stationApi: StationApi;

  constructor(
    userWorkspaceApi: UserWorkspaceApi,
    memberApi: MemberApi,
    skProfileApi: UserApi,
    memberCitizenApi: MemberCitizenApi,
    stationApi: StationApi
  ) {
    this.userWorkspaceApi = userWorkspaceApi;
    this.memberApi = memberApi;
    this.skProfileApi = skProfileApi;
    this.memberCitizenApi = memberCitizenApi;
    this.stationApi = stationApi;
  }

  @observable
  userWorkspace: UserWorkspaceModel = new UserWorkspaceModel();

  @observable
  userWorkspaces: UserWorkspaceModel[] = [];

  @observable
  parentUserWorkspaces: UserWorkspaceModel[] = [];

  @observable
  userWorkspaceQueryModel: UserWorkspaceQueryModel = new UserWorkspaceQueryModel();

  @observable
  selectedUserWorkspaceIds: string[] = [];

  @observable
  userWorkspaceMap: Map<string, string> = new Map<string, string>();

  @observable
  allUserWorkspaces: UserWorkspaceModel[] = [];

  @observable
  userWorkspaceSelect: SelectTypeModel[] = [];

  @observable
  userWorkspaceMapUsId: Map<string, string> = new Map<string, string>();

  @observable
  userWorkspaceSelectUsId: SelectTypeModel[] = [];

  // parentUserWorkspaces
  @action
  async findParentUserWorkspaces(): Promise<UserWorkspaceModel[]> {
    //
    const results = await this.userWorkspaceApi.findParentUserWorkspaces();
    runInAction(() => {
      this.parentUserWorkspaces = results.map((userWorkspace) => new UserWorkspaceModel(userWorkspace));
    });

    return results;
  }

  // userWorkspaces
  @action
  async findUserWorkspacesByRdo(userWorkspaceRdo: UserWorkspaceRdo): Promise<OffsetElementList<UserWorkspaceModel>> {
    //
    const offsetElementList = await this.userWorkspaceApi.findUserWorkspacesByRdo(userWorkspaceRdo);
    runInAction(() => {
      this.userWorkspaces = offsetElementList.results.map((userWorkspace) => new UserWorkspaceModel(userWorkspace));
    });
    return offsetElementList;
  }

  // userWorkspaces All

  async findUserWorkspacesByParentId(parentId: string): Promise<UserWorkspaceModel[]> {
    //
    return this.userWorkspaceApi.findUserWorkspacesByParentId(parentId);
  }

  @action
  async findAllWorkspaces() {
    //
    const results = await this.userWorkspaceApi.findAllWorkspace();

    return runInAction(
      () => (this.userWorkspaces = results.map((userWorkspace) => new UserWorkspaceModel(userWorkspace)))
    );
  }

  @action
  async findAllUserWorkspacesMap() {
    //
    const results = await this.userWorkspaceApi.findAllWorkspace();

    runInAction(() => {
      const userWorkspaces: UserWorkspaceModel[] = [];
      const workspaceMap = new Map<string, string>();
      const workspaceMapUsId = new Map<string, string>();
      const selectTypes: SelectTypeModel[] = [];
      const selectTypesUsId: SelectTypeModel[] = [];

      results?.forEach((userWorkspace) => {
        userWorkspaces.push(new UserWorkspaceModel(userWorkspace));
        workspaceMap.set(userWorkspace.id, getPolyglotToAnyString(userWorkspace.name));
        workspaceMapUsId.set(userWorkspace.usid, getPolyglotToAnyString(userWorkspace.name));
        selectTypes.push(
          new SelectTypeModel(userWorkspace.id, getPolyglotToAnyString(userWorkspace.name), userWorkspace.id)
        );

        selectTypesUsId.push(
          new SelectTypeModel(userWorkspace.usid, getPolyglotToAnyString(userWorkspace.name), userWorkspace.usid)
        );
      });

      this.allUserWorkspaces = userWorkspaces;
      this.userWorkspaceMap = workspaceMap;
      this.userWorkspaceSelect = selectTypes;
      this.userWorkspaceSelectUsId = selectTypesUsId;
      this.userWorkspaceMapUsId = workspaceMapUsId;
    });

    return this.userWorkspaceMap;
  }

  @action
  async getWorkSpaceByCineroomId(cineroomId: string): Promise<UserWorkspaceModel> {
    //
    const userWorkSpaces = this.userWorkspaces.length > 0 ? this.userWorkspaces : await this.findAllWorkspaces();

    const userWorkSpace = userWorkSpaces && userWorkSpaces.filter((userWorkSpace) => userWorkSpace.id === cineroomId);

    if (userWorkSpace.length > 0) {
      return userWorkSpace[0];
    }

    return new UserWorkspaceModel();
  }

  @action
  async getWorkSpaceByUsId(usId: string): Promise<UserWorkspaceModel> {
    //
    const userWorkSpaces = this.userWorkspaces.length > 0 ? this.userWorkspaces : await this.findAllWorkspaces();

    const userWorkSpace = userWorkSpaces && userWorkSpaces.filter((userWorkSpace) => userWorkSpace.usid === usId);

    if (userWorkSpace.length > 0) {
      return userWorkSpace[0];
    }

    return new UserWorkspaceModel();
  }

  // userWorkspaceQueryModel
  @action
  changeUserWorkspaceQueryModelProps(name: string, value: any) {
    //
    if (value === 'All') {
      this.userWorkspaceQueryModel = _.set(this.userWorkspaceQueryModel, name, null);
    } else {
      this.userWorkspaceQueryModel = _.set(this.userWorkspaceQueryModel, name, value);
    }
  }

  getParentWorkspaceName(id: string): string {
    const parentUserWorkspace = this.parentUserWorkspaces.find((userWorkspace) => userWorkspace.id === id);
    if (parentUserWorkspace) {
      return getPolyglotToAnyString(parentUserWorkspace.name);
    } else {
      return '-';
    }
  }

  // userWorkspace
  @action
  async findUserWorkspaceById(id: string): Promise<UserWorkspaceModel> {
    //
    const target = await this.userWorkspaceApi.findUserWorkspaceById(id);
    runInAction(() => {
      this.userWorkspace = new UserWorkspaceModel(target);
    });

    return target;
  }

  @action
  changeUserWorkspaceProps(name: string, value: any) {
    //
    if (value === 'All') {
      this.userWorkspace = _.set(this.userWorkspace, name, null);
    } else {
      this.userWorkspace = _.set(this.userWorkspace, name, value);
    }
  }

  modifyUserWorkspace(id: string, nameValues: NameValueList): Promise<void> {
    //
    return this.userWorkspaceApi.modifyUserWorkspace(id, nameValues);
  }

  activeUserWorkspaces(ids: string[]): Promise<void> {
    //
    return this.userWorkspaceApi.activeUserWorkspaces(ids);
  }

  dormantUserWorkspaces(ids: string[]): Promise<void> {
    //
    return this.userWorkspaceApi.dormantUserWorkspaces(ids);
  }

  // selectedUserWorkspaceIds
  @action
  setSelectedUserWorkspacesIds(ids: string[]): void {
    //
    this.selectedUserWorkspaceIds = ids;
  }

  @action
  clearSelectedUserWorkspaceIds(): void {
    //
    this.selectedUserWorkspaceIds = [];
  }

  //

  @observable
  memberSearchForm: MemberSearchFormModel = getInitMemberSearchFormModel();

  @observable
  member: MemberModel = new MemberModel();

  @observable
  members: UserWithRelatedInformationRom[] = [];

  @observable
  fileName: string = '';

  @observable
  nonGdiMemberCitizensApplicationSdo = new NonGdiMemberCitizensApplicationSdo();

  @observable
  tempNonGdiMemberSdoList: NonGdiMemberSdo[] = [];

  @observable
  selectedMemberIds: string[] = [];

  // memberQuery

  @action
  changeMemberSearchFormProps(name: string, value: any): void {
    //
    this.memberSearchForm = _.set(this.memberSearchForm, name, value);
  }

  // members

  @action
  async findMemberByCreationTime(skProfileRdo: UserRdo): Promise<OffsetElementList<UserWithRelatedInformationRom>> {
    //
    const offsetElementList = await this.skProfileApi.findUserWithRelatedInformationForAdmin(skProfileRdo);
    runInAction(() => {
      this.members = offsetElementList.results.map((member) => new UserWithRelatedInformationRom(member));
    });
    return offsetElementList;
  }

  async findMemberByCreationTimeForExcel(memberSearchRdo: MemberRdo): Promise<MemberModel[]> {
    //
    const offsetElementList = await this.memberApi.findMemberByCreationTime(memberSearchRdo);
    return offsetElementList.results.map((member) => new MemberModel(member));
  }

  @action
  setUploadedFileName(fileName: string) {
    //
    this.fileName = fileName;
  }

  setNonGdiMemberCitizensApplicationSdo(sdo: NonGdiMemberCitizensApplicationSdo): void {
    //
    this.nonGdiMemberCitizensApplicationSdo = sdo;
  }

  addTempNonGdiMemberSdo(sdo: NonGdiMemberSdo): void {
    //
    this.tempNonGdiMemberSdoList.push(sdo);
  }

  clearTempNonGdiMemberSdo(): void {
    //
    this.tempNonGdiMemberSdoList = [];
  }

  // member

  @action
  async findMemberById(id: string): Promise<MemberModel> {
    //
    const target = await this.memberApi.findMemberById(id);
    runInAction(() => {
      this.member = new MemberModel(target);
    });
    return target;
  }

  @action
  changeMemberProps(name: string, value: any): void {
    //
    this.member = _.set(this.member, name, value);
  }

  @action
  clearMember(): void {
    //
    this.member = new MemberModel();
  }

  registerNonGdiMemberCitizen(cdo: NonGdiMemberCitizenCdo): Promise<string> {
    //
    return this.memberCitizenApi.registerNonGdiMemberCitizen(cdo);
  }

  modifyNonGdiMemberCitizen(udo: NonGdiMemberCitizenUdo): Promise<void> {
    //
    return this.memberCitizenApi.modifyNonGdiMemberCitizen(udo);
  }

  deactivateNonGdiMemberCitizen(citizenIds: string[]): Promise<void> {
    //
    return this.memberCitizenApi.deactivateNonGdiMemberCitizen(citizenIds);
  }

  applyNonGdiMemberCitizens(sdo: NonGdiMemberCitizensApplicationSdo): Promise<NonGdiMemberCitizensApplicationResult> {
    //
    return this.memberCitizenApi.applyNonGdiMemberCitizens(sdo);
  }

  // selectedMemberIds
  @action
  setSelectedMemberIds(ids: string[]): void {
    //
    this.selectedMemberIds = ids;
  }

  @action
  clearSelectedMemberIds(): void {
    //
    this.selectedMemberIds = [];
  }

  @observable
  audienceIdentities: AudienceIdentity[] = [];

  @observable
  selectedAudienceIdentityIds: string[] = [];

  @action
  async findManagerIdentitiesByCineroomId(
    cineroomId: string,
    name: string,
    email: string,
    offset: number,
    limit: number
  ): Promise<OffsetElementList<AudienceIdentity>> {
    const offsetElementList = await this.stationApi.findManagerIdentitiesByCineroomId(
      cineroomId,
      name,
      email,
      offset,
      limit
    );
    runInAction(() => {
      this.audienceIdentities = offsetElementList.results;
    });

    return offsetElementList;
  }

  async assignCineroomManagerRole(udo: CineroomManagerRoleUdo): Promise<void> {
    //
    return this.stationApi.assignCineroomManagerRole(udo);
  }

  async cancelCineroomManagerRole(udo: CineroomManagerRoleUdo): Promise<void> {
    //
    return this.stationApi.cancelCineroomManagerRole(udo);
  }

  @action
  setSelectedAudienceIdentityIds(ids: string[]): void {
    //
    this.selectedAudienceIdentityIds = ids;
  }

  @action
  clearSelectedAudienceIdentityIds(): void {
    //
    this.selectedAudienceIdentityIds = [];
  }

  @observable
  userWorkspaceManagerQueryModel: UserWorkspaceManagerQueryModel = new UserWorkspaceManagerQueryModel();

  @action
  changeUserWorkspaceManagerQueryProps(name: string, value: any): void {
    //
    this.userWorkspaceManagerQueryModel = _.set(this.userWorkspaceManagerQueryModel, name, value);
  }

  @observable
  invalidMembers: any[] = [];

  @observable
  uploadToDeactivateMembers: any[] = [];

  @action
  setInvalidMembers(members: any[]) {
    this.invalidMembers = members;
  }

  @action
  setUploadToDeactivateMembers(members: any[]) {
    this.uploadToDeactivateMembers = members;
  }

  userWorkspacesByUserWorkspaceId(id: string): UserWorkspaceModel[] {
    //
    const userWorkspaces: UserWorkspaceModel[] = [];

    this.allUserWorkspaces.forEach((userWorkspace) => {
      if (userWorkspace.id === id) {
        userWorkspaces.push(userWorkspace);
      } else if (userWorkspace.parentId === id) {
        userWorkspaces.push(userWorkspace);
      }
    });
    return userWorkspaces;
  }
}

UserWorkspaceService.instance = new UserWorkspaceService(
  UserWorkspaceApi.instance,
  MemberApi.instance,
  UserApi.instance,
  MemberCitizenApi.instance,
  StationApi.instance
);

export default UserWorkspaceService;
