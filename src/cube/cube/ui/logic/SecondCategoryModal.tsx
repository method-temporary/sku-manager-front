import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Checkbox, Form, Icon, List, Segment } from 'semantic-ui-react';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { Modal } from 'shared/components';
import { CardCategory, PatronKey } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CollegeModel } from '../../../../college/model/CollegeModel';
import { CollegeService } from '../../../../college';
import CubeService from '../../present/logic/CubeService';
import { ChannelModel } from '../../../board/board/model/ChannelModel';

interface Props {
  disabled?: boolean;
}

interface States {}

interface Injected {
  collegeService: CollegeService;
  cubeService: CubeService;
}

@inject('collegeService', 'cubeService')
@observer
@reactAutobind
class SecondCategoryModal extends ReactComponent<Props, States, Injected> {
  //
  componentDidMount() {}

  onMount(): void {
    const { collegeService, cubeService } = this.injected;
    // collegeService.findAllColleges();
    collegeService.clearSubCollege();
    cubeService.clearCategoryMap();

    if (cubeService.cube.categories.filter((category) => !category.mainCategory).length > 0) {
      cubeService.setSubCategories(cubeService.cube.categories.filter((category) => !category.mainCategory));
      cubeService.cube.categories
        .filter((category) => !category.mainCategory)
        .forEach((category) => {
          const categoryList = cubeService.categoryMap.get(category.collegeId) || [];
          cubeService.setCategoryMapProps(category.collegeId, [
            ...categoryList,
            category.twoDepthChannelId || category.channelId,
          ]);
        });
    } else {
      cubeService.clearSubCategories();
    }
  }

  onDeleteChannel(channelId: string, collegeId: string) {
    //
    const { collegeService } = this.injected;
    const { channelList } = collegeService;

    const selectedChannel = channelList.find((channel) => channel.id === channelId);
    selectedChannel && this.selectChannelButton(selectedChannel, collegeId);
  }

  selectCollegeButton(selectedCollege: CollegeModel) {
    //
    const { collegeService, cubeService } = this.injected;
    const { categoryMap } = cubeService;
    const collegeId = selectedCollege.id;
    if (!categoryMap.get(collegeId)) {
      cubeService.setCategoryMapProps(collegeId, []);
    }
    collegeService.findSubCollege(collegeId);
  }

