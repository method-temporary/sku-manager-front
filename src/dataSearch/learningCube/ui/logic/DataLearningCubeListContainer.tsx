import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { sharedService, SharedService } from 'shared/present';
import { alert, AlertModel, PageTitle, Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { UserWorkspaceService } from 'userworkspace';
import { CollegeService } from 'college';
import { getCollegeOptions } from 'college/ui/logic/CollegeHelper';
import DataLearningCubeExcelModel from 'dataSearch/learningCube/model/DataLearningCubeExcelModel';
import { DataLearningCubeService, excelDownLoad } from 'dataSearch/learningCube/present/logic/DataLearningCubeService';
import DataLearningCubeListView from '../view/DataLearningCubeListView';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  collegeSelect: SelectTypeModel[];
}

interface Injected {
  sharedService: SharedService;
  dataLearningCubeService: DataLearningCubeService;
  userWorkspaceService: UserWorkspaceService;
  collegeService: CollegeService;
  searchBoxService: SearchBoxService;
  loaderService: LoaderService;
}

@inject(
  'sharedService',
  'dataLearningCubeService',
  'userWorkspaceService',
  'collegeService',
  'searchBoxService',
  'loaderService'
)
@observer
@reactAutobind
class DataLearningCubeListContainer extends ReactComponent<Props, States, Injected> {
  paginationKey = 'LearningCube';

  constructor(props: Props) {
    super(props);

    this.init();
  }

  async init() {
    const { userWorkspaceService, dataLearningCubeService } = this.injected;

    await dataLearningCubeService.clearLearninCubeQuery();
    if (userWorkspaceService.userWorkspaceSelectUsId.length === 0) {
      await userWorkspaceService.findAllUserWorkspacesMap();
    }
  }

  async findLearningCubes() {
    const { sharedService, dataLearningCubeService, loaderService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);
    const searchData = dataLearningCubeService.searchQueryModel;

    if (searchData.college == '') {
      alert(AlertModel.getCustomAlert(false, '??????', 'College??? ??????????????????.', '??????', () => {}));
      return;
    }

    loaderService.openLoader(true);

    const totalCount = await dataLearningCubeService.findLearningCubes(pageModel);
    sharedService.setCount(this.paginationKey, totalCount);

    loaderService.closeLoader(true);
  }

  async onChangeCollege(value: string) {
    const { dataLearningCubeService, searchBoxService, collegeService } = this.injected;
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
    const { dataLearningCubeService, loaderService } = this.injected;
    let fileName = '';

    loaderService.openLoader(true);

    const length = await dataLearningCubeService.findExcelDatas();
    const wbList: DataLearningCubeExcelModel[] = [];

    if (dataLearningCubeService.learningCubeExcelDatas && length) {
      dataLearningCubeService.learningCubeExcelDatas.map((data, index) => {
        wbList.push(new DataLearningCubeExcelModel(data));
      });

      fileName = await excelDownLoad(wbList, 'Cube ????????????', 'Cube ????????????');
    } else {
      alert(AlertModel.getCustomAlert(false, '??????', '???????????? ??????????????????', '??????', () => {}));
    }

    loaderService.closeLoader(true);
    return fileName;
  }

  addSelectTypeBoxOption(selectType: SelectTypeModel[] = []) {
    const allSelectTypeOption: SelectTypeModel = Object.assign(new SelectTypeModel('Select', '??????????????????', ''));
    return [allSelectTypeOption, ...selectType];
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

  render() {
    const cineroomId = this.props.match.params.cineroomId;
    const { dataLearningCubeService, userWorkspaceService, collegeService, searchBoxService } = this.injected;
    const companyOptions = addSelectTypeBoxAllOption(userWorkspaceService.userWorkspaceSelectUsId);
    const collegesSelect = getCollegeOptions(cineroomId, collegeService);
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const queryModel = dataLearningCubeService.searchQueryModel;
    const { searchBoxQueryModel } = searchBoxService;
    const channelDisableKey = 'college';

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.dataLearningCube} />

        <SearchBox
          onSearch={this.findLearningCubes}
          changeProps={dataLearningCubeService.changeDataModalQueryProp}
          queryModel={queryModel}
          name={this.paginationKey}
          disableInitSearch={true}
        >
          <SearchBox.Group>
            <SearchBox.Group name="????????????">
              <SearchBox.DatePicker
                startFieldName="period.startDateMoment"
                endFieldName="period.endDateMoment"
                searchButtons
              />
            </SearchBox.Group>
            <SearchBox.Group name="College / Channel" subGroup>
              <SearchBox.Select
                options={this.addSelectTypeBoxOption(collegesSelect)}
                fieldName="college"
                placeholder="??????????????????"
                onChange={(event, data) => this.onChangeCollege(data.value)}
              />
              <SearchBox.Select
                disabled={
                  searchBoxQueryModel[channelDisableKey] === '' || searchBoxQueryModel[channelDisableKey] === '??????'
                }
                options={this.selectChannels(searchBoxQueryModel[channelDisableKey])}
                placeholder="??????"
                fieldName="channel"
                sub
              />
            </SearchBox.Group>
          </SearchBox.Group>
          <SearchBox.Group name="?????????">
            <SearchBox.Select fieldName="companyCode" options={companyOptions} placeholder="??????" />
          </SearchBox.Group>
          <SearchBox.Query
            options={SelectType.searchPartForCubeAll}
            placeholders={['??????', '???????????? ???????????????.']}
            searchWordDisabledKey="searchPart"
            searchWordDisabledValues={['', '??????']}
          />
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findLearningCubes}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{count}</strong>???{count > 50000 && '  (*5?????? ????????? ?????? ??????????????? ???????????? ??????????????????)'}
              </SubActions.Count>
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect />
              <SubActions.ExcelButton download disabled={count > 50000} onClick={this.onClickExcelDownload} />
            </SubActions.Right>
          </SubActions>
          <Loader>
            <DataLearningCubeListView learningCubes={dataLearningCubeService.learningCubes} startNo={startNo} />
          </Loader>
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(DataLearningCubeListContainer);
