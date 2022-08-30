import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Container } from 'semantic-ui-react';

import { reactAutobind, reactAlert } from '@nara.platform/accent';

import { IdName } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import ChannelListView from '../view/ChannelListView';
import { ChannelService } from '../../../index';
import { ChannelModel } from '../../model/ChannelModel';
import { ChannelListModel } from '../../model/vo/ChannelListModel';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  channelService?: ChannelService;
}

interface States {
  collegeId: string;
  channelList: ChannelListModel[];
}

@inject('channelService')
@observer
@reactAutobind
class ChannelListContainer extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      collegeId: '',
      channelList: [],
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const { channelService } = this.props;
    channelService!.getCollegeInfo();
  }

  // selectbox list add
  addCollegeList() {
    const { colleges } = this.props.channelService || ({} as ChannelService);
    const list: any = [{ key: 0, text: '전체', value: 'All' }];
    if (colleges && colleges.length) {
      colleges.map((college, index) => {
        list.push({
          key: index + 1,
          text: college.name,
          value: college.id,
        });
      });
    }
    return list;
  }

  // selectbox 선택
  onChangePostQueryProps(name: string, value: string) {
    const { channelService } = this.props;
    const { colleges, newChannels } = channelService!;
    const selectedCollege = colleges.filter((data) => {
      return data.id === value;
    });
    const text = (selectedCollege.length > 0 && selectedCollege[0].name) || '';
    // console.log(selectedCollege[0].name);
    channelService!.changePostQueryProps(name, value, text);
    this.setState({ collegeId: value });
    if (value === 'All') {
      this.setState({
        channelList: [],
      });
      if (newChannels.length > 0) {
        channelService!.removeNewChannel(0);
      }
    } else {
      this.getChannelInfo(value);
    }
  }

  // channel 조회
  getChannelInfo(value: string) {
    const { channelService } = this.props;
    const { newChannels } = channelService!;
    channelService!.getChannelInfo(value).then((channels) => {
      let newList: ChannelListModel[] = [];
      channels.map((channel, index) => {
        const idName: ChannelListModel[] = [
          {
            id: channel.id,
            name: getPolyglotToAnyString(channel.name),
            description: channel.description,
            open: false,
          },
        ];
        newList = newList.concat(idName);
      });
      this.setState({
        channelList: newList,
      });
      if (newChannels.length > 0) {
        channelService!.removeNewChannel(0);
      }
    });
  }

  handleModify(index: string) {
    const { channelList } = this.state;
    const data = { channelId: index, open: true };
    this.setState({
      channelList: channelList.map((channel) => {
        return channel.id === index ? { ...channel, ...data } : channel;
      }),
    });
  }

  // 수정취소
  handleCancel(channelId: string) {
    const { channelList } = this.state;
    const { channelService } = this.props;
    const { channels } = channelService!;
    const origin = channels.filter((data) => {
      return data.id === channelId;
    })[0];
    const data = {
      channelId: origin.id,
      name: getPolyglotToAnyString(origin.name),
      description: origin.description,
      open: false,
    };
    this.setState({
      channelList: channelList.map((channel) => {
        return channel.id === channelId ? { ...channel, ...data } : channel;
      }),
    });
  }

  // 채널추가, 수정
  handleCreate(id: string, gubun: string, channel: any) {
    const { channelService } = this.props;
    const { newChannels, postQuery } = channelService!;
    const { channelList } = this.state;
    if (gubun === 'college') {
      ////////////////////// 신규채널
      // 값이 없으면 return
      if (getPolyglotToAnyString(newChannels[0].name).length !== 0 && newChannels[0].description.length !== 0) {
        const data = {
          collegeId: id,
          name: newChannels[0].name,
          description: newChannels[0].description,
        };
        // console.log('create param :', data);
        channelService!.registerChannel(data).then((channelId) => {
          reactAlert({
            title: '',
            message: '저장되었습니다.',
          });
          // 조회
          this.getChannelInfo(postQuery.value);
        });
      }
    } else {
      ///////////////////// 수정
      const channelData = channelList.filter((data) => {
        return data.id === id;
      });
      // 값이 없으면 return
      if (channelData[0].name.length !== 0 && channelData[0].description.length !== 0) {
        const data = {
          name: channelData[0].name,
          description: channelData[0].description,
        };
        channelService!.modifyChannel(id, ChannelModel.asNameValueList(data)).then(() => {
          this.handleOrderSave();
        });
      }
    }
  }

  // channel 순서 변경
  handleUpButtonForList(channel: any, place: number) {
    //
    const { channelList } = this.state;
    const channelIndex = channelList.indexOf(channel);
    let newChannelIndex = channelIndex + place;
    if (newChannelIndex >= channelList.length) {
      newChannelIndex = channelList.length;
    }
    if (newChannelIndex === -1) newChannelIndex = 0;
    const newChannelSet = [...channelList];

    newChannelSet.splice(channelIndex, 1);
    newChannelSet.splice(newChannelIndex, 0, channel);
    this.setState({
      channelList: newChannelSet,
    });
  }

  // channel name, description change
  handleChangeName(channelId: string, name: string, value: string) {
    const { channelList } = this.state;
    let data = {};
    if (name === 'name') {
      data = { name: value };
    } else {
      data = { description: value };
    }
    this.setState({
      channelList: channelList.map((channel) => {
        return channel.id === channelId ? { ...channel, ...data } : channel;
      }),
    });
  }

  // 순서저장
  handleOrderSave() {
    const { channelService } = this.props;
    const { postQuery } = channelService!;
    if (postQuery.value !== 'All' && postQuery.value !== '') {
      const { channelList } = this.state;
      const idNames: any[] = [];
      channelList.map((item) => {
        const idname = new IdName({ id: item.id, name: item.name });
        idNames.push(idname);
      });

      channelService!.orderSaveChannel(postQuery.value, idNames).then(() => {
        reactAlert({
          title: '',
          message: '저장되었습니다.',
        });
        // 조회
        this.getChannelInfo(postQuery.value);
      });
    }
  }

  render() {
    const { collegeId, channelList } = this.state;
    return (
      <Container fluid>
        <ChannelListView
          addCollegeList={this.addCollegeList}
          onChangePostQueryProps={this.onChangePostQueryProps}
          collegeId={collegeId}
          channelList={channelList}
          handleModify={this.handleModify}
          handleCancel={this.handleCancel}
          handleOrderSave={this.handleOrderSave}
          handleUpButtonForList={this.handleUpButtonForList}
          handleCreate={this.handleCreate}
          handleChangeName={this.handleChangeName}
        />
      </Container>
    );
  }
}

export default withRouter(ChannelListContainer);
