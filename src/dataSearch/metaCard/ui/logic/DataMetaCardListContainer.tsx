import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container, Button } from 'semantic-ui-react';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PatronKey, SelectType, SelectTypeModel } from 'shared/model';
import { sharedService, SharedService } from 'shared/present';
import { alert, AlertModel, PageTitle, Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { addSelectTypeBoxAllOption } from 'shared/helper';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';
import { SearchBoxService } from 'shared/components/SearchBox';

import { UserWorkspaceService } from 'userworkspace';
import { CollegeService } from 'college';
import {
  DataMetaCardService,
  excelDownLoad,
  pivotExcelDownLoad,
} from 'dataSearch/metaCard/present/logic/DataMetaCardService';
import DataMetaCardExcelModel from 'dataSearch/metaCard/model/DataMetaCardExcelModel';

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

import DataMetaCardListView from '../view/DataMetaCardListView';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  collegeSelect: SelectTypeModel[];
}

interface Injected {
  sharedService: SharedService;
  dataMetaCardService: DataMetaCardService;
  userWorkspaceService: UserWorkspaceService;
  collegeService: CollegeService;
  searchBoxService: SearchBoxService;
  loaderService: LoaderService;
}

@inject(
  'sharedService',
  'dataMetaCardService',
  'userWorkspaceService',
  'collegeService',
  'searchBoxService',
  'loaderService'
)
@observer
@reactAutobind
class DataMetaCardListContainer extends ReactComponent<Props, States, Injected> {
  paginationKey = 'MetaCard';

  constructor(props: Props) {
    super(props);

    this.init();
  }

  async init() {
    const { userWorkspaceService, dataMetaCardService } = this.injected;

    await dataMetaCardService.clearMetaCardQuery();
    dataMetaCardService.changeDataQueryProp('searchSearchable', 'SearchOn');
    if (userWorkspaceService.userWorkspaceSelectUsId.length === 0) {
      await userWorkspaceService.findAllUserWorkspacesMap();
    }
  }

  async findMetaCards() {
    const { sharedService, dataMetaCardService, loaderService } = this.injected;
    const { viewPivotable } = sharedService;
    const pageModel = sharedService.getPageModel(this.paginationKey);
    const searchData = dataMetaCardService.searchQueryModel;
    let totalCount = 0;

    // if(searchData.college == '' || searchData.channel == ''){
    //   alert(AlertModel.getCustomAlert(false, '??????', 'College/Channel??? ?????? ??????????????????.', '??????', () => {}));
    //   return;
    // }

    loaderService.openLoader(true);
    if (viewPivotable) {
      totalCount = await dataMetaCardService.findPivotDatas();
      sharedService.setCount(this.paginationKey, totalCount);
    } else {
      totalCount = await dataMetaCardService.findMetaCards(pageModel);
      sharedService.setCount(this.paginationKey, totalCount);
    }

    loaderService.closeLoader(true);
  }

