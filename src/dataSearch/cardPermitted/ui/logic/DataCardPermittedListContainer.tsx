import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Container, Form, Select, Button } from 'semantic-ui-react';

import { alert, AlertModel, PageTitle, Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { SelectType } from 'shared/model';
import { sharedService, SharedService } from 'shared/present';
import {
  DataCardPermittedService,
  excelDownLoad,
  pivotExcelDownLoad,
} from 'dataSearch/cardPermitted/present/logic/DataCardPermittedService'

import { UserWorkspaceService } from '../../../../userworkspace';
import { addSelectTypeBoxAllOption } from '../../../../shared/helper/selectTypeBoxHelper';
import SelectTypeModel from 'shared/model/SelectTypeModel';
import { getPolyglotToAnyString } from 'shared/components/Polyglot/logic/PolyglotLogic';
import { LoaderService } from '../../../../shared/components/Loader/present/logic/LoaderService';
import { CollegeService } from '../../../../college';
import SearchBoxService from 'shared/components/SearchBox/logic/SearchBoxService';
import DataCardPermittedListView from '../view/DataCardPermittedView';
import DataCardPermittedExcelModel from 'dataSearch/cardPermitted/model/DataCardPermittedExcelModel';
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
import { PatronKey } from '../../../../shared/model/PatronKey';
import { patronInfo } from '@nara.platform/dock';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  collegeSelect: SelectTypeModel[];
}

interface Injected {
  sharedService: SharedService;
  dataCardPermittedService: DataCardPermittedService;
  userWorkspaceService: UserWorkspaceService;
  collegeService: CollegeService;
  searchBoxService: SearchBoxService;
  loaderService: LoaderService;
}

@inject(
  'sharedService',
  'dataCardPermittedService',
  'userWorkspaceService',
  'collegeService',
  'searchBoxService',
  'loaderService'
)
@observer
@reactAutobind
class DataCardPermittedListContainer extends ReactComponent<Props, States, Injected> {
  paginationKey = 'CardPermitted';

  constructor(props: Props) {
    super(props);

    this.init();
  }

  async init() {
    const { userWorkspaceService, dataCardPermittedService } = this.injected;

    await dataCardPermittedService.clearCardPermittedQuery();
    // dataCardPermittedService.changeDataQueryProp('searchSearchable', 'SearchOn');
    if (userWorkspaceService.userWorkspaceSelectUsId.length === 0) {
      await userWorkspaceService.findAllUserWorkspacesMap();
    }
  }

  async findCardPermitted() {
    const { sharedService, dataCardPermittedService, loaderService } = this.injected;
    const { viewPivotable } = sharedService;
    const pageModel = sharedService.getPageModel(this.paginationKey);
    const searchData = dataCardPermittedService.searchQueryModel;
    let totalCount = 0;

    // if(searchData.college == '' || searchData.channel == ''){
    //   alert(AlertModel.getCustomAlert(false, '안내', 'College/Channel을 모두 선택해주세요.', '확인', () => {}));
    //   return;
    // }

    loaderService.openLoader(true);
    if (viewPivotable) {
      totalCount = await dataCardPermittedService.findPivotDatas();
      sharedService.setCount(this.paginationKey, totalCount);
    } else {
      totalCount = await dataCardPermittedService.findCardPermitted(pageModel);
      sharedService.setCount(this.paginationKey, totalCount);
    }

    loaderService.closeLoader(true);
  }

  async onChangeCollege(value: string) {
    const { dataCardPermittedService, searchBoxService, collegeService } = this.injected;
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

  getTypeSelect() {
    //
    const selectType = SelectType.learningTypeForSearch;
    const result: SelectTypeModel[] = [];

    selectType.forEach((select) => {
      result.push(new SelectTypeModel(select.key, select.text, select.value));
    });

    result.push(new SelectTypeModel('Course', 'Course', 'Course'));

    return result;
  }

  async onClickExcelDownload() {
    const { dataCardPermittedService, loaderService, sharedService } = this.injected;
    const { viewPivotable } = sharedService;
    let fileName = '';

    loaderService.openLoader(true);

    if (viewPivotable) {
      if (dataCardPermittedService.pivotCardPermitteds && dataCardPermittedService.pivotCardPermitteds.length > 0) {
        fileName = await pivotExcelDownLoad(document.querySelector('.pvtTable'), 'Pivot Card 핵인싸과정 정보', 'Pivot Card 핵인싸과정 정보');
      } else {
        alert(AlertModel.getCustomAlert(false, '안내', '데이터를 확인해주세요', '확인', () => {}));
      }
    } else {
      const length = await dataCardPermittedService.findExcelDatas();
      const wbList: DataCardPermittedExcelModel[] = [];

      if (dataCardPermittedService.cardPermittedExcelDatas && length) {
        dataCardPermittedService.cardPermittedExcelDatas.map((data, index) => {
          wbList.push(new DataCardPermittedExcelModel(data));
        });

        fileName = await excelDownLoad(wbList, 'Card 핵인싸과정 정보', 'Card 핵인싸과정 정보');
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

  setPivotDate = (datas: any) => {
    const pivotList: DataCardPermittedExcelModel[] = [];

    if (datas && datas.length > 0) {
      
      datas.forEach((item: any) => {
        pivotList.push(new DataCardPermittedExcelModel(item));
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
    const { dataCardPermittedService, userWorkspaceService, collegeService, searchBoxService } = this.injected;
    const companyOptions = addSelectTypeBoxAllOption(userWorkspaceService.userWorkspaceSelectUsId);
    // const collegesSelect = getCollegeSelect(cineroomId, collegeService);
    const collegesSelect = this.getCollegeSelect();
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const { viewPivotable } = sharedService;
    const queryModel = dataCardPermittedService.searchQueryModel;
    const { searchBoxQueryModel } = searchBoxService;
    const channelDisableKey = 'college';
    const PlotlyRenderers = createPlotlyRenderers(Plot);

    const SEARCH_TYPE_OPTIONS = [
      { key: '0', text: '전체', value: '' },
      { key: '1', text: 'Y', value: 'Y' },
    ];

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.dataCardPermitted} />

        <SearchBox
          onSearch={this.findCardPermitted}
          changeProps={dataCardPermittedService.changeDataModalQueryProp}
          queryModel={queryModel}
          name={this.paginationKey}
          disableInitSearch={true}
        >
          <SearchBox.Query
            options={SelectType.searchPartForCubeAll}
            placeholders={['전체', '검색어를 입력하세요.']}
            searchWordDisabledKey="searchPart"
            searchWordDisabledValues={['', '전체']}
          />
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findCardPermitted}>
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
                data={this.setPivotDate(dataCardPermittedService.pivotCardPermitteds)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                hiddenAttributes={['Non', 'No']}
                onChange={(s: any) => {
                  // 기존 샘플은 아래와 같이 되어있는데 조회한 데이터로 새로 반영 시 아래와 같이 delete 후 새로 맵핑해야함
                  // this.setState(s)

                  delete s.data;
                  this.setState(s);
                }}
                rendererOptions={{ plotlyOptions: { width: 900, height: 500 } }}
                {...this.state}
              />
            ) : (
              <DataCardPermittedListView cardPermitteds={dataCardPermittedService.cardPermitteds} startNo={startNo} />
            )}
          </Loader>

          {!viewPivotable && <Pagination.Navigator />}
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(DataCardPermittedListContainer);
