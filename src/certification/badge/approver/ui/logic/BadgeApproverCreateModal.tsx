import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { alert, AlertModel, Modal, Pagination, SearchBox, SubActions } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { BadgeApproverService } from '../../../../index';
import { BadgeApproverQueryModel } from '../../model/BadgeApproverQueryModel';
import BadgeApproverModalListView from '../view/BadgeApproverModalListView';
import { BadgeApproverRoleType } from '../../model/BadgeApproverRoleType';
import UserWorkspaceService from '../../../../../userworkspace/present/logic/UserWorkspaceService';

interface Props {
  badgeApproverModalQuery: BadgeApproverQueryModel;
  findApprovers: () => void;
}

interface Stete {
  checked: boolean;
}

interface Injected {
  sharedService: SharedService;
  badgeApproverService: BadgeApproverService;
  searchBoxService: SearchBoxService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('sharedService', 'searchBoxService', 'userWorkspaceService', 'badgeApproverService')
@observer
@reactAutobind
class BadgeApproverCreateModal extends ReactComponent<Props, Stete, Injected> {
  //
  paginationKey = 'badgeApproverList';

  constructor(props: Props) {
    super(props);
    this.state = {
      checked: false,
    };

    this.injected.sharedService.setPageMap(this.paginationKey, 0, 10);
  }

  async findApproverList() {
    //
    const { sharedService, badgeApproverService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    badgeApproverService.changeBadgeApproverModalQueryProp('role', BadgeApproverRoleType.CollegeManager);
    const totalCount = await badgeApproverService.findAllApproverListByQuery(pageModel);

    this.setState({ checked: false });
    await sharedService.setCount(this.paginationKey, totalCount);
  }

  async onClickAddBadgeApprover() {
    //
    const { badgeApproverService } = this.injected;

    const copied = badgeApproverService.setApproverIds();
    if (copied && copied > 0) {
      badgeApproverService.registerApprover();
      await this.findApproverList();
      alert(AlertModel.getCustomAlert(true, '완료', '등록이 완료되었습니다.', '확인'));
    } else {
      alert(AlertModel.getCustomAlert(true, '선택', '계정을 선택해주세요.', '확인'));
    }
  }

  onClickCheckAll(value: boolean) {
    //
    const { badgeApproverList, changeApproverListProp } = this.injected.badgeApproverService;

    this.setState({ checked: value });

    badgeApproverList?.forEach((badgeApprover, index) => {
      changeApproverListProp(index, 'checked', value);
    });
  }

  onClickCheckOne(index: number, name: string, value: boolean) {
    //
    const { badgeApproverList, changeApproverListProp } = this.injected.badgeApproverService;

    changeApproverListProp(index, name, value);

    // checkbox 선택시 ALL Checkbox 선택과 같으면 ALL Checkbox 체크 아니면 체크 해제
    if (badgeApproverList.filter((badgeApprover) => badgeApprover.checked).length === badgeApproverList.length) {
      this.setState({ checked: true });
    } else {
      this.setState({ checked: false });
    }
  }

  onCloseModal(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, close: () => void) {
    //
    const { findApprovers } = this.props;
    const { badgeApproverService } = this.injected;

    badgeApproverService.clearCreateApproverIdList();
    badgeApproverService.clearBadgeApproverModalQuery();
    findApprovers();
    close();
  }

  render() {
    //
    const { sharedService, searchBoxService, userWorkspaceService, badgeApproverService } = this.injected;
    const { count } = sharedService.getPageModel(this.paginationKey);

    const { changeBadgeApproverModalQueryProp, badgeApproverModalQuery } = badgeApproverService;
    const { searchBoxQueryModel } = searchBoxService;
    const searchWordDisabledKey = 'searchPart';
    const searchWordDisabledKeyWord = searchBoxQueryModel[searchWordDisabledKey];

    return (
      <Modal
        size="large"
        trigger={
          <Button type="button">
            <Icon name="plus square outline" />
            생성
          </Button>
        }
        closeOnDimmerClick={false}
      >
        <Modal.Header>승인자 추가</Modal.Header>
        <Modal.Content>
          <SearchBox
            queryModel={badgeApproverModalQuery}
            changeProps={changeBadgeApproverModalQueryProp}
            onSearch={this.findApproverList}
            name={this.paginationKey}
            modal
          >
            <SearchBox.Group name="승인대상">
              <SearchBox.Select
                placeholder="전체"
                options={addSelectTypeBoxAllOption(userWorkspaceService.userWorkspaceSelect)}
                fieldName="approvingCineroomId"
              />
            </SearchBox.Group>
            <SearchBox.Group name="검색어">
              <SearchBox.Select
                placeholder="전체"
                options={SelectType.searchPartForBadgeApprover}
                fieldName="searchPart"
              />
              <SearchBox.Input
                fieldName="searchWord"
                placeholder="검색어를 입력해주세요."
                disabled={searchWordDisabledKeyWord === '' || searchWordDisabledKeyWord === '전체'}
              />
            </SearchBox.Group>
          </SearchBox>

          <Pagination name={this.paginationKey} onChange={this.findApproverList}>
            <SubActions>
              <SubActions.Left>
                <SubActions.Count number={count} />
              </SubActions.Left>
              <SubActions.Right>
                <Button primary onClick={this.onClickAddBadgeApprover}>
                  추가
                </Button>
              </SubActions.Right>
            </SubActions>

            <BadgeApproverModalListView
              checked={this.state.checked}
              badgeApprovers={badgeApproverService.badgeApproverList}
              onClickCheckAll={this.onClickCheckAll}
              onClickCheckOne={this.onClickCheckOne}
              userWorkspaceMap={userWorkspaceService.userWorkspaceMap}
            />

            <Pagination.Navigator />
          </Pagination>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton onClickWithClose={this.onCloseModal}>취소</Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default BadgeApproverCreateModal;
