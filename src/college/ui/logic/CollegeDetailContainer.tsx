import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, PolyglotModel } from 'shared/model';
import { alert, AlertModel, confirm, ConfirmModel, PageTitle, SubActions } from 'shared/components';
import { isPolyglotBlank, LangSupport, Language } from 'shared/components/Polyglot';

import CollegeBasicInfoView from '../view/CollegeBasicInfoView';
import CollegeInChannelInfoView from '../view/CollegeInChannelInfoView';
import CollegeAdminService from '../../present/logic/CollegeAdminService';
import { inject, observer } from 'mobx-react';
import { UserGroupService } from '../../../usergroup';
import ChannelCreateModal from './ChannelCreateModal';
import ChannelSdo from '../../model/dto/ChannelSdo';
import CollegeSdo from '../../model/dto/CollegeSdo';
import { serviceManagementUrl } from '../../../Routes';
import CollegeService from 'college/present/logic/CollegeService';
import ChannelSortingModal from './ChannelSortingModal';
import { isSuperManager } from 'shared/ui';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  collegeId: string;
}

interface States {
  isUpdatable: boolean;
  modalOpen: boolean;
  sortingModalOpen: boolean;
}

interface Injected {
  collegeAdminService: CollegeAdminService;
  userGroupService: UserGroupService;
  collegeService: CollegeService;
}

