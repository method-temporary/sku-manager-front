import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { Button, Container } from 'semantic-ui-react';
import PageTitleView from 'shared/components/PageTitle';
import { SelectType } from 'shared/model';

import { BadgeCategoryService } from '../../../category';
import { BadgeCategoryQueryModel } from '../../../category/model/BadgeCategoryQueryModel';
import BadgeOrderListView from '../view/BadgeOrderListView';
import { alert, AlertModel, SubActions } from 'shared/components';
import { BadgeCategoryModel } from '../../../../../_data/badge/badgeCategories/model/BadgeCategoryModel';
import { UserWorkspaceService } from '../../../../../userworkspace';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface Injected {
  sharedService: SharedService;
  badgeCategoryService: BadgeCategoryService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('sharedService', 'badgeCategoryService', 'userWorkspaceService')
@observer
@reactAutobind
class BadgeOrderListContainer extends ReactComponent<Props, {}, Injected> {
  //
  paginationKey = 'badgeOrder';

  componentDidMount(): void {
    //
    this.injected.sharedService.setPageMap(this.paginationKey, 0, 99999999);
    this.findBadgeList();
  }

  async findBadgeList() {
    //
    const { badgeCategoryService, sharedService } = this.injected;

    badgeCategoryService.changeBadgeCategoryQueryProps('cineroomId', '');
    const offsetElementList = await badgeCategoryService.findAllBadgeCategories(
      BadgeCategoryQueryModel.asBadgeCategoryDisPlayOrder(
        badgeCategoryService.badgeCategoryQuery,
        sharedService.getPageModel(this.paginationKey)
      )
    );
    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  onClickChangeSequence(badgeCategoryModel: BadgeCategoryModel, oldSeq: number, newSeq: number) {
    //
    const { badgeCategoryService } = this.injected;
    badgeCategoryService.changeBadgeCategorySequences(badgeCategoryModel, oldSeq, newSeq);
  }

  async onClickSaveDisplayOrder() {
    //
    const { badgeCategoryService } = this.injected;
    await badgeCategoryService.modifyBadgeCategoryOrder();

    await alert(AlertModel.getSaveSuccessAlert());
  }

  render() {
    //
    const { badgeCategoryService, userWorkspaceService } = this.injected;

    return (
      <Container fluid>
        <PageTitleView breadcrumb={SelectType.badgeOrderSections} />

        <BadgeOrderListView
          badgeList={badgeCategoryService.badgeCategories}
          userWorkspaceMap={userWorkspaceService.userWorkspaceMap}
          onClickChangeSequence={this.onClickChangeSequence}
        />

        <SubActions form>
          <SubActions.Left>
            <Button type="button" onClick={this.findBadgeList}>
              초기화
            </Button>
          </SubActions.Left>
          <SubActions.Right>
            <Button type="button" onClick={this.onClickSaveDisplayOrder}>
              저장
            </Button>
          </SubActions.Right>
        </SubActions>
      </Container>
    );
  }
}

export default withRouter(BadgeOrderListContainer);
