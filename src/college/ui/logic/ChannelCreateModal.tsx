import React, { ReactElement } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Container, ModalHeader, ModalProps } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { GroupAccessRule, GroupBasedAccessRuleModel, UserGroupRuleModel } from 'shared/model';
import { AccessRuleService } from 'shared/present';
import { alert, AlertModel, Modal } from 'shared/components';
import { Language, LangSupport, getPolyglotToString, isPolyglotBlank } from 'shared/components/Polyglot';

import ChannelDetailView from '../view/ChannelDetailView';
import CollegeAdminService from '../../present/logic/CollegeAdminService';
import { UserGroupService } from '../../../usergroup';
import ChannelSdo from '../../model/dto/ChannelSdo';

interface Props extends ModalProps {
  onClose: () => void;
  updatable?: boolean;
  trigger?: ReactElement;
  isUpdatable?: boolean;
}

interface States {}

interface Injected {
  collegeAdminService: CollegeAdminService;
  accessRuleService: AccessRuleService;
  userGroupService: UserGroupService;
}

@inject('collegeAdminService', 'accessRuleService', 'userGroupService')
@observer
@reactAutobind
class ChannelCreateModal extends ReactComponent<Props, States, Injected> {
  //

  componentDidMount() {
    //
    const { collegeAdminService } = this.injected;
    const { channel } = collegeAdminService;

    if (channel.id) {
      this.findGroupBasedAccessRules();
    }
  }

  async findGroupBasedAccessRules(): Promise<void> {
    //
    const { collegeAdminService, accessRuleService, userGroupService } = this.injected;
    await userGroupService.findUserGroupMap();

    const accessRules: GroupAccessRule[] = collegeAdminService.channel.groupBasedAccessRule.accessRules.map(
      (accessRule): GroupAccessRule => {
        return new GroupAccessRule(
          accessRule.groupSequences
            .map((groupSequence): UserGroupRuleModel => {
              const userGroup = userGroupService.userGroupMap.get(groupSequence);
              return new UserGroupRuleModel(
                userGroup?.categoryId,
                userGroup?.categoryName,
                userGroup?.userGroupId,
                userGroup?.userGroupName,
                userGroup?.seq
              );
            })
            .filter((userGroupRuleModel) => userGroupRuleModel.categoryId !== '')
        );
      }
    );
    const groupBasedAccessRuleModel = new GroupBasedAccessRuleModel();

    groupBasedAccessRuleModel.useWhitelistPolicy = collegeAdminService.channel.groupBasedAccessRule.useWhitelistPolicy;
    groupBasedAccessRuleModel.accessRules = accessRules;

    accessRuleService.setGroupBasedAccessRule(groupBasedAccessRuleModel);
  }

  onChangeChannelProps(name: string, value: any): void {
    //
    const { collegeAdminService } = this.injected;
    collegeAdminService.changeChannelProps(name, value);
  }

  onChangeSecondDepth(value: boolean) {
    this.setState({
      selectedSecondDepth: value,
    });
  }

  onSaveChannel(): void {
    //
    const { collegeAdminService, accessRuleService } = this.injected;

    if (!this.validationCheck(collegeAdminService.channel)) {
      return;
    }
    // accessRule 저장
    collegeAdminService.changeChannelProps(
      'groupBasedAccessRule',
      GroupBasedAccessRuleModel.asGroupBasedAccessRule(accessRuleService.groupBasedAccessRule)
    );

    const { college, channel } = collegeAdminService;
    const targetChannels = [...college.channels];
    if (channel.id) {
      targetChannels.splice(
        targetChannels.findIndex((target) => target.id === channel.id),
        1,
        channel
      );
    } else {
      if (channel.modified) {
        targetChannels.splice(
          targetChannels.findIndex((target) => getPolyglotToString(target.beforeChangeName) === channel.modified),
          1,
          new ChannelSdo(channel)
        );
      } else {
        this.onChangeChannelProps('beforeChangeName', channel.name);

        this.sortingSecondDepthChannel(targetChannels, channel);
      }
    }
    // channel 저장
    collegeAdminService.changeCollegeProps('channels', targetChannels);

    this.props.onClose();
  }

  sortingSecondDepthChannel(channelList: ChannelSdo[], targetChannel: ChannelSdo): ChannelSdo[] {
    //
    if (!targetChannel.parentId) {
      channelList.push(targetChannel);
    } else {
      // channelList.map((channel, idx) => {
      //   channel.id === targetChannel.parentId && channel.children.push(new ChannelSdo(targetChannel));
      // });
      let findIdx = channelList.length;

      channelList.map((channel, idx) => {
        findIdx =
          ((channel.id === targetChannel.parentId || channel.parentId === targetChannel.parentId) && idx + 1) ||
          findIdx;
      });

      channelList.splice(findIdx, 0, targetChannel);
    }
    return channelList;
  }

  validationCheck(channel: ChannelSdo): boolean {
    //
    const langSupports: LangSupport[] = [
      { defaultLang: false, lang: Language.Ko },
      { defaultLang: false, lang: Language.En },
      { defaultLang: false, lang: Language.Zh },
    ];
    if (isPolyglotBlank(langSupports, channel.name)) {
      alert(AlertModel.getCustomAlert(true, '채널 필수정보', '채널 이름을 입력해주세요.', '확인'));
      return false;
    }

    if (isPolyglotBlank(langSupports, channel.description)) {
      alert(AlertModel.getCustomAlert(true, '채널 필수정보', '채널 설명을 입력해주세요.', '확인'));
      return false;
    }

    return true;
  }

  render() {
    //
    const { onClose } = this.props;
    const { updatable, trigger, open, isUpdatable } = this.props;
    const { collegeAdminService } = this.injected;
    const { channel, firstDepthChannel, selectedSecondDepthChannel, changeSecondDepthChannel } = collegeAdminService;

    return (
      <Modal
        size="large"
        triggerAs="a"
        trigger={trigger}
        modSuper={!updatable}
        open={open}
        onMount={this.findGroupBasedAccessRules}
      >
        <ModalHeader className="res">Channel 등록</ModalHeader>
        <Modal.Content>
          <Container fluid>
            <ChannelDetailView
              firstDepthChannelList={firstDepthChannel}
              onChangeChannelProps={this.onChangeChannelProps}
              channel={channel}
              selectedSecondDepth={selectedSecondDepthChannel}
              onChangeDepth={changeSecondDepthChannel}
              isUpdatable
            />
          </Container>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>취소</Button>
          <Button onClick={this.onSaveChannel}>저장</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ChannelCreateModal;