  async onChangeCollege(value: string) {
    const { dataMetaCardService, searchBoxService, collegeService } = this.injected;
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
    const { dataMetaCardService, loaderService, sharedService } = this.injected;
    const { viewPivotable } = sharedService;
    let fileName = '';

    loaderService.openLoader(true);

    if (viewPivotable) {
      if (dataMetaCardService.pivotMetaCards && dataMetaCardService.pivotMetaCards.length > 0) {
        fileName = await pivotExcelDownLoad(
          document.querySelector('.pvtTable'),
          'Pivot Card Meta ??????',
          'Pivot Card Meta ??????'
        );
      } else {
        alert(AlertModel.getCustomAlert(false, '??????', '???????????? ??????????????????', '??????', () => {}));
      }
    } else {
      const length = await dataMetaCardService.findExcelDatas();
      const wbList: DataMetaCardExcelModel[] = [];

      if (dataMetaCardService.metaCardExcelDatas && length) {
        dataMetaCardService.metaCardExcelDatas.map((data, index) => {
          wbList.push(new DataMetaCardExcelModel(data));
        });

        fileName = await excelDownLoad(wbList, 'Card Meta ??????', 'Card Meta ??????');
      } else {
        alert(AlertModel.getCustomAlert(false, '??????', '???????????? ??????????????????', '??????', () => {}));
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
    // ?????? ?????? ??????
    // const pivotTitle = ['CollegeID', 'College???', 'ChannelID', 'Channel???', 'CardID', 'Card???', '?????? ??????', '????????????', '?????????', '????????????', '?????? ?????? ??????'
    // , 'Stamp ??????', '?????? ?????? ?????? ?????? ??????', 'Card ?????? ??????', 'Tags', '?????? ??????', ,'Test ??????', 'Report ??????', 'Survey ??????', '????????????'];
    // const result3: any[] = [];
    // result3.push(pivotTitle)

    const pivotList: DataMetaCardExcelModel[] = [];

    if (datas && datas.length > 0) {
      // dataMetaCardService.metaCardExcelDatas.map((data, index) => {
      //   wbList.push(new DataMetaCardExcelModel(data));
      // });
      datas.forEach((item: any) => {
        // const tempObjValues = Object.values(item)
        // tempObjValues.concat(item.issueCnt.concat('/', item.cardIds));
        // tempObjValues.concat(Math.floor(Number(item.issueCnt / item.cardIds * 100)));
        // result3.push(tempObjValues.concat(
        //   item.issueCnt.concat('/', item.cardIds),
        //   Math.floor(Number(item.issueCnt / item.cardIds * 100)).toString().concat('%')
        // ));
        pivotList.push(new DataMetaCardExcelModel(item));
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
    const { dataMetaCardService, userWorkspaceService, collegeService, searchBoxService } = this.injected;
    const companyOptions = addSelectTypeBoxAllOption(userWorkspaceService.userWorkspaceSelectUsId);
    // const collegesSelect = getCollegeSelect(cineroomId, collegeService);
    const collegesSelect = this.getCollegeSelect();
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const { viewPivotable } = sharedService;
    const queryModel = dataMetaCardService.searchQueryModel;
    const { searchBoxQueryModel } = searchBoxService;
    const channelDisableKey = 'college';
    const PlotlyRenderers = createPlotlyRenderers(Plot);

    const SEARCH_TYPE_OPTIONS = [
      { key: '0', text: '??????', value: '' },
      { key: '1', text: 'Y', value: 'Y' },
    ];

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.dataMetaCard} />

        <SearchBox
          onSearch={this.findMetaCards}
          changeProps={dataMetaCardService.changeDataModalQueryProp}
          queryModel={queryModel}
          name={this.paginationKey}
          disableInitSearch={true}
        >
          <SearchBox.Group name="????????????">
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
              placeholder="??????"
              onChange={(event, data) => this.onChangeCollege(data.value)}
            />
            <SearchBox.Select
              disabled={
                searchBoxQueryModel[channelDisableKey] === '' || searchBoxQueryModel[channelDisableKey] === '??????'
              }
              options={this.selectChannels(searchBoxQueryModel[channelDisableKey])}
              fieldName="channel"
              placeholder="??????"
              sub
            />
          </SearchBox.Group>
          <SearchBox.Group>
            <SearchBox.Select
              name="?????? ??????"
              options={this.getTypeSelect()}
              fieldName="learningType"
              placeholder="??????"
            />
            <SearchBox.Select
              name="Stamp ?????? ??????"
              options={SelectType.stampForSearch}
              fieldName="hasStamp"
              placeholder="??????"
            />
            <SearchBox.Select
              name="????????????"
              options={SelectType.openType}
              fieldName="searchSearchable"
              placeholder="??????"
            />
            <SearchBox.Select
              name="?????? ???????????? ??????"
              options={SEARCH_TYPE_OPTIONS}
              fieldName="mainCategory"
              placeholder="??????"
            />
          </SearchBox.Group>
          <SearchBox.Query
            options={SelectType.searchPartForCubeAll}
            placeholders={['??????', '???????????? ???????????????.']}
            searchWordDisabledKey="searchPart"
            searchWordDisabledValues={['', '??????']}
          />
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findMetaCards}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{count}</strong>???
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
                data={this.setPivotDate(dataMetaCardService.pivotMetaCards)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                hiddenAttributes={['Non', 'No']}
                onChange={(s: any) => {
                  // ?????? ????????? ????????? ?????? ??????????????? ????????? ???????????? ?????? ?????? ??? ????????? ?????? delete ??? ?????? ???????????????
                  // this.setState(s)

                  delete s.data;
                  this.setState(s);
                }}
                rendererOptions={{ plotlyOptions: { width: 900, height: 500 } }}
                {...this.state}
              />
            ) : (
              <DataMetaCardListView metaCards={dataMetaCardService.metaCards} startNo={startNo} />
            )}
          </Loader>

          {!viewPivotable && <Pagination.Navigator />}
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(DataMetaCardListContainer);
