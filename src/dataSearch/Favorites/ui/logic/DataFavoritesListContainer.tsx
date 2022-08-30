import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { PageTitle, Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { CollegeService } from 'college';
import { getCollegeOptions } from 'college/ui/logic/CollegeHelper';

import { DataFavoritesService, excelDownLoad } from '../../present/logic/DataFavoritesService';
import DataFavoritesExcelModel from '../../model/DataFavoritesExcelModel';
import DataFavoritesListView from '../view/DataFavoritesListView';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  categoriesMap: Map<string, string>;
}

interface Injected {
  sharedService: SharedService;
  dataFavoritesService: DataFavoritesService;
  searchBoxService: SearchBoxService;
  collegeService: CollegeService;
  loaderService: LoaderService;
}

@inject('sharedService', 'dataFavoritesService', 'searchBoxService', 'collegeService', 'loaderService')
@observer
@reactAutobind
class DataFavoritesListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'data';

  constructor(props: Props) {
    super(props);

    this.init();
  }

  async init() {
    //
    const { dataFavoritesService } = this.injected;
    await dataFavoritesService.clearChannelQuery();
  }

  async findDataChannels() {
    //
    const { sharedService, dataFavoritesService, loaderService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    loaderService.openLoader(true);

    const totalCount = await dataFavoritesService.findChannels(pageModel);
    sharedService.setCount(this.paginationKey, totalCount);

    loaderService.closeLoader(true);
  }

  async onClickExcelDownload() {
    //
    const { dataFavoritesService, loaderService } = this.injected;
    let fileName = '';
    loaderService.openLoader(true);

    const length = await dataFavoritesService.findExcelDataChannels();
    const wbList: DataFavoritesExcelModel[] = [];

    dataFavoritesService.favoritesExcel.map((data, index) => {
      wbList.push(new DataFavoritesExcelModel(data));
    });

    fileName = await excelDownLoad(wbList, 'College Channel', '사용자별 즐겨찾기 목록');

    loaderService.closeLoader(true);
    return fileName;
  }

  selectChannels() {
    //
    const { mainCollege } = this.injected.collegeService;
    const select: SelectTypeModel[] = [new SelectTypeModel()];

    mainCollege.channels.map((channel) =>
      select.push(new SelectTypeModel(channel.id, getPolyglotToAnyString(channel.name), channel.id))
    );

    return select;
  }

  async onChangeCollege(id: string) {
    //
    const { collegeService, searchBoxService } = this.injected;
    const { changePropsFn } = searchBoxService;
    const { findMainCollege } = collegeService;

    if (id === '') {
      changePropsFn('channelId', '');
    } else {
      await findMainCollege(id);
      changePropsFn('channelId', '');
    }
  }

  render() {
    //
    const cineroomId = this.props.match.params.cineroomId;
    const { dataFavoritesService, sharedService, searchBoxService, collegeService } = this.injected;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const collegesSelect = getCollegeOptions(cineroomId, collegeService);
    const queryModel = dataFavoritesService.searchQueryModel;
    const { searchBoxQueryModel } = searchBoxService;
    const collegeDisableKey = 'sharedOnly';
    const channelDisableKey = 'collegeId';

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.dataFavorites} />

        <SearchBox
          onSearch={this.findDataChannels}
          changeProps={dataFavoritesService.changeChannelModalQueryProp}
          queryModel={queryModel}
          name={this.paginationKey}
          disableInitSearch={true}
        >
          <SearchBox.Group name="College / Channel" subGroup>
            <SearchBox.Select
              disabled={searchBoxQueryModel[collegeDisableKey]}
              options={addSelectTypeBoxAllOption(collegesSelect)}
              fieldName="College"
              placeholder="전체"
              onChange={(event, data) => this.onChangeCollege(data.value)}
            />
            <SearchBox.Select
              disabled={
                searchBoxQueryModel[channelDisableKey] === '' || searchBoxQueryModel[channelDisableKey] === '전체'
              }
              options={this.selectChannels()}
              fieldName="Channel"
              placeholder="전체"
              sub
            />
          </SearchBox.Group>
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findDataChannels}>
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
            <DataFavoritesListView favorites={dataFavoritesService.favorites} startNo={startNo} />
          </Loader>
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(DataFavoritesListContainer);
