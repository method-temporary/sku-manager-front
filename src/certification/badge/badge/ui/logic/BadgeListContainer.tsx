import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Container } from 'semantic-ui-react';

import { SelectType } from 'shared/model';
import { SharedService, AccessRuleService } from 'shared/present';
import { PageTitle, Pagination, SubActions } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';

import { BadgeCategoryService } from '../../../category';

import { certificationManagementUrl } from '../../../../../Routes';
import { BadgeService } from '../../../../index';
import BadgeListView from '../view/BadgeListView';

import BadgeSearchBoxContainer from './BadgeSearchBoxContainer';
import { excelDownLoad, getBadgeCategoryMap } from './BadgeHelper';
import BadgeExcelModel from '../../model/BadgeExcelModel';
import { UserWorkspaceService } from '../../../../../userworkspace';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  categoriesMap: Map<string, string>;
}

interface Injected {
  sharedService: SharedService;
  badgeService: BadgeService;
  badgeCategoryService: BadgeCategoryService;
  userWorkspaceService: UserWorkspaceService;
  searchBoxService: SearchBoxService;
  accessRuleService: AccessRuleService;
}

@inject(
  'sharedService',
  'badgeService',
  'userWorkspaceService',
  'searchBoxService',
  'accessRuleService',
  'badgeCategoryService'
)
@observer
@reactAutobind
class BadgeListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'badge';

  constructor(props: Props) {
    super(props);

    this.init();
  }

  async init() {
    //
    const { badgeService } = this.injected;
    await badgeService.clearBadgeQuery();
  }

  async findBadges() {
    //
    const { sharedService, badgeService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    const totalCount = await badgeService.findBadges(pageModel);
    await badgeService.findBadgeCounts();

    sharedService.setCount(this.paginationKey, totalCount);
  }

  async onClickExcelDownload() {
    //
    const { badgeService, userWorkspaceService, badgeCategoryService } = this.injected;

    const length = await badgeService.findExcelBadges();
    const userWorkspaceMap = userWorkspaceService.userWorkspaceMap;
    const categoryMap = getBadgeCategoryMap(badgeCategoryService, '');

    const wbList: BadgeExcelModel[] = [];

    badgeService.badgesExcel?.forEach((badge, index) => {
      wbList.push(
        new BadgeExcelModel(
          badge,
          length - index,
          userWorkspaceMap.get(badge.cineroomId),
          categoryMap.get(badge.categoryId)
        )
      );
    });

    const fileName = await excelDownLoad(wbList, 'Badge', 'Badge 목록');
    return fileName;
  }

  routeToBadgeCreate() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badges/badge-create`
    );
  }

  routeToBadgeDetail(badgeId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badges/badge-detail/${badgeId}`
    );
  }

  // componentWillUnmount() {
  //   //
  //   const { badgeService } = this.injected;
  //   badgeService.clearBadgeQueryProp();
  // }

  render() {
    //
    const { badgeService, userWorkspaceService, sharedService, badgeCategoryService } = this.injected;
    const { badgeCounts } = badgeService;
    const { startNo } = sharedService.getPageModel(this.paginationKey);

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.badgeSections} />

        <BadgeSearchBoxContainer findBadges={this.findBadges} paginationKey={this.paginationKey} />

        <Pagination name={this.paginationKey} onChange={this.findBadges}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{badgeCounts.totalCount}</strong>개 Badge 등록 | 승인 Badge
                <strong>{badgeCounts.openedCount}</strong>개 / 승인대기 Badge
                <strong>{badgeCounts.openApprovalCount}</strong>개 / 반려 Badge
                <strong>{badgeCounts.rejectedCount}</strong>개
              </SubActions.Count>
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect />
              <SubActions.ExcelButton download onClick={this.onClickExcelDownload} />
              <SubActions.CreateButton onClick={this.routeToBadgeCreate}>생성</SubActions.CreateButton>
            </SubActions.Right>
          </SubActions>
          <BadgeListView
            badges={badgeService.badgeWithStudents}
            routeToBadgeDetail={this.routeToBadgeDetail}
            startNo={startNo}
            userWorkspaceMap={userWorkspaceService.userWorkspaceMap}
            categoriesMap={badgeCategoryService.badgeCategoryMap}
          />

          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(BadgeListContainer);
