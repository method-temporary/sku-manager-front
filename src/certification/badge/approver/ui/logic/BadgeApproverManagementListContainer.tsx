import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Button, Container, Icon } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { alert, AlertModel, PageTitle, Pagination, SearchBox, SubActions } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import BadgeApproverService from '../../present/logic/BadgeApproverService';
import BadgeApproverListView from '../view/BadgeApproverListView';
import BadgeApproverCreateModal from './BadgeApproverCreateModal';
import UserWorkspaceService from '../../../../../userworkspace/present/logic/UserWorkspaceService';

interface Params {
  cineroomId: string;
  badgeId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface States {
  checked: boolean;
}

interface Injected {
  sharedService: SharedService;
  badgeApproverService: BadgeApproverService;
  searchBoxService: SearchBoxService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('sharedService', 'badgeApproverService', 'searchBoxService', 'userWorkspaceService')
@observer
@reactAutobind
class BadgeApproverManagementListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'badgeApprover';

  constructor(props: Props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  async findApprovers() {
    //
    const { sharedService, badgeApproverService } = this.injected;
    const pageModal = sharedService.getPageModel(this.paginationKey);

    // badgeApproverService.changeBadgeApproverQueryProp('role', BadgeApproverRoleType.BadgeApprover);
    const totalCount = await badgeApproverService.findAllApproverByQuery(pageModal);

    sharedService.setCount(this.paginationKey, totalCount);
  }

  onClickCheckAll(value: boolean) {
    //
    const { badgeApprovers, changeApproversProp } = this.injected.badgeApproverService;

    this.setState({ checked: value });

    badgeApprovers?.forEach((badgeApprovers, index) => {
      changeApproversProp(index, 'checked', value);
    });
  }

  onClickCheckOne(index: number, name: string, value: boolean) {
    //
    const { badgeApprovers, changeApproversProp } = this.injected.badgeApproverService;

    changeApproversProp(index, name, value);

    // checkbox ????????? ALL Checkbox ????????? ????????? ALL Checkbox ?????? ????????? ?????? ??????
    if (badgeApprovers.filter((badgeApprover) => badgeApprover.checked).length === badgeApprovers.length) {
      this.setState({ checked: true });
    } else {
      this.setState({ checked: false });
    }
  }

  async onRemoveApproverButtonClick() {
    //
    const { badgeApproverService } = this.injected;

    const checked = badgeApproverService.setApproversIds();

    if (checked && checked > 0) {
      await badgeApproverService.removeApprover();
      await alert(
        AlertModel.getCustomAlert(false, '??????', '?????? ???????????????.', '??????', () => {
          this.clearCheckedApprverIds();
          this.findApprovers();
        })
      );
    } else {
      alert(AlertModel.getCustomAlert(false, '??????', '?????? ???????????? ??????????????????', '??????'));
    }
  }

  clearCheckedApprverIds() {
    const { badgeApproverService } = this.injected;
    badgeApproverService.clearCreateApproverIdList();
    this.setState({ checked: false });
  }

  componentWillUnmount() {
    const { badgeApproverService } = this.injected;
    badgeApproverService.clearBadgeApproverQuery();
  }

  render() {
    const { sharedService, badgeApproverService, userWorkspaceService, searchBoxService } = this.injected;
    const { badgeApprovers, changeBadgeApproverQueryProp, badgeApproverQuery, badgeApproverModalQuery } =
      badgeApproverService;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const searchWordDisabledKey = 'searchPart';
    const searchWordDisabledKeyWord = searchBoxService.searchBoxQueryModel[searchWordDisabledKey];

    return (
      <>
        <Container fluid>
          <PageTitle breadcrumb={SelectType.badgeApproverSections} />

          <SearchBox
            queryModel={badgeApproverQuery}
            changeProps={changeBadgeApproverQueryProp}
            onSearch={this.findApprovers}
            name={this.paginationKey}
          >
            <SearchBox.Group name="????????????">
              <SearchBox.Select
                fieldName="approvingCineroomId"
                options={addSelectTypeBoxAllOption(userWorkspaceService.userWorkspaceSelect)}
                placeholder="??????"
              />
            </SearchBox.Group>
            <SearchBox.Group name="?????????">
              <SearchBox.Select
                placeholder="??????"
                options={SelectType.searchPartForBadgeApprover}
                fieldName="searchPart"
              />
              <SearchBox.Input
                fieldName="searchWord"
                placeholder="???????????? ??????????????????."
                disabled={searchWordDisabledKeyWord === '' || searchWordDisabledKeyWord === '??????'}
              />
            </SearchBox.Group>
          </SearchBox>
          <Pagination name={this.paginationKey} onChange={this.findApprovers}>
            <SubActions>
              <SubActions.Count number={count} text="??? ????????? ??????" />
              <SubActions.Right>
                <Button type="button" onClick={this.onRemoveApproverButtonClick}>
                  <Icon name="minus square outline" />
                  ??????
                </Button>
                <BadgeApproverCreateModal
                  badgeApproverModalQuery={badgeApproverModalQuery}
                  findApprovers={this.findApprovers}
                />
              </SubActions.Right>
            </SubActions>
            <BadgeApproverListView
              checked={this.state.checked}
              startNo={startNo}
              onClickCheckAll={this.onClickCheckAll}
              onClickCheckOne={this.onClickCheckOne}
              badgeApproverList={badgeApprovers}
              userWorkspaceMap={userWorkspaceService.userWorkspaceMap}
            />
            <Pagination.Navigator />
          </Pagination>
        </Container>
      </>
    );
  }
}

export default withRouter(BadgeApproverManagementListContainer);
