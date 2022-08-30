import React from 'react';
import { observer } from 'mobx-react';
import { Button, Checkbox, Icon, List, Radio, Segment, Form } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { CardCategory } from 'shared/model';
import { Modal } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CollegeService } from '../../../../college';
import { CollegeModel } from '../../../../college/model/CollegeModel';

import { CardQueryModel } from '../..';
import { ChannelModel } from '../../../../cube/board/board/model/ChannelModel';

interface Props {
  sub?: boolean;
  cardQuery: CardQueryModel;
  changeCardQueryProp: (name: string, value: any) => void;
  colleges: CollegeModel[];
  collegeService: CollegeService;
}

interface State {
  collegeId: string;
}

@observer
@reactAutobind
class ChannelCategoryModal extends React.Component<Props, State> {
  //
  state: State = {
    collegeId: '',
  };

  onMount() {
    //
    const { cardQuery, changeCardQueryProp, sub, collegeService } = this.props;
    const { clearMainCollege, clearSubCollege } = collegeService;

    const subCategories: CardCategory[] = [];
    const subCategoryIds: string[] = [];

    cardQuery.categories &&
      cardQuery.categories.forEach((category) => {
        if (category.mainCategory) {
          changeCardQueryProp('mainCategory', category);
        } else {
          subCategories.push(category);
          subCategoryIds.push((category.twoDepthChannelId && category.twoDepthChannelId) || category.channelId);
        }
      });

    changeCardQueryProp('subCategoryIds', subCategoryIds);
    changeCardQueryProp('subCategories', subCategories);

    clearMainCollege();
    clearSubCollege();
  }

  async selectCollegeButton(selectedCollege: CollegeModel) {
    //
    const { collegeService, sub } = this.props;

    if (sub) {
      await collegeService.findSubCollege(selectedCollege.id);
    } else {
      await collegeService.findMainCollege(selectedCollege.id);
    }

    this.setState({ collegeId: selectedCollege.id });
  }

  selectChannelButton(selectedChannel: ChannelModel) {
    //
    const { collegeId } = this.state;
    const { collegeService } = this.props;
    const { cardQuery, changeCardQueryProp, sub } = this.props;
    const { channelList } = collegeService;

    const copiedSubCategoryIds = [...cardQuery.subCategoryIds];
    const copiedSubCategories = [...cardQuery.subCategories];

    // Main Category modal
    if (!sub) {
      const mainCategory = {
        collegeId,
        channelId: (selectedChannel.parentId && selectedChannel.parentId) || selectedChannel.id,
        twoDepthChannelId: (selectedChannel.parentId && selectedChannel.id) || null,
        mainCategory: true,
      } as CardCategory;
      const filterSubCategories = copiedSubCategories.filter((category) => category.channelId !== selectedChannel.id);
      const filterSubCategoryIds = copiedSubCategoryIds.filter((id) => id !== selectedChannel.id);

      changeCardQueryProp('mainCategory', mainCategory);
      changeCardQueryProp('subCategoryIds', filterSubCategoryIds);
      changeCardQueryProp('subCategories', filterSubCategories);
      return;
    }

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

    changeCardQueryProp('subCategories', resultSubCategories);
    changeCardQueryProp('subCategoryIds', resultSubCategoryIds);
  }

  removeInList(index: number, oldList: any[]) {
    //
    return oldList.slice(0, index).concat(oldList.slice(index + 1));
  }

