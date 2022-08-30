import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Breadcrumb, Container, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { Pagination, SubActions } from 'shared/components';
import { SelectType } from 'shared/model';

import { BannerService } from '../..';
import BannerBundleListView from '../view/BannerBundleListView';
import BannerBundleService from '../../present/logic/BannerBundleService';
import BannerBundleSearchBoxView from '../view/BannerBundleSearchBoxView';
import { UserGroupService } from '../../../usergroup';
import { setOffsetLimit } from '../../../shared/helper';
import { UserWorkspaceService } from 'userworkspace';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface Injected {
  bannerBundleService: BannerBundleService;
  bannerService: BannerService;
  sharedService: SharedService;
  userGroupService: UserGroupService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('bannerService', 'sharedService', 'bannerBundleService', 'userGroupService', 'userWorkspaceService')
@observer
@reactAutobind
class BannerBundleListContainer extends ReactComponent<Props, {}, Injected> {
  //
  paginationKey = 'bannerBundle';

  componentDidMount() {
    //
    this.init();
  }

  async init(): Promise<void> {
    this.clearAll();
    await this.injected.userGroupService.findUserGroupMap();
  }

  async findSearchBannerBundleList() {
    const { bannerBundleService, sharedService } = this.injected;
    const { bannerBundleRdo, changeBannerBundleRdoProps } = bannerBundleService;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    setOffsetLimit(changeBannerBundleRdoProps, pageModel);

    const offsetElementList = await bannerBundleService.findSearchBannerBundle(bannerBundleRdo);
    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  clearBannerQueryProps() {
    //
    const { bannerService } = this.injected;
    if (bannerService) {
      bannerService.clearBannerQueryProps();
    }
  }

  routeToDetailBannerBundle(bannerId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/arrange-management/bannerBundles/bannerBundle-detail/${bannerId}`
    );
  }

  routeToCreateBannerBundle() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/arrange-management/bannerBundles/bannerBundle-create`
    );
  }

  clearAll() {
    const { bannerBundleService } = this.injected;

    bannerBundleService.clearBannerBannerBundleForm();
    bannerBundleService.clearBannerBundles();
  }

  getSubsidiary(cineroomId: string): string | undefined {
    const { userWorkspaceMap } = this.injected.userWorkspaceService;
    return userWorkspaceMap.get(cineroomId);
  }

  render() {
    const { userGroupService, bannerService, bannerBundleService, sharedService } = this.injected;
    const { bannerCount } = bannerService;
    const { bannerBundles, bannerBundleRdo, changeBannerBundleRdoProps } = bannerBundleService;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);

    return (
      <Container fluid>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.OrganizationStateSection} />
          <Header as="h2">Banner 편성관리</Header>
        </div>
        <BannerBundleSearchBoxView
          onSearch={this.findSearchBannerBundleList}
          bannerBundleRdo={bannerBundleRdo}
          changeBannerBundleRdoProps={changeBannerBundleRdoProps}
          paginationKey={this.paginationKey}
        />

        <Pagination name={this.paginationKey} onChange={this.findSearchBannerBundleList}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count number={count} text="개 BannerBundle 등록" />
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect allViewable />
              <SubActions.CreateButton onClick={this.routeToCreateBannerBundle}>Create</SubActions.CreateButton>
            </SubActions.Right>
          </SubActions>
          <BannerBundleListView
            routeToDetailBannerBundle={this.routeToDetailBannerBundle}
            getSubsidiary={this.getSubsidiary}
            bannerBundleWithBannerRom={bannerBundles}
            bannerCount={bannerCount}
            startNo={startNo}
            userGroupMap={userGroupService.userGroupMap}
          />
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(BannerBundleListContainer);
