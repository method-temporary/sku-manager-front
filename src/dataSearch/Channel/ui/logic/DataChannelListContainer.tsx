import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { alert, AlertModel, PageTitle, Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';

import { CollegeService } from 'college';
import { getCollegeOptions } from 'college/ui/logic/CollegeHelper';
import { DataChannelService, excelDownLoad } from '../../present/logic/DataChannelService';
import DataChannelExcelModel from '../../model/DataChannelExcelModel';
import DataChannelListView from '../view/DataChannelListView';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  categoriesMap: Map<string, string>;
}

interface Injected {
  sharedService: SharedService;
  dataChannelService: DataChannelService;
  searchBoxService: SearchBoxService;
  collegeService: CollegeService;
  loaderService: LoaderService;
}

@inject('sharedService', 'dataChannelService', 'searchBoxService', 'collegeService', 'loaderService')
@observer
@reactAutobind
class DataChannelListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'ChannelInterest';

  constructor(props: Props) {
    super(props);

    this.init();
  }

  async init() {
    //
    const { dataChannelService } = this.injected;
    await dataChannelService.clearChannelQuery();
  }

  async findDataChannels() {
    //
    const { sharedService, dataChannelService, loaderService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);
    const searchData = dataChannelService.searchQueryModel;

    //?????????.
    // if (searchData.College == '' && searchData.Channel == '') {
    //   dataChannelService.changeChannelQueryProp('College', 'CLG00001');
    //   await this.onChangeCollege('CLG00001');
    //   dataChannelService.changeChannelQueryProp('Channel', 'CHN0008g');
    // }

    if (searchData.College == '') {
      alert(AlertModel.getCustomAlert(false, '??????', 'College??? ??????????????????.', '??????', () => {}));
      return;
    }

    loaderService.openLoader(true);

    const totalCount = await dataChannelService.findChannels(pageModel);
    sharedService.setCount(this.paginationKey, totalCount);

    loaderService.closeLoader(true);
  }

  async onClickExcelDownload() {
    //
    const { dataChannelService, loaderService } = this.injected;
    let fileName = '';
    loaderService.openLoader(true);

    const length = await dataChannelService.findExcelDataChannels();
    const wbList: DataChannelExcelModel[] = [];

    dataChannelService.channelsExcel.map((data, index) => {
      wbList.push(new DataChannelExcelModel(data));
    });

    fileName = await excelDownLoad(wbList, 'College Channel', '???????????? ???????????? ??????');

    loaderService.closeLoader(true);
    return fileName;
  }

  addSelectTypeBoxOption(selectType: SelectTypeModel[] = []) {
    const allSelectTypeOption: SelectTypeModel = Object.assign(new SelectTypeModel('Select', '??????????????????', ''));
    return [allSelectTypeOption, ...selectType];
  }

  selectChannels() {
    //
    const { mainCollege } = this.injected.collegeService;
    const select: SelectTypeModel[] = [new SelectTypeModel()];

    mainCollege.channels.map((channel) =>
      select.push(new SelectTypeModel(channel.id, getPolyglotToAnyString(channel.name), channel.id))
    );

    //?????? ?????? ??????
    // select.splice(0, 1);
    return select;
  }

  async onChangeCollege(id: string) {
    //
    const { collegeService, searchBoxService, dataChannelService } = this.injected;
    const { changePropsFn } = searchBoxService;
    const { findMainCollege } = collegeService;

    dataChannelService.changeChannelQueryProp('College', id);

    if (id === '') {
      changePropsFn('channelId', '');
    } else {
      await findMainCollege(id);
      changePropsFn('channelId', '');
      dataChannelService.changeChannelQueryProp('Channel', '');
    }
  }

  async onChangeChannel(value: string) {
    //
    const { dataChannelService } = this.injected;
    dataChannelService.changeChannelQueryProp('Channel', value);
  }

  render() {
    //
    const cineroomId = this.props.match.params.cineroomId;
    const { dataChannelService, sharedService, collegeService, searchBoxService } = this.injected;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const collegesSelect = getCollegeOptions(cineroomId, collegeService);
    const queryModel = dataChannelService.searchQueryModel;
    const { searchBoxQueryModel } = searchBoxService;
    const channelDisableKey = 'college';

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.dataChannel} />

        <SearchBox
          onSearch={this.findDataChannels}
          changeProps={dataChannelService.changeChannelModalQueryProp}
          queryModel={queryModel}
          name={this.paginationKey}
          disableInitSearch={true}
        >
          <SearchBox.Group name="College / Channel" subGroup>
            <SearchBox.Select
              // control={Select}
              placeholder="??????????????????"
              fieldName="college"
              options={this.addSelectTypeBoxOption(collegesSelect)}
              // value={dataChannelService.searchQueryModel.College}
              onChange={(e: any, data: any) => this.onChangeCollege(data.value)}
            />
            <SearchBox.Select
              // control={Select}
              disabled={
                searchBoxQueryModel[channelDisableKey] === '' || searchBoxQueryModel[channelDisableKey] === '??????'
              }
              placeholder="??????"
              fieldName="channel"
              options={this.selectChannels()}
              // value={dataChannelService.searchQueryModel.Channel}
              onChange={(e: any, data: any) => this.onChangeChannel(data.value)}
            />
            <div className="preference">
              <label htmlFor="cheese">**????????? JSON ????????? ????????? ???????????? ??? ????????? ????????? ????????? ???????????????.</label>
            </div>
          </SearchBox.Group>
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findDataChannels}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{count}</strong>???
              </SubActions.Count>
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect />
              <SubActions.ExcelButton download onClick={this.onClickExcelDownload} />
            </SubActions.Right>
          </SubActions>
          <Loader>
            <DataChannelListView channels={dataChannelService.channels} startNo={startNo} />
          </Loader>
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(DataChannelListContainer);
