import autobind from 'autobind-decorator';
import _ from 'lodash';
import { action, observable, runInAction } from 'mobx';

import { OffsetElementList, SelectTypeModel } from 'shared/model';
import { getPolyglotToString } from 'shared/components/Polyglot';

import UserWorkspaceModel from '../../../userworkspace/model/UserWorkspaceModel';

import CollegeSdo from '../../model/dto/CollegeSdo';
import ChannelSdo from '../../model/dto/ChannelSdo';
import { CollegeChannelRom } from '../../model/dto/CollegeChannelRom';
import CollegeDisplayOrderUdo from '../../model/dto/CollegeDisplayOrderUdo';
import CollegeQueryModel from '../../model/dto/CollegeQueryModel';
import CollegeAdminRdo from '../../model/dto/CollegeAdminRdo';
import CollegeAdminApi from '../apiclient/CollegeAdminApi';

@autobind
class CollegeAdminService {
  //
  static instance: CollegeAdminService;

  collegeAdminApi: CollegeAdminApi;

  constructor(collegeAdminApi: CollegeAdminApi) {
    this.collegeAdminApi = collegeAdminApi;
  }

  collegeQuery: CollegeQueryModel = new CollegeQueryModel();
  collegeSequenceQuery: CollegeQueryModel = new CollegeQueryModel();

  @action
  changeCollegeQueryProps(name: string, value: any): void {
    //
    this.collegeQuery = _.set(this.collegeQuery, name, value);
  }

  @action
  clearCollegeQuery(): void {
    this.collegeQuery = new CollegeQueryModel();
  }

  @action
  changeCollegeSequenceQueryProps(name: string, value: any): void {
    //
    this.collegeSequenceQuery = _.set(this.collegeSequenceQuery, name, value);
  }

  @action
  clearCollegeSequenceQuery(): void {
    this.collegeSequenceQuery = new CollegeQueryModel();
  }

  @observable
  colleges: CollegeChannelRom[] = [];

  @observable
  college: CollegeSdo = new CollegeSdo();

  @observable
  firstDepthChannel: ChannelSdo[] = [];

  @observable
  secondDepthChannel: ChannelSdo[] = [];

  @action
  async collegeRegister(college: CollegeSdo): Promise<string> {
    //
    this.remakeChannelList();
    return this.collegeAdminApi.register(college);
  }

  @action
  async collegeModify(collegeId: string, college: CollegeSdo): Promise<void> {
    //
    this.remakeChannelList();
    return this.collegeAdminApi.modify(collegeId, college);
  }

  @action
  remakeChannelList() {
    //
    const channelList = this.college.channels;
    const newChannelList: ChannelSdo[] = [];

    channelList &&
      channelList.length > 0 &&
      channelList.map((channel) => {
        !channel.parentId && newChannelList.push(new ChannelSdo(channel));
      });

    channelList &&
      channelList.length > 0 &&
      channelList
        .filter((channel) => (channel.parentId && true) || false)
        .map((channel) => {
          newChannelList.find((first) => first.id === channel.parentId)?.children?.push(new ChannelSdo(channel));
        });

    runInAction(() => {
      this.college.channels = [...newChannelList];
    });
  }

  @action
  async findByCollegeAdminRdo(collegeAdminRdo: CollegeAdminRdo): Promise<OffsetElementList<CollegeChannelRom>> {
    //
    const offsetElementList = await this.collegeAdminApi.findByCollegeAdminRdo(collegeAdminRdo);
    runInAction(() => {
      this.colleges = offsetElementList.results.map((college) => new CollegeChannelRom(college));
    });
    return offsetElementList;
  }

  @action
  async findCollegeSdo(id: string): Promise<CollegeSdo> {
    //
    const collegeSdo = await this.collegeAdminApi.findCollegeSdo(id);
    runInAction(() => {
      this.college = new CollegeSdo(collegeSdo);

      const first: ChannelSdo[] = [];
      const second: ChannelSdo[] = [];

      collegeSdo.channels &&
        collegeSdo.channels.map((channel) => (channel.parentId && second.push(channel)) || first.push(channel));
      this.firstDepthChannel = [...first];
      this.secondDepthChannel = [...second];
    });
    return this.college;
  }

