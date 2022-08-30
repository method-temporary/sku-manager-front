import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container, Button } from 'semantic-ui-react';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PatronKey, SelectType, SelectTypeModel } from 'shared/model';
import { sharedService, SharedService } from 'shared/present';
import { addSelectTypeBoxAllOption } from 'shared/helper';
import { alert, AlertModel, PageTitle, Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';
import { SearchBoxService } from 'shared/components/SearchBox';

import { CollegeService } from 'college';
import {
  DataMetaCubeService,
  excelDownLoad,
  pivotExcelDownLoad,
} from 'dataSearch/metaCube/present/logic/DataMetaCubeService';

import DataMetaCubeListView from '../view/DataMetaCubeListView';
import DataMetaCubeExcelModel from 'dataSearch/metaCube/model/DataMetaCubeExcelModel';

// @ts-ignore
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
// @ts-ignore
import TableRenderers from 'react-pivottable/TableRenderers';
// @ts-ignore
import Plot from 'react-plotly.js';
// @ts-ignore
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import 'react-pivottable/pivottable.css';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  collegeSelect: SelectTypeModel[];
}

interface Injected {
  sharedService: SharedService;
  dataMetaCubeService: DataMetaCubeService;
  collegeService: CollegeService;
  searchBoxService: SearchBoxService;
  loaderService: LoaderService;
}

@inject('sharedService', 'dataMetaCubeService', 'collegeService', 'searchBoxService', 'loaderService')
@observer
@reactAutobind
class DataMetaCubeListContainer extends ReactComponent<Props, States, Injected> {
  paginationKey = 'MetaCube';

  constructor(props: Props) {
    super(props);

    this.init();
  }

  async init() {
    const { dataMetaCubeService } = this.injected;

    await dataMetaCubeService.clearMetaCubeQuery();
    dataMetaCubeService.changeDataQueryProp('searchSearchable', 'SearchOn');
  }

  async findMetaCubes() {
    const { sharedService, dataMetaCubeService, loaderService } = this.injected;
    const { viewPivotable } = sharedService;
    const pageModel = sharedService.getPageModel(this.paginationKey);
    let totalCount = 0;

    loaderService.openLoader(true);
    if (viewPivotable) {
      totalCount = await dataMetaCubeService.findPivotDatas();
      sharedService.setCount(this.paginationKey, totalCount);
    } else {
      totalCount = await dataMetaCubeService.findMetaCubes(pageModel);
      sharedService.setCount(this.paginationKey, totalCount);
    }

    loaderService.closeLoader(true);
  }

  async onChangeCollege(value: string) {
    const { searchBoxService, collegeService } = this.injected;
    const { changePropsFn } = searchBoxService;
    const { findMainCollege } = collegeService;
    let channelId = '';

    if (value === '') {
      changePropsFn('channel', '');
    } else {
      await findMainCollege(value).then((response) => {
        if (response && response.channels && response.channels[0]) {
          channelId = response.channels[0].id;
        }
      });
      changePropsFn('channel', channelId);
    }
  }

  async onClickExcelDownload() {
    //
    const { dataMetaCubeService, loaderService, sharedService } = this.injected;

    const { viewPivotable } = sharedService;
    let fileName = 'Cube Meta 정보';

    if (viewPivotable) {
      if (dataMetaCubeService.pivotMetaCubes && dataMetaCubeService.pivotMetaCubes.length > 0) {
        fileName = await pivotExcelDownLoad(
          document.querySelector('.pvtTable'),
          'Pivot Cube Meta 정보',
          'Pivot Cube Meta 정보'
        );
      } else {
        alert(AlertModel.getCustomAlert(false, '안내', '데이터를 확인해주세요', '확인', () => {}));
      }
    } else {
      const length = await dataMetaCubeService.findExcelDatas();
      const wbList: DataMetaCubeExcelModel[] = [];

      if (dataMetaCubeService.metaCubeExcelDatas && length) {
        dataMetaCubeService.metaCubeExcelDatas.map((data, index) => {
          wbList.push(new DataMetaCubeExcelModel(data));
        });

        fileName = await excelDownLoad(wbList, fileName, fileName);
        return fileName;
      } else {
        alert(AlertModel.getCustomAlert(false, '안내', '데이터를 확인해주세요', '확인', () => {}));
      }
    }

    return fileName;
  }

  selectChannels(selectCollege: any) {
    const { mainCollege } = this.injected.collegeService;
    const select: SelectTypeModel[] = [new SelectTypeModel()];

    if (selectCollege) {
      mainCollege.channels.map((channel) => {
        select.push(new SelectTypeModel(channel.id, getPolyglotToAnyString(channel.name), channel.id));
      });

      // select.splice(0, 1);
    }
    return select;
  }

