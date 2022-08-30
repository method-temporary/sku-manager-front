import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Table } from 'semantic-ui-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { UserGroupRuleModel, PolyglotModel } from 'shared/model';
import { SubActions } from 'shared/components';
import ChannelSdo from '../../model/dto/ChannelSdo';
import CollegeInChannelListView from './CollegeInChannelListView';

interface Props {
  onOpenChannelModal: (channel?: ChannelSdo) => void;
  onOpenChannelSortingModal: () => void;
  selectChangeChannel: (index: number, value: boolean) => void;
  allSelectChangeChannels: (value: boolean) => void;
  deleteChannels: () => void;
  onDisabledChannel: () => void;
  changeChannelSequence: (oldIndex: number, newIndex: number) => void;
  initialCollegeInChannels: () => void;
  getFirstDepthChannelName: (channelId: string) => PolyglotModel;

  updatable: boolean;
  channels: ChannelSdo[];
  userGroupMap: Map<number, UserGroupRuleModel>;
}

interface States {}

@observer
@reactAutobind
class CollegeInChannelInfoView extends ReactComponent<Props, States> {
  //
  render() {
    //
    const {
      onOpenChannelModal,
      onOpenChannelSortingModal,
      selectChangeChannel,
      allSelectChangeChannels,
      changeChannelSequence,
      initialCollegeInChannels,
      getFirstDepthChannelName,
    } = this.props;
    const { updatable, channels, userGroupMap } = this.props;


    return (
      <>
        <Table title="Channel 정보">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="title-header">Channel 정보</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                {updatable ? (
                  <SubActions>
                    <SubActions.Left>
                      <Button disabled={!updatable} onClick={() => onOpenChannelSortingModal()}>
                        순서 변경
                      </Button>
                    </SubActions.Left>
                    <SubActions.Right>
                      {/*<Button disabled={!updatable} onClick={onDisabledChannel}>*/}
                      {/*  사용중지*/}
                      {/*</Button>*/}
                      <span style={{ color: 'red', paddingLeft: '0px', paddingRight: '10px', position: 'inherit' }}>
                        * 1Depth 생성 후 [저장] 버튼을 눌러주셔야 2Depth 등록이 가능합니다.{' '}
                      </span>

                      <Button disabled={!updatable} onClick={initialCollegeInChannels}>
                        초기화
                      </Button>
                      {/*<Button disabled={!updatable} onClick={deleteChannels}>*/}
                      {/*  삭제*/}
                      {/*</Button>*/}
                      <Button disabled={!updatable} onClick={(e: any, data: any) => onOpenChannelModal()}>
                        생성
                      </Button>
                    </SubActions.Right>
                  </SubActions>
                ) : null}
                <CollegeInChannelListView
                  onOpenChannelModal={onOpenChannelModal}
                  selectChangeChannel={selectChangeChannel}
                  allSelectChangeChannels={allSelectChangeChannels}
                  changeChannelSequence={changeChannelSequence}
                  getFirstDepthChannelName={getFirstDepthChannelName}
                  updatable={updatable}
                  channels={channels}
                  userGroupMap={userGroupMap}
                />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </>
    );
  }
}
export default CollegeInChannelInfoView;
