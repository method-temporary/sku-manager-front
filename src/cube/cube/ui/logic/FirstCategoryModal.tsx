import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Icon, IconGroup, List, Radio, Segment } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { alert, AlertModel, Modal } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import CubeService from '../../present/logic/CubeService';
import { CollegeService } from '../../../../college';
import { CollegeModel } from '../../../../college/model/CollegeModel';
import { ChannelModel } from '../../../board/board/model/ChannelModel';
import { CubeModel } from 'cube/cube/model/CubeModel';
import { CardService } from 'card';

interface Props {
  disabled?: boolean;
}

interface States {}

interface Injected {
  cubeService: CubeService;
  collegeService: CollegeService;
}

@inject('cubeService', 'collegeService')
@observer
@reactAutobind
class FirstCategoryModal extends ReactComponent<Props, States, Injected> {
  //
  componentDidMount() {}

  onMount(): void {
    const { cubeService, collegeService } = this.injected;
    const { cube } = cubeService;

    collegeService.clearMainCollege();
    cubeService.clearMainCategory();
    cubeService.clearSelectedCollege();

    const mainCategory = cube.getMainCategory();
    if (mainCategory) {
      cubeService.changeMainCategoryProps('mainCategory', true);
      cubeService.changeMainCategoryProps('collegeId', mainCategory.collegeId);
      cubeService.changeMainCategoryProps('channelId', mainCategory.channelId);
      cubeService.changeMainCategoryProps('twoDepthChannelId', mainCategory.twoDepthChannelId);
    }
  }

  async handleOk(_: React.MouseEvent<HTMLButtonElement>, close: () => void): Promise<void> {
    const { cubeService } = this.injected;
    const { cube, mainCategory } = cubeService;

    // if (this.validate()) {
    //   cubeService.changeMainCategoryProps('mainCategory', true);
    //   if (cube.categories.some((category) => category.mainCategory)) {
    //     const categories = [mainCategory, ...cube.categories.filter((category) => !category.mainCategory)];
    //     cubeService.changeCubeProps('categories', categories);
    //   } else {
    //     const categories = [mainCategory, ...cube.categories];
    //     cubeService.changeCubeProps('categories', categories);
    //   }

    //   close();
    // }
  }

  validate() {
    const { mainCategory } = this.injected.cubeService;

    if (!mainCategory.collegeId || !mainCategory.channelId) {
      alert(AlertModel.getRequiredInputAlert('메인채널'));
      return false;
    } else {
      return true;
    }
  }

  handleCancel(): void {}

  async selectCollegeButton(selectedMainCollege: CollegeModel) {
    //
    const { collegeService, cubeService } = this.injected;
    if (cubeService && collegeService) {
      cubeService.setSelectedCollege(selectedMainCollege);
      await collegeService.findMainCollege(selectedMainCollege.id);
    }
  }

  selectChannelButton(selectedChannel: ChannelModel) {
    //
    const { cubeService } = this.injected;
    const { selectedCollege } = cubeService;

    cubeService.changeMainCategoryProps('collegeId', selectedCollege.id);

    if (selectedChannel.parentId) {
      cubeService.changeMainCategoryProps('channelId', selectedChannel.parentId);
      cubeService.changeMainCategoryProps('twoDepthChannelId', selectedChannel.id);
    } else {
      cubeService.changeMainCategoryProps('channelId', selectedChannel.id);
      cubeService.changeMainCategoryProps('twoDepthChannelId', null);
    }
  }

  getChannels() {
    //
    const { collegeService } = this.injected;
    const { mainCollege } = collegeService;
    const baseList = mainCollege.channels;

    const parentList: ChannelModel[] = [];
    const childList: ChannelModel[] = [];
    let newList: ChannelModel[] = [];

    baseList.map((channel) => (channel.parentId && childList.push(channel)) || parentList.push(channel));

    parentList.map((parent) => {
      newList.push(parent);
      const findChildList =
        (childList && childList.length > 0 && childList.filter((child) => child.parentId === parent.id)) || [];
      newList = [...newList, ...findChildList];
    });

    return newList;
  }

  getSelectedChannelCell() {
    //
    const { cubeService, collegeService } = this.injected;
    const { mainCategory } = cubeService;
    const { collegesForCurrentCineroom } = collegeService;

    if (mainCategory.collegeId && mainCategory.channelId) {
      const college = collegesForCurrentCineroom.find((co) => co.id === mainCategory.collegeId);

      if (college) {
        const channel = college.channels.find(
          (ch) => ch.id === (mainCategory.twoDepthChannelId || mainCategory.channelId)
        );

        if (channel) {
          return (
            <span className="select-item" key={0}>
              <Button className="del">
                {`${getPolyglotToAnyString(college.name)} > ${getPolyglotToAnyString(channel.name)}`}
                <div className="fl-right">
                  <Icon name="times" />
                </div>
              </Button>
            </span>
          );
        }
      }
    }
  }

  render() {
    //
    const { cubeService, collegeService } = this.injected;
    const { collegesForCurrentCineroom, mainCollege } = collegeService;
    const { mainCategory, selectedCollege } = cubeService;
    const { disabled } = this.props;

    const channels = this.getChannels();

    const selectedChannelCell = this.getSelectedChannelCell();

    return (
      <Modal size="large" trigger={<Button disabled={disabled}> 채널 선택 </Button>} onMount={this.onMount}>
        <Modal.Header className="res">
          매인 채널 선택
          <span className="sub f12">메인 채널을 선택해주세요.</span>
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
                  <span className="text01">Selected</span>
                </div>
              </div>
              <div className="row">
                <div className="cell vtop">
                  <div className="select-area">
                    <div className="scrolling-60vh">
                      <List className="toggle-check">
                        {(collegesForCurrentCineroom &&
                          collegesForCurrentCineroom.length &&
                          collegesForCurrentCineroom.map((college, index) => (
                            <List.Item
                              key={index}
                              className={selectedCollege && selectedCollege.id === college.id ? 'active' : ''}
                            >
                              <Segment onClick={() => this.selectCollegeButton(college)}>
                                <>
                                  {getPolyglotToAnyString(college.name)}
                                  <div className="fl-right">
                                    <Icon name="check" />
                                  </div>
                                </>
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
                      {(channels &&
                        channels.length &&
                        channels.map((channel, index) => {
                          const hasChild = channels.some((subChannel) => subChannel.parentId === channel.id);
                          return (
                            <Form.Field
                              className={(channel.parentId && 'channelSelectModalDepth') || ''}
                              key={index}
                              control={Radio}
                              checked={
                                channel.id === mainCategory.channelId || channel.id === mainCategory.twoDepthChannelId
                              }
                              label={getPolyglotToAnyString(channel.name)}
                              disabled={hasChild || mainCategory.twoDepthChannelId === channel.id}
                              onChange={() => this.selectChannelButton(channel)}
                            />
                          );
                        })) ||
                        null}
                    </div>
                  </div>
                </div>
                <div className="cell vtop">
                  <div className="select-area">
                    <div className="scrolling-60vh">{selectedChannelCell}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton className="w190 d" onClick={() => this.handleCancel()}>
            Cancel
          </Modal.CloseButton>
          <Modal.CloseButton className="w190 p" onClickWithClose={this.handleOk}>
            OK
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FirstCategoryModal;