  @action
  async findByCollegeSdoTargetChannels(id: string): Promise<CollegeSdo> {
    //
    const collegeSdo = await this.collegeAdminApi.findCollegeSdo(id);
    runInAction(() => {
      this.college = _.set(
        this.college,
        'channels',
        collegeSdo.channels.length ? collegeSdo.channels.map((channel) => new ChannelSdo(channel)) : []
      );
    });
    return this.college;
  }

  @action
  changeCollegeSequence(oldIndex: number, newIndex: number): void {
    //
    const targetCollege = this.colleges[oldIndex];
    if (newIndex > -1 && newIndex < this.colleges.length) {
      this.colleges.splice(oldIndex, 1);
      this.colleges.splice(newIndex, 0, targetCollege);
    }
  }

  async setUpDisplayOrders(collegeDisplayOrderUdo: CollegeDisplayOrderUdo): Promise<void> {
    //
    await this.collegeAdminApi.setUpDisplayOrders(collegeDisplayOrderUdo);
  }

  @action
  changeCollegeProps(name: string, value: any): void {
    //
    this.college = _.set(this.college, name, value);
    // console.log(this.college);
  }

  @action
  changeTargetChannelSelected(index: number, value: any): void {
    //
    this.college.channels[index].selected = value;
  }

  @action
  changeTargetChannelEnabled(index: number, value: any): void {
    //
    this.college.channels[index].enabled = value;
  }

  @action
  clearCollege(): void {
    //
    this.college = new CollegeSdo();
  }

  @action
  clearColleges(): void {
    //
    this.colleges = [];
  }

  @observable
  channel: ChannelSdo = new ChannelSdo();

  @observable
  selectedSecondDepthChannel: boolean = false;

  @action
  changeChannelProps(name: string, value: any): void {
    //
    this.channel = _.set(this.channel, name, value);
  }

  @action
  changeSecondDepthChannel(value: boolean) {
    runInAction(() => {
      this.selectedSecondDepthChannel = value;
      !value && this.changeChannelProps('parentId', null);
    });
  }

  @action
  setChannel(channel: ChannelSdo): void {
    //
    channel.beforeChangeName = channel.name;
    channel.modified = getPolyglotToString(channel.name);
    this.channel = channel;
    this.changeSecondDepthChannel((channel.parentId && true) || false);
  }

  @action
  clearChannel(): void {
    //
    this.channel = new ChannelSdo();
    this.changeSecondDepthChannel(false);
  }

  @observable
  currentUserWorkspace: UserWorkspaceModel = new UserWorkspaceModel();

  @observable
  selectedUserWorkspace: UserWorkspaceModel = new UserWorkspaceModel();

  @observable
  selectedUserWorkspaceId: string = '';

  @observable
  workspaceOptions: SelectTypeModel[] = [];

  @action
  changeCurrentUserWorkspace(userWorkspace: UserWorkspaceModel): void {
    //
    this.currentUserWorkspace = userWorkspace;
  }

  @action
  clearCurrentUserWorkspace(): void {
    //
    this.currentUserWorkspace = new UserWorkspaceModel();
  }

  @action
  changeSelectedUserWorkspace(userWorkspace: UserWorkspaceModel): void {
    //
    this.selectedUserWorkspace = userWorkspace;
  }

  @action
  clearSelectedUserWorkspace(): void {
    //
    this.selectedUserWorkspace = new UserWorkspaceModel();
  }

  @action
  changeSelectedUserWorkspaceId(userWorkspaceId: string): void {
    //
    this.selectedUserWorkspaceId = userWorkspaceId;
  }

  @action
  clearSelectedUserWorkspaceId(): void {
    //
    this.selectedUserWorkspaceId = '';
  }

  @action
  setWorkspaceOptions(options: SelectTypeModel[]): void {
    //
    this.workspaceOptions = options;
  }

  @action
  clearWorkspaceOptions(): void {
    //
    this.workspaceOptions = [];
  }
}

CollegeAdminService.instance = new CollegeAdminService(CollegeAdminApi.instance);
export default CollegeAdminService;