@inject('collegeAdminService', 'userGroupService', 'collegeService')
@observer
@reactAutobind
class CollegeDetailContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      //
      isUpdatable: true,
      modalOpen: false,
      sortingModalOpen: false,
    };
  }

  componentDidMount() {
    //
    const { collegeId } = this.props.match.params;
    const { userGroupService, collegeAdminService } = this.injected;
    userGroupService.findUserGroupMap();

    if (collegeId) {
      this.setState({ isUpdatable: false });
      this.findCollege(collegeId);
    } else {
      collegeAdminService.clearCollege();
    }
  }

  async findCollege(collegeId: string) {
    //
    const { collegeAdminService } = this.injected;

    await collegeAdminService.findCollegeSdo(collegeId);
  }

  async onChangeUpdatable(value: boolean): Promise<void> {
    //
    this.setState({ isUpdatable: value });

    if (this.state.isUpdatable) {
      await this.findCollege(this.props.match.params.collegeId);
    }
  }

  onChangeCollegeProps(name: string, value: any): void {
    //
    const { collegeAdminService } = this.injected;

    collegeAdminService.changeCollegeProps(name, value);
  }

  onSelectedChannel(index: number, value: boolean): void {
    //
    const { collegeAdminService } = this.injected;
    collegeAdminService.changeTargetChannelSelected(index, value);
  }

  onAllSelectedChannel(value: boolean): void {
    //
    const { collegeAdminService } = this.injected;
    collegeAdminService.college.channels.forEach((channel, index) => {
      collegeAdminService.changeTargetChannelSelected(index, value);
    });
  }

  onDeleteChannels(): void {
    //
    const { collegeAdminService } = this.injected;
    const targetChannels = [...collegeAdminService.college.channels];
    collegeAdminService.changeCollegeProps(
      'channels',
      targetChannels.filter((channel) => !channel.selected)
    );
  }

  onDisabledChannel(): void {
    //
    const { collegeAdminService } = this.injected;
    collegeAdminService.college.channels.forEach((channel, index) => {
      if (channel.selected) {
        collegeAdminService.changeTargetChannelEnabled(index, false);
      }
    });
    this.onAllSelectedChannel(false);
  }

  onChangeChannelSequence(oldIndex: number, newIndex: number) {
    //
    const { collegeAdminService } = this.injected;
    const targetChannels = [...collegeAdminService.college.channels];
    const targetChannel = targetChannels[oldIndex];
    if (newIndex > -1 && newIndex < targetChannels.length) {
      targetChannels.splice(oldIndex, 1);
      targetChannels.splice(newIndex, 0, targetChannel);
      collegeAdminService.changeCollegeProps('channels', targetChannels);
    }
  }

  async initialCollegeInChannels(): Promise<void> {
    const { collegeAdminService } = this.injected;
    const { collegeId } = this.props.match.params;
    await collegeAdminService.findByCollegeSdoTargetChannels(collegeId);
  }

  onOpenChannelModal(channel?: ChannelSdo): void {
    //
    const { collegeAdminService } = this.injected;
    if (this.state.isUpdatable) {
      if (channel) {
        collegeAdminService.setChannel(new ChannelSdo(channel));
      } else {
        collegeAdminService.clearChannel();
      }
      this.setState({ modalOpen: true });
    }
  }

  onOpenChannelSortingModal(): void {
    //
    this.setState({
      sortingModalOpen: true,
    });
  }

  onCloseChannelModal(): void {
    //
    this.setState({ modalOpen: false });
  }

  onCloseChannelSotingModal(): void {
    //
    this.setState({ sortingModalOpen: false });
  }

  onSaveChannelSortingModal(channelList: ChannelSdo[]): void {
    //
    const { collegeAdminService } = this.injected;
    collegeAdminService.changeCollegeProps('channels', [...channelList]);
    this.setState({ sortingModalOpen: false });
  }

  routeToCollegeListPage(): void {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/college/college-list`
    );
  }

  async onSave(): Promise<void> {
    //

    const { collegeId } = this.props.match.params;
    const { collegeAdminService, collegeService } = this.injected;

    if (!this.validationCheck(collegeAdminService.college)) {
      return;
    }

    confirm(
      ConfirmModel.getCustomConfirm('College 저장', '저장 하시겠습니까?', false, '확인', '취소', async () => {
        if (collegeId) {
          await collegeAdminService.collegeModify(collegeId, collegeAdminService.college);
        } else {
          await collegeAdminService.collegeRegister(collegeAdminService.college);
        }
        await collegeService.findCollegeApis();
        alert(
          AlertModel.getCustomAlert(false, 'College 저장', '저장되었습니다.', '확인', () => {
            this.routeToCollegeListPage();
          })
        );
      })
    );
  }

  validationCheck(college: CollegeSdo): boolean {
    //
    const langSupports: LangSupport[] = [
      { defaultLang: false, lang: Language.Ko },
      { defaultLang: false, lang: Language.En },
      { defaultLang: false, lang: Language.Zh },
    ];
    let message = '';
    if (isPolyglotBlank(langSupports, college.name)) {
      message = 'College 명을 입력해주세요.';
    }

    if (isPolyglotBlank(langSupports, college.description)) {
      message = 'College 설명을 입력해주세요.';
    }

    if (message) {
      alert(AlertModel.getCustomAlert(true, 'College 필수 입력', message, '확인'));
      return false;
    }

    return true;
  }

  getFirstDepthChannelName(channelId: string) {
    //
    const { collegeAdminService } = this.injected;
    const { college } = collegeAdminService;
    const findChannel = college.channels
      .filter((channel) => !channel.parentId)
      .find((channel) => channel.id === channelId);
    return (findChannel && findChannel.name) || new PolyglotModel();
  }

  getChannels() {
    const { college } = this.injected.collegeAdminService;
    const newChannelList: ChannelSdo[] = [];

    console.dir(college.channels);

    college &&
      college.channels &&
      college.channels.length > 0 &&
      college.channels.map((channel) => {
        if (!channel.parentId) {
          newChannelList.push(channel);
          newChannelList.push(...college.channels.filter((tempChannel) => tempChannel.parentId === channel.id));
        }
      });

    return newChannelList;
  }

  render() {
    //
    const { isUpdatable, modalOpen, sortingModalOpen } = this.state;
    const { collegeAdminService, userGroupService } = this.injected;
    const { college } = collegeAdminService;

    return (
      <Container fluid>
        <div className="contents">
          <PageTitle breadcrumb={SelectType.collegeSections} />
          <CollegeBasicInfoView
            onChangeCollegeProps={this.onChangeCollegeProps}
            updatable={isUpdatable}
            college={college}
          />
          <CollegeInChannelInfoView
            onOpenChannelModal={this.onOpenChannelModal}
            onOpenChannelSortingModal={this.onOpenChannelSortingModal}
            selectChangeChannel={this.onSelectedChannel}
            allSelectChangeChannels={this.onAllSelectedChannel}
            deleteChannels={this.onDeleteChannels}
            onDisabledChannel={this.onDisabledChannel}
            changeChannelSequence={this.onChangeChannelSequence}
            initialCollegeInChannels={this.initialCollegeInChannels}
            getFirstDepthChannelName={this.getFirstDepthChannelName}
            updatable={isUpdatable}
            channels={this.getChannels()}
            userGroupMap={userGroupService.userGroupMap}
          />
          <SubActions form>
            <SubActions.Left>
              {isUpdatable ? (
                <Button onClick={() => this.onChangeUpdatable(false)}>취소</Button>
              ) : (
                <Button onClick={() => this.onChangeUpdatable(true)}>수정</Button>
              )}
            </SubActions.Left>
            <SubActions.Right>
              <Button onClick={this.routeToCollegeListPage}>목록</Button>
              <Button disabled={!isUpdatable} primary onClick={this.onSave}>
                저장
              </Button>
            </SubActions.Right>
          </SubActions>
        </div>
        <ChannelCreateModal open={modalOpen} onClose={this.onCloseChannelModal} isUpdatable />

        <ChannelSortingModal
          open={sortingModalOpen}
          onClose={this.onCloseChannelSotingModal}
          onSave={this.onSaveChannelSortingModal}
        />
      </Container>
    );
  }
}

export default withRouter(CollegeDetailContainer);