  selectChannelButton(selectedChannel: ChannelModel, selectedCollegeId?: string) {
    //
    const { collegeService, cubeService } = this.injected;
    const { channelList, subCollege } = collegeService;
    const { categoryMap } = cubeService;
    const collegeId = selectedCollegeId || subCollege.id;
    // const subCategories = [...cubeService.subCategories];

    const copiedSubCategories = [...cubeService.subCategories];
    const copiedSubCategoryIds = categoryMap.get(collegeId) || [];

    // Sub Category modal
    /*
     * 1 Depth true -> 하위 2 Depth all true
     * 1 Depth false -> 하위 2 Depth all false
     * 2 Depth true -> 상위 1 Depth true
     * 2 Depth false -> 상위 1 Depth에 포함된 하위 2 Depth의 수 = 0 인 경우 상위 1 Depth false
     */
    const selectedCategory = {
      collegeId,
      channelId: (selectedChannel.parentId && selectedChannel.parentId) || selectedChannel.id,
      twoDepthChannelId: (selectedChannel.parentId && selectedChannel.id) || null,
      mainCategory: false,
    } as CardCategory;

    const parentChannel: ChannelModel | null =
      (selectedChannel.parentId && channelList.find((channel) => channel.id === selectedChannel.parentId)) || null;
    const parentCategory =
      (parentChannel &&
        ({
          collegeId,
          channelId: parentChannel.id,
          mainCategory: false,
        } as CardCategory)) ||
      null;

    const childChannelList: ChannelModel[] =
      (!selectedChannel.parentId && channelList.filter((channel) => channel.parentId === selectedChannel.id)) || [];
    const childCategories =
      childChannelList.map((channel) => {
        return {
          collegeId,
          channelId: channel.parentId,
          twoDepthChannelId: channel.id,
          mainCategory: false,
        } as CardCategory;
      }) || null;

    const beforeSelected = copiedSubCategoryIds.find((id) => id === selectedChannel.id);
    let resultSubCategoryIds: string[] = [];
    let resultSubCategories: CardCategory[] = [];

    if (!parentChannel) {
      // selected 1 depth
      if (!beforeSelected) {
        // 1 Depth true -> 하위 2 Depth all true
        resultSubCategories = [...copiedSubCategories, selectedCategory, ...childCategories];
        resultSubCategoryIds = [
          ...copiedSubCategoryIds,
          selectedChannel.id,
          ...childChannelList.map((channel) => channel.id),
        ];
      } else {
        // 1 Depth false -> 하위 2 Depth all false

        const tempIdList: string[] = [];
        resultSubCategories = copiedSubCategories.filter((category) => {
          if (category.channelId === selectedChannel.id) {
            category.twoDepthChannelId && tempIdList.push(category.twoDepthChannelId);
            return false;
          } else {
            return true;
          }
        });
        resultSubCategoryIds = copiedSubCategoryIds.filter((id) => id !== selectedChannel.id);

        // 2 depth id 채널 탐색
        tempIdList &&
          tempIdList.length > 0 &&
          tempIdList.map((childId) => {
            resultSubCategoryIds = resultSubCategoryIds.filter((id) => id !== childId);
          });
      }
    } else {
      // selected 2 depth
      if (!beforeSelected) {
        // 2 Depth true -> 상위 1 Depth true
        if (parentCategory && copiedSubCategoryIds.findIndex((id) => id === parentChannel.id) < 0) {
          resultSubCategories = [...copiedSubCategories, parentCategory, selectedCategory];
          resultSubCategoryIds = [...copiedSubCategoryIds, parentChannel.id, selectedChannel.id];
        } else {
          resultSubCategories = [...copiedSubCategories, selectedCategory];
          resultSubCategoryIds = [...copiedSubCategoryIds, selectedChannel.id];
        }
      } else {
        // 2 Depth false -> 상위 1 Depth에 포함된 하위 2 Depth의 수 = 0 인 경우 상위 1 Depth false
        resultSubCategories = copiedSubCategories.filter(
          (category) => category.twoDepthChannelId !== selectedChannel.id
        );
        resultSubCategoryIds = copiedSubCategoryIds.filter((id) => id !== selectedChannel.id);

        const hasChild = resultSubCategories.some(
          (category) => category.channelId === selectedChannel.parentId && category.twoDepthChannelId
        );
        if (!hasChild) {
          resultSubCategories = resultSubCategories.filter((category) => category.channelId !== parentChannel.id);
          resultSubCategoryIds = resultSubCategoryIds.filter((id) => id !== parentChannel.id);
        }
      }
    }

    cubeService.setSubCategories(resultSubCategories);
    cubeService.setCategoryMapProps(collegeId, resultSubCategoryIds);

    // if (categoryMap.get(subCollege.id)) {
    //   const channelList = categoryMap.get(subCollege.id) || [];
    //   channelList.map((channel) => selectedChannelListInMap.push(channel));
    // }
    // subCategories.map((subCategory) => selectedChannelListInList.push(subCategory.channelId));

    // if (selectedChannelListInMap.some((selectedChannel) => selectedChannel === channel.id)) {
    //   const newSelectedChannelList = [...selectedChannelListInMap];
    //   newSelectedChannelList.splice(selectedChannelListInMap.indexOf(channel.id), 1);
    //   cubeService.setCategoryMapProps(collegeId, newSelectedChannelList);

    //   const newSubCategories = [...subCategories];
    //   newSubCategories.splice(selectedChannelListInList.indexOf(channel.id), 1);
    //   cubeService.setSubCategories(newSubCategories);
    // } else {
    //   selectedChannelListInMap.push(channel.id);
    //   cubeService.setCategoryMapProps(collegeId, selectedChannelListInMap);
    //   subCategories.push(
    //     new CardCategory({
    //       collegeId: subCollege.id,
    //       id: '',
    //       channelId: channel.id,
    //       mainCategory: false,
    //       parentId: channel.parentId,
    //     })
    //   );
    //   cubeService.setSubCategories(subCategories);
    // }
  }

  handleOk() {
    //
    const { cubeService } = this.injected;
    const { subCategories } = cubeService;
    const categories: CardCategory[] = [];
    categories.push(...cubeService.cube.categories.filter((category) => category.mainCategory), ...subCategories);
    // const categories: CardCategory[] = [...cubeService.cube.categories.filter((category) => category.mainCategory), subCategories];
    cubeService.changeCubeProps('categories', categories);
  }

  handleCancel() {
    //
    const { collegeService, cubeService } = this.injected;
    const { subCategories } = cubeService;
    if (!subCategories.length) {
      collegeService.clearSubCollege();
      cubeService.setSubCategories([]);
    }
  }

