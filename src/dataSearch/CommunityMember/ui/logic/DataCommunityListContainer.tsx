import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Container } from 'semantic-ui-react';
import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import SearchBoxService from 'shared/components/SearchBox/logic/SearchBoxService';
import { PageTitle, Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { DataCommunityService, excelDownLoad } from '../../present/logic/DataCommunityService';
import DataCommunityListView from '../view/DataCommunityListView';
import DataCommunityExcelModel from '../../model/DataCommunityExcelModel';
import { CollegeService } from '../../../../college';
import DataSelectCallService from '../../../selectCall/present/logic/DataSelectCallService';
import { LoaderService } from 'shared/components/Loader/present/logic/LoaderService';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  categoriesMap: Map<string, string>;
}

interface Injected {
  sharedService: SharedService;
  dataCommunityService: DataCommunityService;
  searchBoxService: SearchBoxService;
  collegeService: CollegeService;
  dataSelectCallService: DataSelectCallService;
  loaderService: LoaderService;
}

@inject(
  'sharedService',
  'dataCommunityService',
  'searchBoxService',
  'collegeService',
  'dataSelectCallService',
  'loaderService'
)
@observer
@reactAutobind
class DataCommunityListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'data';

  constructor(props: Props) {
    super(props);

    this.init();
  }

  async init() {
    //
    const { dataCommunityService, dataSelectCallService } = this.injected;
    await dataCommunityService.clearCommunityQuery();
    await dataSelectCallService.findCommunitys();
  }

  async findDataCommunitys() {
    //
    const { sharedService, dataCommunityService, loaderService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    loaderService.openLoader(true);

    const totalCount = await dataCommunityService.findCommunitys(pageModel);
    sharedService.setCount(this.paginationKey, totalCount);

    loaderService.closeLoader(true);
  }

  async onClickExcelDownload() {
    //
    const { dataCommunityService, loaderService } = this.injected;
    let fileName = '';

    loaderService.openLoader(true);

    const length = await dataCommunityService.findExcelDataCommunitys();
    const wbList: DataCommunityExcelModel[] = [];
    dataCommunityService.communitysExcel.map((data, index) => {
      wbList.push(new DataCommunityExcelModel(data));
    });

    fileName = await excelDownLoad(wbList, 'College Community', '커뮤니티 멤버 목록');

    loaderService.closeLoader(true);
    return fileName;
  }

  render() {
    //
    const { dataCommunityService, sharedService, dataSelectCallService } = this.injected;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const queryModel = dataCommunityService.searchQueryModel;
    const communityOptions = dataSelectCallService.communityOptions;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.dataCommunity} />
        <SearchBox
          onSearch={this.findDataCommunitys}
          changeProps={dataCommunityService.changeCommunityModalQueryProp}
          queryModel={queryModel}
          name={this.paginationKey}
          disableInitSearch={true}
        >
          <SearchBox.Group>
            <SearchBox.Select name="커뮤니티" fieldName="CommunityCode" options={communityOptions} placeholder="전체" />
          </SearchBox.Group>
        </SearchBox>
        <Pagination name={this.paginationKey} onChange={this.findDataCommunitys}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{count}</strong>개
              </SubActions.Count>
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect />
              <SubActions.ExcelButton download onClick={this.onClickExcelDownload} />
            </SubActions.Right>
          </SubActions>
          <Loader>
            <DataCommunityListView communitys={dataCommunityService.communitys} startNo={startNo} />
          </Loader>
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(DataCommunityListContainer);
