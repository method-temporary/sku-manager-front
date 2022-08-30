import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Breadcrumb, Header, Button, Icon, Table, Grid, Form, Input } from 'semantic-ui-react';

import { reactAutobind, reactAlert } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SearchBoxFieldView } from 'shared/ui';

import { ChannelModel } from '../../model/ChannelModel';
import { ChannelService } from '../../../index';
import { ChannelListModel } from '../../model/vo/ChannelListModel';
import 'react-datepicker/dist/react-datepicker.css';

interface Props extends RouteComponentProps<{ coursePlanId: string }> {
  channelService?: ChannelService;
  addCollegeList: () => void;
  onChangePostQueryProps: (name: string, value: string) => void;
  collegeId?: string;
  channelList?: ChannelListModel[];
  handleModify: (channelId: string) => void;
  handleCancel: (channelId: string) => void;
  handleOrderSave: () => void;
  handleUpButtonForList: (channel: any, place: number) => void;
  handleCreate: (collegeId: string, gubun: string, channel: any) => void;
  handleChangeName: (channelId: string, name: string, value: string) => void;
}

interface States {}

@inject('channelService')
@observer
@reactAutobind
class ChannelListView extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    //
    // this.init();
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    const { collegeId } = this.props;
    const { collegeId: prevCollegeId } = prevProps;

    if (collegeId !== prevCollegeId) {
      // this.init();
    }
  }

  // 추가하면 추가한 것 저장할때까지 다른애들 수정, 삭제 안되게
  // 하나만 추가할 수 있게
  addNewChannel() {
    const { channelService } = this.props;
    const { postQuery } = channelService!;
    if (channelService!.newChannels.length === 0 && postQuery.value !== 'All' && postQuery.value !== '') {
      channelService!.addNewChannel();
    }
  }

  removeNewChannel(index: number) {
    const { channelService } = this.props;
    channelService!.removeNewChannel(index);
  }

  onChangeNewChannel(index: number, name: string, value: string) {
    const { channelService } = this.props;
    if (name === 'name' && value.length > 25) {
      reactAlert({
        title: '알림',
        message: 'Channel 명은 25자를 넘을 수 없습니다.',
      });
    } else {
      channelService!.onChangeNewChannel(index, name, value);
    }
  }

  onChangeChannelProps(channelId: string, name: string, value: string) {
    if (name === 'name' && value.length > 25) {
      reactAlert({
        title: '알림',
        message: 'Channel 명은 25자를 넘을 수 없습니다.',
      });
    } else {
      const { handleChangeName } = this.props;
      handleChangeName(channelId, name, value);
    }
  }

  render() {
    const {
      addCollegeList,
      onChangePostQueryProps,
      channelList,
      handleModify,
      handleCancel,
      handleOrderSave,
      handleUpButtonForList,
      handleCreate,
    } = this.props;
    const { channels, postQuery, newChannels } = this.props.channelService || ({} as ChannelService);
    const collegeList: any = addCollegeList();
    return (
      <>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.pathForChannel} />
          <Header as="h2">Channel 관리</Header>
        </div>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={15}>
                      <label style={{ marginLeft: '100px' }}>College</label>
                      <div className="action-btn-group">
                        <SearchBoxFieldView
                          fieldTitle=""
                          fieldOption={collegeList}
                          onChangeQueryProps={onChangePostQueryProps}
                          targetValue={(postQuery && postQuery.value) || 'All'}
                          queryFieldName="channelId"
                        />
                      </div>
                      {/* <Form.Field
                      control={Select}
                      placeholder="Select"
                      options={collegeList}
                      value={(postQuery && postQuery.value) || 'All'}
                      onChange={(e: any, data: any) =>
                        onChangePostQueryProps('channelId', data.value)
                      }
                    /> */}
                      <Button primary style={{ float: 'right' }} onClick={handleOrderSave}>
                        순서변경
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        </Table>
        <Table celled selectable>
          <colgroup>
            <col width="10%" />
            <col width="15%" />
            <col width="25%" />
            <col width="50%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>College</Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell>Channel 명</Table.HeaderCell>
              <Table.HeaderCell>채널 소개</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(channelList &&
              channelList.map((channel, index: number) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{index === 0 && postQuery.text}</Table.Cell>
                    {(!channel.open && (
                      <>
                        <Table.Cell>
                          <div className="action-btn-group">
                            <Button icon size="mini" basic onClick={() => handleUpButtonForList(channel, 1)}>
                              <Icon name="angle down" />
                            </Button>
                            <Button icon size="mini" basic onClick={() => handleUpButtonForList(channel, -1)}>
                              <Icon name="angle up" />
                            </Button>
                            <Button content="수정" icon size="mini" basic onClick={() => handleModify(channel.id)} />
                          </div>
                        </Table.Cell>
                        <Table.Cell>{channel.name}</Table.Cell>
                        <Table.Cell>{channel.description}</Table.Cell>
                      </>
                    )) ||
                      (channel.open && (
                        <>
                          <Table.Cell>
                            <div className="action-btn-group">
                              <Button icon size="mini" basic onClick={() => handleCancel(channel.id)}>
                                <Icon name="minus" />
                              </Button>
                              <Button
                                content="저장"
                                icon
                                size="mini"
                                basic
                                onClick={() => handleCreate(channel.id, 'channel', channel)}
                              />
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <Form.Field
                              fluid
                              control={Input}
                              placeholder="Channel 명을 입력해주세요."
                              // maxLength={11}
                              value={(channel && channel.name) || ''}
                              onChange={(e: any) => this.onChangeChannelProps(channel.id, 'name', e.target.value)}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Form.Group>
                              <Form.Field
                                // style={{ width: '80%' }}
                                fluid
                                control={Input}
                                placeholder="카테고리명을 입력해주세요."
                                value={(channel && channel.description) || ''}
                                onChange={(e: any) =>
                                  this.onChangeChannelProps(channel.id, 'description', e.target.value)
                                }
                              />
                            </Form.Group>
                          </Table.Cell>
                        </>
                      ))}
                  </Table.Row>
                );
              })) ||
              null}
            {/* 신규 추가 */}
            {(newChannels &&
              newChannels.map((channelModel: ChannelModel, index: number) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell />
                    <Table.Cell>
                      <div className="action-btn-group">
                        <Button icon size="mini" basic onClick={() => this.removeNewChannel(index)}>
                          <Icon name="minus" />
                        </Button>
                        <Button
                          content="저장"
                          icon
                          size="mini"
                          basic
                          onClick={() => handleCreate(postQuery.value, 'college', '')}
                        />
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Field
                        fluid
                        control={Input}
                        placeholder="Channel 명을 입력해주세요."
                        value={(channelModel && channelModel.name) || ''}
                        onChange={(e: any) => this.onChangeNewChannel(index, 'name', e.target.value)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Field
                        fluid
                        control={Input}
                        placeholder="채널 설명을 입력해주세요."
                        // maxLength={11}
                        value={(channelModel && channelModel.description) || ''}
                        onChange={(e: any) => this.onChangeNewChannel(index, 'description', e.target.value)}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })) ||
              null}
          </Table.Body>
        </Table>
        <Grid>
          <Grid.Column width={16}>
            <div className="center">
              <Button icon basic onClick={this.addNewChannel} type="button">
                <Icon name="plus" />
              </Button>
            </div>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

export default withRouter(ChannelListView);
