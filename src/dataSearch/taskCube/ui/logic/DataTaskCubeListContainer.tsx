import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectTypeModel } from 'shared/model';
import { sharedService, SharedService } from 'shared/present';
import { alert, AlertModel, Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';
import { SearchBoxService } from 'shared/components/SearchBox';

import { CollegeService } from 'college';
import { getCollegeOptions } from 'college/ui/logic/CollegeHelper';

import {
  DataTaskCubeService,
  excelDownLoad,
  pivotExcelDownLoad,
} from 'dataSearch/taskCube/present/logic/DataTaskCubeService';
import DataTaskCubeExcelModel from 'dataSearch/taskCube/model/DataTaskCubeExcelModel';
import DataTaskCubeListView from '../view/DataTaskCubeListView';

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

interface Props extends RouteComponentProps<Params> {
  cubeId: string;
}

interface Params {
  cineroomId: string;
}

interface States {
  collegeSelect: SelectTypeModel[];
}

interface Injected {
  sharedService: SharedService;
  dataTaskCubeService: DataTaskCubeService;
  collegeService: CollegeService;
  searchBoxService: SearchBoxService;
  loaderService: LoaderService;
}

@inject('sharedService', 'dataTaskCubeService', 'collegeService', 'searchBoxService', 'loaderService')
@observer
@reactAutobind
class DataTaskCubeListContainer extends ReactComponent<Props, States, Injected> {
  paginationKey = 'TaskCube';

  constructor(props: Props) {
    super(props);

    this.init();
  }

  componentDidMount(): void {
    //
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    const { cubeId } = this.props;
    const { cubeId: prevCubeId } = prevProps;
    if (cubeId !== prevCubeId) {
      this.init();
    }
  }

  async init() {
    const { dataTaskCubeService, searchBoxService } = this.injected;
    const { cubeId } = this.props;

    // await dataTaskCubeService.clearTaskCubeQuery();
    dataTaskCubeService.changeDataQueryProp('searchSearchable', 'SearchOn');
    dataTaskCubeService.changeDataQueryProp('id', cubeId);
    searchBoxService.changePropsFn('id', cubeId);
  }

  async findTaskCubes() {
    const { sharedService, dataTaskCubeService, loaderService } = this.injected;
    const { viewPivotable } = sharedService;
    const pageModel = sharedService.getPageModel(this.paginationKey);
    let totalCount = 0;

    loaderService.openLoader(true);
    if (viewPivotable) {
      totalCount = await dataTaskCubeService.findPivotDatas();
      sharedService.setCount(this.paginationKey, totalCount);
    } else {
      totalCount = await dataTaskCubeService.findTaskCubes(pageModel);
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
    const { dataTaskCubeService, loaderService, sharedService } = this.injected;

    const { viewPivotable } = sharedService;

    loaderService.openLoader(true);

    let fileName = 'Task Cubs Post 목록';
    if (viewPivotable) {
      if (dataTaskCubeService.pivotTaskCubes && dataTaskCubeService.pivotTaskCubes.length > 0) {
        fileName = await pivotExcelDownLoad(
          document.querySelector('.pvtTable'),
          'Pivot Task Cubs Post 목록',
          'Pivot Task Cubs Post 목록'
        );
      } else {
        alert(AlertModel.getCustomAlert(false, '안내', '데이터를 확인해주세요', '확인', () => {}));
      }
    } else {
      const length = await dataTaskCubeService.findExcelDatas();
      const wbList: DataTaskCubeExcelModel[] = [];

      if (dataTaskCubeService.taskCubeExcelDatas && length) {
        dataTaskCubeService.taskCubeExcelDatas.map((data, index) => {
          wbList.push(new DataTaskCubeExcelModel(data));
        });

        fileName = await excelDownLoad(wbList, 'Task Cubs Post 목록', 'Task Cubs Post 목록');
      } else {
        alert(AlertModel.getCustomAlert(false, '안내', '데이터를 확인해주세요', '확인', () => {}));
      }
    }

    loaderService.closeLoader(true);
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
    const pivotList: DataTaskCubeExcelModel[] = [];

    if (datas && datas.length > 0) {
      datas.forEach((item: any) => {
        pivotList.push(new DataTaskCubeExcelModel(item));
      });
    }

    return pivotList;
  };

  render() {
    const cineroomId = this.props.match.params.cineroomId;
    const { dataTaskCubeService, collegeService, searchBoxService } = this.injected;
    const collegesSelect = getCollegeOptions(cineroomId, collegeService);
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const { viewPivotable } = sharedService;
    const queryModel = dataTaskCubeService.searchQueryModel;
    const { searchBoxQueryModel } = searchBoxService;
    const channelDisableKey = 'college';
    const PlotlyRenderers = createPlotlyRenderers(Plot);

    return (
      <>
        <SearchBox
          onSearch={this.findTaskCubes}
          changeProps={dataTaskCubeService.changeDataModalQueryProp}
          queryModel={queryModel}
          name={this.paginationKey}
          disableInitSearch={false}
        >
          <SearchBox.Group name="등록일자">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
            />
          </SearchBox.Group>
        </SearchBox>

        <SubActions>
          <SubActions.Left>
            <SubActions.Count text="개 글 등록" number={count} />
          </SubActions.Left>
          <SubActions.Right>
            <SubActions.ExcelButton download onClick={this.onClickExcelDownload} />
          </SubActions.Right>
        </SubActions>
        <Pagination name={this.paginationKey} onChange={this.findTaskCubes}>
          <Loader>
            <DataTaskCubeListView taskCubes={dataTaskCubeService.taskCubes} startNo={startNo} />
          </Loader>
          <Pagination.Navigator />
        </Pagination>
      </>
    );
  }
}

export default withRouter(DataTaskCubeListContainer);
