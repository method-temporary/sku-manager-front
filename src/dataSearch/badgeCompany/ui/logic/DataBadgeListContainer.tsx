import React from 'react';
import { inject, observer } from 'mobx-react';
import { Container } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { PageTitle, Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';
import { LoaderService } from 'shared/components/Loader';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { DataBadgeService, excelDownLoad } from '../../present/logic/DataBadgeService';
import DataBadgeListView from '../view/DataBadgeListView';
import DataBadgeExcelModel from '../../model/DataBadgeExcelModel';
import { UserWorkspaceService } from '../../../../userworkspace';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  categoriesMap: Map<string, string>;
}

interface Injected {
  sharedService: SharedService;
  dataService: DataBadgeService;
  searchBoxService: SearchBoxService;
  userWorkspaceService: UserWorkspaceService;
  loaderService: LoaderService;
}

@inject('sharedService', 'dataService', 'searchBoxService', 'userWorkspaceService', 'loaderService')
@observer
@reactAutobind
class DataBadgeListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'badgeCompany';

  constructor(props: Props) {
    super(props);

    this.init();
  }

  async init() {
    //
    const { userWorkspaceService } = this.injected;

    if (userWorkspaceService.userWorkspaceSelectUsId.length === 0) {
      await userWorkspaceService.findAllUserWorkspacesMap();
    }

    const { dataService } = this.injected;
    await dataService.clearBadgeQuery();
  }

  async findDataBadges() {
    //
    const { sharedService, dataService, loaderService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    loaderService.openLoader(true);

    const totalCount = await dataService.findBadges(pageModel);
    sharedService.setCount(this.paginationKey, totalCount);

    loaderService.closeLoader(true);
  }

  async onClickExcelDownload() {
    //
    const { dataService, loaderService } = this.injected;
    let fileName = '';

    loaderService.openLoader(true);

    const length = await dataService.findExcelDataBadges();
    const wbList: DataBadgeExcelModel[] = [];

    dataService.badgesExcel?.forEach((data, index) => {
      wbList.push(new DataBadgeExcelModel(data, length - index));
    });

    fileName = await excelDownLoad(wbList, 'Badge', '회사별 Badge 목록');
    loaderService.closeLoader(true);
    return fileName;
  }

  render() {
    //
    const { dataService, sharedService, userWorkspaceService } = this.injected;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);

    const companyOptions = addSelectTypeBoxAllOption(userWorkspaceService.userWorkspaceSelectUsId);

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.dataBadge} />

        <SearchBox
          onSearch={this.findDataBadges}
          changeProps={dataService.changeBadgeModalQueryProp}
          queryModel={dataService.searchQueryModel}
          name={this.paginationKey}
          disableInitSearch={true}
        >
          <SearchBox.Group name="조회일자">
            <SearchBox.DatePicker startFieldName="period.startDateMoment" searchButtons />
          </SearchBox.Group>
          <SearchBox.Group>
            <SearchBox.Select name="소속사" fieldName="CompanyCode" options={companyOptions} placeholder="All" />
          </SearchBox.Group>
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findDataBadges}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                count:<strong>{count}</strong>
              </SubActions.Count>
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect />
              <SubActions.ExcelButton download onClick={this.onClickExcelDownload} />
            </SubActions.Right>
          </SubActions>
          <Loader>
            <DataBadgeListView badges={dataService.badges} startNo={startNo} />
          </Loader>
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(DataBadgeListContainer);
