import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Moment } from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { PageTitle, Pagination, SubActions } from 'shared/components';

import { BannerService } from '../../index';
import BannerListView from '../view/BannerListView';
import { BannerQueryModel } from '../../model/BannerQueryModel';
import BannerSearchBoxView from '../view/BannerSearchBoxView';
import { UserWorkspaceService } from 'userworkspace';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface Injected {
  sharedService: SharedService;
  bannerService: BannerService;
  userWorkspaceService: UserWorkspaceService;
}

interface States {
  pageIndex: number;
}

@inject('bannerService', 'sharedService', 'userWorkspaceService')
@observer
@reactAutobind
class BannerListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'banner';

  constructor(props: Props) {
    super(props);
    this.state = { pageIndex: 0 };
  }

  componentDidMount() {
    //
    this.clearAll();
    // this.init();
  }

  async findSearchBannerList() {
    //
    const { bannerService, sharedService } = this.injected;

    bannerService.clearBanners();

    const pageModel = sharedService.getPageModel(this.paginationKey);
    const offsetElementList = await bannerService.findSearchBanner(
      BannerQueryModel.asBannerRdo(bannerService.bannerQuery, pageModel)
    );
    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  onchangeBannerQueryProps(name: string, value: string | Moment | number) {
    const { bannerService } = this.injected;
    bannerService.changeBannerQueryProps(name, value);
  }

  init() {
    this.findSearchBannerList();
  }

  clearAll() {
    const { clearBanner, clearBanners } = this.injected.bannerService;

    clearBanner();
    clearBanners();
  }

  routeToDetailBanner(bannerId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/arrange-management/banners/banner-detail/${bannerId}`
    );
  }

  routeToCreateBanner() {
    //
    this.props.history.push(`/cineroom/${this.props.match.params.cineroomId}/arrange-management/banners/banner-create`);
  }

  clearBannerQueryProps() {
    //
    const { bannerService } = this.injected;
    bannerService.clearBannerQueryProps();
  }

  getSubsidiary(cineroomId: string): string | undefined {
    const { userWorkspaceMap } = this.injected.userWorkspaceService;
    return userWorkspaceMap.get(cineroomId);
  }

  render() {
    const { banners, bannerQuery, bannerCount } = this.injected.bannerService;
    const totalCount = banners.length;
    const { pageIndex } = this.state;
    const { count, startNo } = this.injected.sharedService.getPageModel(this.paginationKey);

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.EnrollmentStateSection} />
        <BannerSearchBoxView
          onSearch={this.findSearchBannerList}
          onChangeQueryProps={this.onchangeBannerQueryProps}
          onClearQueryProps={this.clearBannerQueryProps}
          queryModel={bannerQuery}
          collegeAndChannel
          defaultPeriod={1}
          searchBoxFlag="banner"
          paginationKey={this.paginationKey}
        />
        <Pagination name={this.paginationKey} onChange={this.findSearchBannerList}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count number={count} text="개 Banner등록" />
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect allViewable />
              <SubActions.CreateButton onClick={this.routeToCreateBanner}>Create</SubActions.CreateButton>
            </SubActions.Right>
          </SubActions>

          <BannerListView
            routeToDetailBanner={this.routeToDetailBanner}
            getSubsidiary={this.getSubsidiary}
            startNo={startNo}
            banners={banners}
            pageIndex={pageIndex}
            bannerCount={bannerCount}
            totalCount={totalCount}
          />

          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(BannerListContainer);
