import React from 'react';
import { observer } from 'mobx-react';
import { Button, Checkbox, Form, Icon, List, Radio, Segment } from 'semantic-ui-react';

import { alert, AlertModel, Modal } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CollegeChannel } from '_data/college/model/CollegeChannel';

import { useFindColleges, useFindCollegesForCineroomId } from '../../../College.hook';
import {
  getChannelWithAnotherInfo,
  getMakeSelectSubChannels,
  isCheckedChannel,
  isDisabledChannel,
  onClickChannel,
  sortChannelDepths,
} from './CollegeSelectedModal.util';

import CollegeSelectedModalStore from './CollegeSelectedModal.store';
import { ChannelWithAnotherInfo } from './model/ChannelWithAnotherInfo';
import { CubeModel } from 'cube/cube/model/CubeModel';
import { CardModel } from 'card';

interface Props {
  readonly?: boolean;
  isSubChannel?: boolean;
  mainChannel?: ChannelWithAnotherInfo;
  subChannels?: ChannelWithAnotherInfo[];
  onCancel?: () => void;
  onOk?: (channels: ChannelWithAnotherInfo[], isSubChannel: boolean) => void;
}

const CollegeSelectedModal = observer(({ readonly, isSubChannel, mainChannel, subChannels, onOk, onCancel }: Props) => {
  //
  const {
    selectedMainChannel,
    selectedSubChannels,
    selectedCollegeId,
    collegeChannel,
    setSelectedMainChannel,
    setSelectedSubChannels,
    setSelectedCollegeId,
    setCollegeChannel,
    reset,
    clearChannel,
  } = CollegeSelectedModalStore.instance;
  const { data: colleges } = useFindCollegesForCineroomId();
  const { data: ALLColleges } = useFindColleges();

  const selectedChannelsCell = getMakeSelectSubChannels(isSubChannel || false, ALLColleges?.results || []);

  const onMount = () => {
    //
    reset();
    mainChannel && setSelectedMainChannel(mainChannel);
    subChannels && setSelectedSubChannels(subChannels);
  };

  const onClickCollege = (college: CollegeChannel) => {
    //
    setSelectedCollegeId(college.id);
    setCollegeChannel(sortChannelDepths(college.channels.map((channel) => getChannelWithAnotherInfo(channel))));
    // if (college.id !== selectedCollegeId) {
    //   clearChannel();
    // }
  };

  const onClickCancel = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
    //
    reset();
    onCancel && onCancel();
    close();
  };

  const onClickOk = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
    //
    if (!isSubChannel && !selectedMainChannel.collegeId) {
      alert(AlertModel.getRequiredInputAlert('메인채널'));
      return;
    }

    onOk && onOk(isSubChannel ? selectedSubChannels : [selectedMainChannel], isSubChannel || false);

    onClickCancel(_, close);
  };

  return readonly ? null : (
    <Modal
      size={'large'}
      trigger={<Button type="button">채널 선택</Button>}
      onMount={onMount}
      className={isSubChannel ? '' : 'category-modal main-channel'}
    >
      <Modal.Header className="res">
        {isSubChannel ? '서브' : '메인'} 채널 선택
        <span className="sub f12">{isSubChannel ? '서브' : '메인'} 채널을 선택해주세요.</span>
      </Modal.Header>
      <Modal.Content className="fit-layout">
        <div className="channel-change">
          <div className="table-css">
            <div className="row head">
              <div className="cell v-middle">
                <span className="text01">Category</span>
              </div>
              <div className="cell v-middle">
                <span className="text01">Channel</span>
              </div>
              <div className="cell v-middle">
                <span className="text01">
                  Selected
                  {(selectedChannelsCell && selectedChannelsCell.length && (
                    <span className="count">
                      <span className="text01 add"> {selectedChannelsCell.length}</span>
                      <span className="text02">개</span>
                    </span>
                  )) ||
                    ''}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="cell vtop">
                <div className="select-area">
                  <div className="scrolling-60vh">
                    <List className="toggle-check">
                      {(colleges &&
                        colleges.length &&
                        colleges.map((college, index) => (
                          <List.Item key={index} className={selectedCollegeId === college.id ? 'active' : ''}>
                            <Segment onClick={() => onClickCollege(college)}>
                              {getPolyglotToAnyString(college.name)}
                              <div className="fl-right">
                                <Icon name="check" />
                              </div>
                            </Segment>
                          </List.Item>
                        ))) ||
                        ''}
                    </List>
                  </div>
                </div>
              </div>
              <div className="cell vtop">
                <div className="select-area">
                  <div className="scrolling-60vh">
                    {(collegeChannel &&
                      collegeChannel.map((channel, index) => {
                        return (
                          <Form.Field
                            className={(channel.parentId && 'channelSelectModalDepth') || ''}
                            key={index}
                            control={isSubChannel ? Checkbox : Radio}
                            checked={isCheckedChannel(channel.id, isSubChannel)}
                            label={getPolyglotToAnyString(channel.name)}
                            disabled={isDisabledChannel(channel, isSubChannel)}
                            onChange={(_: any, data: any) => onClickChannel(channel, data.checked, isSubChannel)}
                          />
                        );
                      })) ||
                      null}
                  </div>
                </div>
              </div>
              <div className="cell vtop">
                <div className="select-area">
                  <div className="scrolling-60vh">{selectedChannelsCell}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Modal.CloseButton onClickWithClose={onClickCancel} className="w190 d">
          Cancel
        </Modal.CloseButton>
        <Modal.CloseButton onClickWithClose={onClickOk} className="w190 p">
          Ok
        </Modal.CloseButton>
      </Modal.Actions>
    </Modal>
  );
});

export default CollegeSelectedModal;
