import React from 'react';
import { inject, observer } from 'mobx-react';
import { Container } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { alert, AlertModel, PageTitle, Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { LoaderService } from 'shared/components/Loader';

import { UserWorkspaceService } from 'userworkspace';
import DataMetaBadgeExcelModel from 'dataSearch/metaBadge/model/DataMetaBadgeExcelModel';
import DataMetaBadgeService, { excelDownLoad } from 'dataSearch/metaBadge/present/logic/DataMetaBadgeService';
import DataMetaBadgeListView from '../view/DataMetaBadgeListView';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  // collegeSelect: SelectTypeModel[];
}

interface Injected {
  dataMetaBadgeService: DataMetaBadgeService;
  userWorkspaceService: UserWorkspaceService;
  sharedService: SharedService;
  loaderService: LoaderService;
}

@inject('dataMetaBadgeService', 'userWorkspaceService', 'sharedService', 'loaderService')
@observer
@reactAutobind
class DataMetaBadgeListContainer extends ReactComponent<Props, States, Injected> {
  paginationKey = 'MetaBadge';

  constructor(props: Props) {
    super(props);

    this.init();
  }

  async init() {
    const { userWorkspaceService, dataMetaBadgeService } = this.injected;

    await dataMetaBadgeService.clearMetaBadgeQuery();
    if (userWorkspaceService.userWorkspaceSelectUsId.length === 0) {
      await userWorkspaceService.findAllUserWorkspacesMap();
    }
  }

  async findMetaBades() {
    const { sharedService, dataMetaBadgeService, loaderService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);
    const searchData = dataMetaBadgeService.queryModel;

    loaderService.openLoader(true);
    const totalCount = await dataMetaBadgeService.findMetaBadges(pageModel);
    sharedService.setCount(this.paginationKey, totalCount);
    loaderService.closeLoader(true);
  }

  async onClickExcelDownload() {
    const { dataMetaBadgeService, loaderService } = this.injected;
    const searchData = dataMetaBadgeService.queryModel;
    let fileName = '';

    loaderService.openLoader(true);

    const totalCount = await dataMetaBadgeService.findExcelDatas();
    const wbList: DataMetaBadgeExcelModel[] = [];

    if (dataMetaBadgeService.metaBadeExcelDatas && totalCount) {
      dataMetaBadgeService.metaBadeExcelDatas.map((data, index) => {
        wbList.push(new DataMetaBadgeExcelModel(data));
      });
      fileName = await excelDownLoad(wbList, 'Meta-Badge', 'Card_Badge Mapping 정보');
    } else {
      alert(AlertModel.getCustomAlert(false, '안내', '데이터를 확인해주세요', '확인', () => {}));
    }

    loaderService.closeLoader(true);
    return fileName;
  }

  render() {
    const { dataMetaBadgeService, sharedService } = this.injected;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const queryModel = dataMetaBadgeService.queryModel;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.dataMetaBadge} />

        <SearchBox
          name={this.paginationKey}
          changeProps={dataMetaBadgeService.changeDataModalQueryProp}
          onSearch={this.findMetaBades}
          queryModel={queryModel}
          disableInitSearch={true}
        >
          <SearchBox.Query options={SelectType.searchPartForMetaBadge} searchWordDisabledValues={['전체', '']} />
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findMetaBades}>
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
            <DataMetaBadgeListView metaBadges={dataMetaBadgeService.metaBades} startNo={startNo} />
          </Loader>

          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(DataMetaBadgeListContainer);