  findCollegeName(collegeId: string): string | undefined {
    //
    const { collegeService } = this.injected;
    return collegeService.collegesMap.get(collegeId);
  }

  findChannelName(channelId: string): string | undefined {
    //
    const { collegeService } = this.injected;
    return collegeService.channelMap.get(channelId);
  }

  getSubChannels() {
    const { collegeService } = this.injected;
    const { subCollege } = collegeService;

    if (!subCollege || !subCollege.channels || subCollege.channels.length === 0) {
      return [];
    }

    const parentList: ChannelModel[] = [];
    const childList: ChannelModel[] = [];
    let newList: ChannelModel[] = [];

    subCollege.channels.map((channel) => (channel.parentId && childList.push(channel)) || parentList.push(channel));

    parentList.map((parent) => {
      newList.push(parent);
      const findChildList =
        (childList && childList.length > 0 && childList.filter((child) => child.parentId === parent.id)) || [];
      newList = [...newList, ...findChildList];
    });

    return newList;
  }

  makeSelectedChannels() {
    //
    const { collegeService, cubeService } = this.injected;
    const { collegesMap, channelMap } = collegeService;
    const { subCategories } = cubeService;

    const categoryList: any = [];
    subCategories.map((category, index) => {
      const hasChild = subCategories.some(
        (subCategory) => subCategory.twoDepthChannelId && subCategory.channelId === category.channelId
      );
      const isSecondChannel = (category.twoDepthChannelId && true) || false;

      if (isSecondChannel || !hasChild) {
        categoryList.push(
          <span className="select-item" key={index}>
            <Button className="del">
              {collegesMap.get(category.collegeId)} &gt;{' '}
              {(category.twoDepthChannelId && channelMap.get(category.twoDepthChannelId)) ||
                channelMap.get(category.channelId)}
              <div
                className="fl-right"
                onClick={() =>
                  this.onDeleteChannel(category.twoDepthChannelId || category.channelId, category.collegeId)
                }
              >
                <Icon name="times" />
              </div>
            </Button>
          </span>
        );
      }
    });

    return categoryList;
  }

  render() {
    //
    const { collegeService, cubeService } = this.injected;
    const { subCollege, collegesForCurrentCineroom, collegesMap, channelMap, channelList } = collegeService;
    const { cube, categoryMap, subCategories } = cubeService;
    const cineroom = patronInfo.getCineroom();

    let selectedChannelList: string[] = [];
    if (categoryMap.get(subCollege.id)) selectedChannelList = categoryMap.get(subCollege.id) || [];
    const { disabled } = this.props;

    const subChannelList = this.getSubChannels();

    return (
      <Modal size="large" trigger={<Button disabled={disabled}>채널 선택</Button>} onMount={this.onMount}>
        <Modal.Header className="res">
          서브 채널 선택
          <span className="sub f12">서브 채널을 선택해주세요.</span>
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
                    {(subCategories && subCategories.length && (
                      <span className="count">
                        <span className="text01 add"> {subCategories.length}</span>
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
                        {(collegesForCurrentCineroom &&
                          collegesForCurrentCineroom.length &&
                          collegesForCurrentCineroom
                            .filter((college) => PatronKey.getCineroomId(college.patronKey) === cineroom?.id)
                            .map((college, index) => (
                              <List.Item key={index} className={college.id === subCollege.id ? 'active' : ''}>
                                <Segment onClick={() => this.selectCollegeButton(college)}>
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
                      {(subChannelList &&
                        subChannelList.length &&
                        subChannelList.map((channel, index) => (
                          <Form.Field
                            className={(channel.parentId && 'channelSelectModalDepth') || ''}
                            key={index}
                            control={Checkbox}
                            // checked={selectedChannelList.indexOf(channel.instructorId) !== -1}
                            checked={selectedChannelList.some((selectedChannel) => selectedChannel === channel.id)}
                            disabled={
                              (cube && cube.getMainCategory() && cube.getMainCategory().channelId === channel.id) ||
                              cube.getMainCategory().twoDepthChannelId === channel.id
                            }
                            label={getPolyglotToAnyString(channel.name)}
                            onChange={() => this.selectChannelButton(channel)}
                          />
                        ))) ||
                        null}
                    </div>
                  </div>
                </div>
                <div className="cell vtop">
                  <div className="select-area">
                    <div className="scrolling-60vh">{this.makeSelectedChannels()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton className="w190 d" onClick={this.handleCancel}>
            Cancel
          </Modal.CloseButton>
          <Modal.CloseButton className="w190 p" onClick={this.handleOk}>
            OK
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}
export default SecondCategoryModal;
