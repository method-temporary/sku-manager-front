import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ReactElement } from 'react';
import { Button, Container, Form, Icon, ModalHeader, ModalProps, Table } from 'semantic-ui-react';
import { getPolyglotToAnyString } from 'shared/components/Polyglot/logic/PolyglotLogic';
import { FormTable, Modal } from '../../../shared/components';
import ChannelSdo from '../../model/dto/ChannelSdo';
import CollegeAdminService from '../../present/logic/CollegeAdminService';

interface Props extends ModalProps {
  onClose: () => void;
  onSave: (channelList: ChannelSdo[]) => void;
  trigger?: ReactElement;
}

interface States {
  firstDepthChannelList: ChannelSdo[];
  selectedFirstChannelId: string;
}

interface Injected {
  collegeAdminService: CollegeAdminService;
}

@inject('collegeAdminService')
@observer
@reactAutobind
class ChannelSortingModal extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: any) {
    super(props);
    this.state = {
      firstDepthChannelList: [],
      selectedFirstChannelId: '',
    };
  }

  initFirstDepthChannelList() {
    //
    const { college } = this.injected.collegeAdminService;

    // const firstDepthChannelList = [...college.channels.filter((channel) => !channel.parentId)];
    const secondDepthChannelList = [...college.channels.filter((channel) => channel.parentId)];

    const firstDepthMap: Map<string, ChannelSdo[]> = new Map<string, ChannelSdo[]>();
    secondDepthChannelList &&
      secondDepthChannelList.length > 0 &&
      secondDepthChannelList.map(
        (channel) =>
          channel.parentId &&
          firstDepthMap.set(channel.parentId, [...(firstDepthMap.get(channel.parentId) || []), channel])
      );

    const firstDepthChannelList: ChannelSdo[] = [];

    college.channels.map((channel) => {
      if (!channel.parentId) {
        firstDepthChannelList.push({ ...channel, children: firstDepthMap.get(channel.id) || [] });
      }
    });

    this.setState({ firstDepthChannelList, selectedFirstChannelId: '' });
  }

  changeFirstChannelSequence(oldIndex: number, newIndex: number) {
    //
    const targetChannels = [...this.state.firstDepthChannelList];
    const targetChannel = targetChannels[oldIndex];
    if (newIndex > -1 && newIndex < targetChannels.length) {
      targetChannels.splice(oldIndex, 1);
      targetChannels.splice(newIndex, 0, targetChannel);
      this.setState({ firstDepthChannelList: [...targetChannels] });
    }
  }

  changeSecondChannelSequence(oldIndex: number, newIndex: number) {
    //
    const { firstDepthChannelList, selectedFirstChannelId } = this.state;
    const copiedFirstChannelList = [...firstDepthChannelList];
    let targetFirstIdx = 0;
    let targetFirstChannel = copiedFirstChannelList.find((channel, idx) => {
      if (channel.id === selectedFirstChannelId) {
        targetFirstIdx = idx;
        return true;
      }
      return false;
    });

    const copiedSecondChannelList = (targetFirstChannel && targetFirstChannel.children) || [];
    const targetChannel = copiedSecondChannelList[oldIndex];

    if (newIndex > -1 && newIndex < copiedSecondChannelList.length) {
      copiedSecondChannelList.splice(oldIndex, 1);
      copiedSecondChannelList.splice(newIndex, 0, targetChannel);
    }

    targetFirstChannel = targetFirstChannel && { ...targetFirstChannel, children: copiedSecondChannelList || [] };
    targetFirstChannel && copiedFirstChannelList.splice(targetFirstIdx, 1, targetFirstChannel);

    this.setState({ firstDepthChannelList: [...copiedFirstChannelList] });
  }

  onClickFirstDepthChannel(channelId: string) {
    //
    this.setState({
      selectedFirstChannelId: channelId,
    });
  }

  onSave() {
    //
    const { firstDepthChannelList } = this.state;
    const { onSave } = this.props;
    const newList: ChannelSdo[] = [];

    firstDepthChannelList &&
      firstDepthChannelList.length > 0 &&
      firstDepthChannelList.map((firstChannel) => {
        newList.push(firstChannel);
        firstChannel.children &&
          firstChannel.children.length > 0 &&
          firstChannel.children.map((secondChannel) => newList.push(secondChannel));
      });

    onSave(newList);
  }

  render() {
    //
    const { updatable, trigger, open, onClose, onSave } = this.props;
    const { firstDepthChannelList, selectedFirstChannelId } = this.state;

    const secondDepthChannelList = firstDepthChannelList.find(
      (channel) => channel.id === selectedFirstChannelId
    )?.children;

    return (
      <Modal
        size="large"
        triggerAs="a"
        trigger={trigger}
        modSuper={!updatable}
        open={open}
        onMount={this.initFirstDepthChannelList}
      >
        <ModalHeader className="res">Channel 순서변경</ModalHeader>
        <Modal.Content>
          <Container fluid>
            <Form>
              <FormTable title="Channel 정보">
                <FormTable.Row name="1Depth Channel 순서" required>
                  <Table celled selectable={true}>
                    <colgroup>
                      <col width="9%" />
                      <col width="20%" />
                      <col width="20%" />
                    </colgroup>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">순서</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">채널명</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {firstDepthChannelList &&
                        firstDepthChannelList.length > 0 &&
                        firstDepthChannelList.map((channel, index) => {
                          return (
                            <Table.Row key={index} onClick={() => this.onClickFirstDepthChannel(channel.id)}>
                              <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                              <Table.Cell textAlign="center">
                                <div>
                                  <Button
                                    disabled={index === firstDepthChannelList.length - 1}
                                    icon
                                    size="mini"
                                    basic
                                    onClick={() => this.changeFirstChannelSequence(index, index + 1)}
                                  >
                                    <Icon name="angle down" />
                                  </Button>
                                  <Button
                                    disabled={index === 0}
                                    icon
                                    size="mini"
                                    basic
                                    onClick={() => this.changeFirstChannelSequence(index, index - 1)}
                                  >
                                    <Icon name="angle up" />
                                  </Button>
                                </div>
                              </Table.Cell>
                              <Table.Cell textAlign="center">{getPolyglotToAnyString(channel.name)}</Table.Cell>
                            </Table.Row>
                          );
                        })}
                    </Table.Body>
                  </Table>
                </FormTable.Row>
                {(secondDepthChannelList && secondDepthChannelList.length > 0 && (
                  <FormTable.Row name="2Depth Channel 순서" required>
                    <Table celled selectable={updatable}>
                      <colgroup>
                        <col width="9%" />
                        <col width="20%" />
                        <col width="20%" />
                      </colgroup>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                          <Table.HeaderCell textAlign="center">순서</Table.HeaderCell>
                          <Table.HeaderCell textAlign="center">채널명</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {secondDepthChannelList.map((channel, index) => {
                          return (
                            <Table.Row key={index}>
                              <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                              <Table.Cell textAlign="center">
                                <div>
                                  <Button
                                    disabled={index === secondDepthChannelList.length - 1}
                                    icon
                                    size="mini"
                                    basic
                                    onClick={() => this.changeSecondChannelSequence(index, index + 1)}
                                  >
                                    <Icon name="angle down" />
                                  </Button>
                                  <Button
                                    disabled={index === 0}
                                    icon
                                    size="mini"
                                    basic
                                    onClick={() => this.changeSecondChannelSequence(index, index - 1)}
                                  >
                                    <Icon name="angle up" />
                                  </Button>
                                </div>
                              </Table.Cell>
                              <Table.Cell textAlign="center">{getPolyglotToAnyString(channel.name)}</Table.Cell>
                            </Table.Row>
                          );
                        })}
                      </Table.Body>
                    </Table>
                  </FormTable.Row>
                )) ||
                  null}
              </FormTable>
              <span style={{ color: 'red' }}>* 2Depth 순서를 변경할 경우, 1Depth 채널명을 선택해 주세요. </span>
            </Form>
          </Container>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>취소</Button>
          <Button onClick={this.onSave}>저장</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ChannelSortingModal;