  makeSelectedChannels() {
    //
    const { cardQuery, collegeService } = this.props;
    const { collegesMap, channelMap } = collegeService;

    const subCategories = cardQuery.subCategories;

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
                onClick={() => this.onDeleteChannel(category.twoDepthChannelId || category.channelId)}
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

  onDeleteChannel(channelId: string) {
    //
    const { collegeService } = this.props;
    const { channelList } = collegeService;

    const selectedChannel = channelList.find((channel) => channel.id === channelId);
    selectedChannel && this.selectChannelButton(selectedChannel);
  }

  onClickOk(close: () => void) {
    //
    const { cardQuery, changeCardQueryProp } = this.props;

    const categories: CardCategory[] = [];

    const { mainCategory, subCategories } = cardQuery;

    let filterSubCategories = [...subCategories];

    // main 선택 항목 sub에서 제거
    const duplicated = filterSubCategories.some(
      (category) =>
        category.channelId === mainCategory.channelId && category.twoDepthChannelId === mainCategory.twoDepthChannelId
    );

    if (duplicated) {
      filterSubCategories = [
        ...filterSubCategories.filter(
          (category) =>
            category.channelId !== mainCategory.channelId ||
            category.twoDepthChannelId !== mainCategory.twoDepthChannelId
        ),
      ];

      const hasChild =
        filterSubCategories.some(
          (category) => category.channelId === mainCategory.channelId && category.twoDepthChannelId
        ) || false;
      filterSubCategories =
        (!hasChild && filterSubCategories.filter((category) => category.channelId !== mainCategory.channelId)) ||
        filterSubCategories;

      changeCardQueryProp('subCategories', filterSubCategories);
      changeCardQueryProp(
        'subCategoryIds',
        filterSubCategories.map((category) => category.twoDepthChannelId || category.channelId)
      );
    }

    if (cardQuery.mainCategory.channelId) {
      categories.push(cardQuery.mainCategory);
    }

    filterSubCategories &&
      filterSubCategories.forEach((category) => {
        categories.push(category);
      });

    changeCardQueryProp('categories', categories);

    this.pageReset();
    close();
  }

  onClickCancel(close: () => void) {
    //
    this.pageReset();
    close();
  }

  pageReset() {
    //
    const { changeCardQueryProp } = this.props;

    this.setState({ collegeId: '' });
    changeCardQueryProp('mainCategory', new CardCategory());
    changeCardQueryProp('subCategoryIds', []);
    changeCardQueryProp('subCategories', []);
  }

  getChannels() {
    //
    const { sub, collegeService } = this.props;

    const baseList = sub ? collegeService.subCollege.channels : collegeService.mainCollege.channels;

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

  render() {
    //
    const { collegeId } = this.state;
    const { sub, colleges, cardQuery } = this.props;

    const channels = this.getChannels();
    const selectedChannels = this.makeSelectedChannels();

    return (
      <Modal
        size={sub ? 'large' : 'small'}
        trigger={<Button>채널 선택</Button>}
        onMount={this.onMount}
        className={sub ? '' : 'category-modal main-channel'}
      >
        <Modal.Header className="res">
          {sub ? '서브' : '메인'} 채널 선택
          <span className="sub f12">{sub ? '서브' : '메인'} 채널을 선택해주세요.</span>
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
                {sub && (
                  <div className="cell v-middle">
                    <span className="text01">
                      Selected
                      {(selectedChannels && selectedChannels.length && (
                        <span className="count">
                          <span className="text01 add"> {selectedChannels.length}</span>
                          <span className="text02">개</span>
                        </span>
                      )) ||
                        ''}
                    </span>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="cell vtop">
                  <div className="select-area">
                    <div className="scrolling-60vh">
                      <List className="toggle-check">
                        {(colleges &&
                          colleges.length &&
                          colleges.map((college, index) => (
                            <List.Item key={index} className={collegeId === college.id ? 'active' : ''}>
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
                      {(channels &&
                        channels.length &&
                        channels.map((channel, index) => {
                          const hasChild = !sub && channels.some((subChannel) => subChannel.parentId === channel.id);

                          return (
                            <Form.Field
                              className={(channel.parentId && 'channelSelectModalDepth') || ''}
                              key={index}
                              control={sub ? Checkbox : Radio}
                              checked={
                                sub
                                  ? cardQuery.subCategoryIds.includes(channel.id)
                                  : (channel.parentId &&
                                      cardQuery.mainCategory &&
                                      cardQuery.mainCategory.twoDepthChannelId === channel.id) ||
                                    cardQuery.mainCategory.channelId === channel.id
                              }
                              label={getPolyglotToAnyString(channel.name)}
                              disabled={
                                (sub && cardQuery.mainCategory.channelId === channel.id) ||
                                hasChild ||
                                cardQuery.mainCategory.twoDepthChannelId === channel.id
                              }
                              onChange={() => this.selectChannelButton(channel)}
                            />
                          );
                        })) ||
                        null}
                    </div>
                  </div>
                </div>
                {sub && (
                  <div className="cell vtop">
                    <div className="select-area">
                      <div className="scrolling-60vh">{selectedChannels}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton onClickWithClose={(e, close) => this.onClickCancel(close)} className="w190 d">
            Cancel
          </Modal.CloseButton>
          <Modal.CloseButton onClickWithClose={(e, close) => this.onClickOk(close)} className="w190 p">
            Ok
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ChannelCategoryModal;
