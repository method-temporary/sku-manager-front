import * as React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { UserGroupRuleModel, PolyglotModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { getBasedAccessRuleView } from 'shared/helper';
import ChannelSdo from '../../model/dto/ChannelSdo';

interface Props {
  onOpenChannelModal: (channel?: ChannelSdo) => void;
  selectChangeChannel: (index: number, value: boolean) => void;
  allSelectChangeChannels: (value: boolean) => void;
  changeChannelSequence: (oldIndex: number, newIndex: number) => void;
  getFirstDepthChannelName: (channelId: string) => PolyglotModel;

  updatable: boolean;
  channels: ChannelSdo[];
  userGroupMap: Map<number, UserGroupRuleModel>;
}

interface States {}

@observer
@reactAutobind
class CollegeInChannelListView extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { onOpenChannelModal, getFirstDepthChannelName } = this.props;
    const { updatable, channels, userGroupMap } = this.props;

    // const allChecked = channels.filter((channel) => !channel.selected).length == 0 && channels.length !== 0;
    return (
      <Table celled selectable={updatable}>
        <colgroup>
          {/* {updatable ? <col width="5%" /> : null} */}
          <col width="5%" />
          {/* {updatable ? <col width="9%" /> : null} */}
          <col width="20%" />
          <col width="20%" />
          <col width="9%" />
          <col width="18%" />
          <col />
        </colgroup>
        <Table.Header>
          <Table.Row>
            {/* {updatable ? (
              <Table.HeaderCell textAlign="center">
                <Form.Field
                  control={Checkbox}
                  checked={allChecked}
                  disabled={!updatable}
                  onChange={() => allSelectChangeChannels(!allChecked)}
                />
              </Table.HeaderCell>
            ) : null} */}
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            {/* {updatable ? <Table.HeaderCell textAlign="center">순서</Table.HeaderCell> : null} */}
            <Table.HeaderCell textAlign="center">채널 1Depth</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">채널 2Depth</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">사용여부</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록일시</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">사용자그룹</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(channels &&
            channels.length > 0 &&
            channels.map((channel, index) => {
              return (
                <Table.Row key={index} onClick={() => onOpenChannelModal(channel)}>
                  {/* {updatable ? (
                    <Table.Cell textAlign="center" onClick={(event: any) => event.stopPropagation()}>
                      <Form.Field
                        control={Checkbox}
                        checked={channel.selected}
                        disabled={!updatable}
                        onChange={() => selectChangeChannel(index, !channel.selected)}
                      />
                    </Table.Cell>
                  ) : null} */}
                  <Table.Cell textAlign="center">{channels.length - (channels.length - index - 1)}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {(channel.parentId && getPolyglotToAnyString(getFirstDepthChannelName(channel.parentId))) ||
                      getPolyglotToAnyString(channel.name)}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {(channel.parentId && getPolyglotToAnyString(channel.name)) || '-'}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{channel.enabled ? 'O' : 'X'}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {channel.registeredTime ? moment(channel.registeredTime).format('YYYY.MM.DD HH:mm:ss') : '-'}
                  </Table.Cell>
                  <Table.Cell>
                    {channel.groupBasedAccessRule && getBasedAccessRuleView(channel.groupBasedAccessRule, userGroupMap)}
                  </Table.Cell>
                </Table.Row>
              );
            })) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={7}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">등록된 채널이 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }
}
export default CollegeInChannelListView;
