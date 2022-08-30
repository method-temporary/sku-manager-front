import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Pagination } from 'semantic-ui-react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Moment } from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { SelectType } from 'shared/model';
import { PageTitle } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { BannerSearchBox } from 'shared/ui';

import CollegeBannerListView from '../view/CollegeBannerListView';
import { CollegeService } from '../../index';
import { UserWorkspaceService } from 'userworkspace';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  collegeService?: CollegeService;
  sharedService?: SharedService;
}

interface States {
  //collegeId: string;
  //collegeList: any[];
  pageIndex: number;
}

interface Injected {
  userWorkspaceService: UserWorkspaceService;
}

@inject('collegeService', 'sharedService', 'userWorkspaceService')
@observer
@reactAutobind
class CollegeListContainer extends ReactComponent<Props, States, Injected> {
  constructor(props: Props) {
    super(props);
    this.state = {
      //collegeId: '',
      //collegeList: [],
      pageIndex: 0,
    };
  }

  componentDidMount() {
    this.init();
    this.findAllColleges();
  }

  init() {
    const { collegeService } = this.props;
    let currentPage = 0;
    if (collegeService) {
      currentPage = collegeService.collegeBannerQuery.currentPage;

      this.findAllCollegeBanners();
    }
  }

  findAllColleges() {
    //
    const { collegeService } = this.props;
    if (collegeService) collegeService.findAllColleges();
  }

  findAllCollegeBanners(page?: number) {
    const { sharedService, collegeService } = this.props;
    if (sharedService && collegeService) {
      let offset = 0;
      if (page) {
        sharedService.setPage('collegeBanner', page);
        offset = (page - 1) * collegeService.collegeBannerQuery.limit;
        collegeService.changeCollegeBannerQueryProps('currentPage', page);
      } else {
        sharedService.setPageMap('collegeBanner', 0, collegeService.collegeBannerQuery.limit);
      }
      collegeService.changeCollegeBannerQueryProps('offset', offset);
      collegeService
        .findAllCollegeBannersByQuery()
        .then(() => {
          if (page) {
            this.setState({ pageIndex: (page - 1) * 20 });
          }
        })
        .then(() => sharedService.setCount('collegeBanner', collegeService.collegeBannerList.totalCount));
    }
  }

  onchangeCollegeBannerQueryProps(name: string, value: string | Moment | number) {
    const { collegeService } = this.props;
    if (collegeService) {
      collegeService.changeCollegeBannerQueryProps(name, value);
    }
  }

  clearbannerQueryProps() {
    //
    const { collegeService } = this.props;
    if (collegeService) {
      collegeService.clearCollegeBannerQueryProps();
    }
  }

  routeToCreateCollegeBanner() {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/arrange-management/college/college-banner-create`
    );
  }

  handleClickCollegeBannerRow(collegeBannerId: string) {
    //
    const { collegeService } = this.props;
    if (collegeService) {
      collegeService.findCollegeBanner(collegeBannerId).then(() => {
        this.props.history.push(
          `/cineroom/${this.props.match.params.cineroomId}/arrange-management/college/college-banner-detail/${collegeBannerId}`
        );
      });
    }
  }

  getCollegeName(collegeId: string) {
    const { colleges } = this.props.collegeService || ({} as CollegeService);
    let collegeName = '';
    if (colleges && colleges.length) {
      colleges.map((college, index) => {
        if (collegeId === college.id) {
          collegeName = getPolyglotToAnyString(college.name);
        }
      });
    }
    return collegeName;
  }

  getSubsidiary(cineroomId: string): string | undefined {
    const { userWorkspaceMap } = this.injected.userWorkspaceService;
    return userWorkspaceMap.get(cineroomId);
  }

  render() {
    const { collegeBannerList, collegeBannerQuery } = this.props.collegeService || ({} as CollegeService);
    const result = collegeBannerList.results;
    const totalCount = collegeBannerList.totalCount;
    const { pageMap } = this.props.sharedService || ({} as SharedService);
    const { pageIndex } = this.state;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.MainCategoryStateSection} />
        <BannerSearchBox
          onSearch={this.findAllCollegeBanners}
          onChangeQueryProps={this.onchangeCollegeBannerQueryProps}
          onClearQueryProps={this.clearbannerQueryProps}
          queryModel={collegeBannerQuery}
          collegeAndChannel
          defaultPeriod={2}
          searchBoxFlag="banner"
        />
        <CollegeBannerListView
          result={result}
          routeToCreateCollegeBanner={this.routeToCreateCollegeBanner}
          handleClickCollegeBannerRow={this.handleClickCollegeBannerRow}
          getCollegeName={this.getCollegeName}
          getSubsidiary={this.getSubsidiary}
          pageIndex={pageIndex}
          totalCount={totalCount}
        />
        {totalCount === 0 ? null : (
          <>
            <div className="center">
              <Pagination
                activePage={pageMap.get('collegeBanner') ? pageMap.get('collegeBanner').page : 1}
                totalPages={pageMap.get('collegeBanner') ? pageMap.get('collegeBanner').totalPages : 1}
                onPageChange={(e, data) => this.findAllCollegeBanners(data.activePage as number)}
              />
            </div>
          </>
        )}
      </Container>
    );
  }
}

export default withRouter(CollegeListContainer);