  onChangeTableView() {
    //
    const { sharedService } = this.injected;
    sharedService.setViewPivotable();
  }

  setPivotData = (datas: any) => {
    const pivotList: DataMetaCubeExcelModel[] = [];

    if (datas && datas.length > 0) {
      datas.forEach((item: any) => {
        pivotList.push(new DataMetaCubeExcelModel(item));
      });
    }

    return pivotList;
  };

  getCollegeSelect(): SelectTypeModel[] {
    //
    const { collegeService } = this.injected;
    const { colleges } = collegeService;
    const cineroom = patronInfo.getCineroom();
    const collegeSelect: SelectTypeModel[] = [];

    colleges
      .filter((college) => PatronKey.getCineroomId(college.patronKey) === cineroom?.id)
      .forEach((college) => {
        collegeSelect.push(new SelectTypeModel(college.id, getPolyglotToAnyString(college.name), college.id));
      });
    return collegeSelect;
  }

  render() {
    const cineroomId = this.props.match.params.cineroomId;
    const { dataMetaCubeService, collegeService, searchBoxService } = this.injected;
    // const collegesSelect = getCollegeSelect(cineroomId, collegeService);
    const collegesSelect = this.getCollegeSelect();
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const { viewPivotable } = sharedService;
    const queryModel = dataMetaCubeService.searchQueryModel;
    const { searchBoxQueryModel } = searchBoxService;
    const channelDisableKey = 'college';
    const PlotlyRenderers = createPlotlyRenderers(Plot);

    const SEARCH_TYPE_OPTIONS = [
      { key: '0', text: '전체', value: '' },
      { key: '1', text: 'Y', value: 'Y' },
    ];

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.dataMetaCube} />

        <SearchBox
          onSearch={this.findMetaCubes}
          changeProps={dataMetaCubeService.changeDataModalQueryProp}
          queryModel={queryModel}
          name={this.paginationKey}
          disableInitSearch={true}
        >
          <SearchBox.Group name="등록일자">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
            />
          </SearchBox.Group>
          <SearchBox.Group name="College / Channel">
            <SearchBox.Select
              options={addSelectTypeBoxAllOption(collegesSelect)}
              fieldName="college"
              placeholder="전체"
              onChange={(event, data) => this.onChangeCollege(data.value)}
            />
            <SearchBox.Select
              disabled={
                searchBoxQueryModel[channelDisableKey] === '' || searchBoxQueryModel[channelDisableKey] === '전체'
              }
              options={this.selectChannels(searchBoxQueryModel[channelDisableKey])}
              fieldName="channel"
              placeholder="전체"
              sub
            />
          </SearchBox.Group>
          <SearchBox.Group>
            <SearchBox.Select
              name="메인 카테고리 여부"
              options={SEARCH_TYPE_OPTIONS}
              fieldName="mainCategory"
              placeholder="전체"
            />
            <SearchBox.Select
              name="교육형태"
              fieldName="learningType"
              options={SelectType.learningTypeForEnum}
              placeholder="전체"
            />
          </SearchBox.Group>

          <SearchBox.Query
            options={SelectType.searchPartForCubeAll}
            placeholders={['전체', '검색어를 입력하세요.']}
            searchWordDisabledKey="searchPart"
            searchWordDisabledValues={['', '전체']}
          />
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findMetaCubes}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{count}</strong>개
              </SubActions.Count>
            </SubActions.Left>
            <SubActions.Right>
              <Button className="button" onClick={() => this.onChangeTableView()}>
                {viewPivotable ? 'View Table' : 'View Pivot'}
              </Button>
              <Pagination.LimitSelect />
              <SubActions.ExcelButton download onClick={this.onClickExcelDownload} />
            </SubActions.Right>
          </SubActions>
          <Loader className="pivot">
            {viewPivotable ? (
              <PivotTableUI
                data={this.setPivotData(dataMetaCubeService.pivotMetaCubes)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                hiddenAttributes={['Non', 'No']}
                onChange={(s: any) => {
                  delete s.data;
                  this.setState(s);
                }}
                rendererOptions={{ plotlyOptions: { width: 900, height: 500 } }}
                {...this.state}
              />
            ) : (
              <DataMetaCubeListView metaCubes={dataMetaCubeService.metaCubes} startNo={startNo} />
            )}
          </Loader>

          {!viewPivotable && <Pagination.Navigator />}
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(DataMetaCubeListContainer);
