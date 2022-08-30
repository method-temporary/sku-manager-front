import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Container } from 'semantic-ui-react';
import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import SearchBoxService from 'shared/components/SearchBox/logic/SearchBoxService';
import { PageTitle, Pagination, SearchBox, SubActions } from 'shared/components';
import { MainPagePopupService } from '../../present/logic/MainPagePopupService';
import MainPagePopupListView from '../view/MainPagePopupListView';
import { displayManagementUrl } from '../../../../Routes';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  categoriesMap: Map<string, string>;
}

interface Injected {
  sharedService: SharedService;
  mainPagePopupService: MainPagePopupService;
  searchBoxService: SearchBoxService;
}

@inject('sharedService', 'mainPagePopupService', 'searchBoxService')
@observer
@reactAutobind
class MainPagePopupListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'mainPagePopup';

  constructor(props: Props) {
    super(props);

    this.init();
  }

  async init() {
    //
    const { mainPagePopupService } = this.injected;
    await mainPagePopupService.clearMainPagePopupQuery();
  }

  async findMainPagePopups() {
    //
    const { sharedService, mainPagePopupService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    const totalCount = await mainPagePopupService.findMainPagePopups(pageModel);

    sharedService.setCount(this.paginationKey, totalCount);
  }

  handleClickPopupRow(popupId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/popup/mainPagePopup/detail/${popupId}`
    );
  }

  routeToCreatePopup() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/popup/mainPagePopup/create`
    );
  }

  render() {
    //
    const { mainPagePopupService, sharedService } = this.injected;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const { searchQueryModel, changeMainPagePopupModalQueryProp } = mainPagePopupService;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.mainPagePopup} />

        <SearchBox
          onSearch={this.findMainPagePopups}
          changeProps={changeMainPagePopupModalQueryProp}
          queryModel={searchQueryModel}
          name={this.paginationKey}
        >
          <SearchBox.Group name="등록일자">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              unLimitMaxDate
              searchButtons
            />
          </SearchBox.Group>
          <SearchBox.Group name="제목">
            <SearchBox.Input fieldName="title" placeholder="검색어를 입력해주세요." />
          </SearchBox.Group>
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findMainPagePopups}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{count}</strong>개
              </SubActions.Count>
            </SubActions.Left>
            <SubActions.Right>
              <SubActions.CreateButton onClick={this.routeToCreatePopup}>Create</SubActions.CreateButton>
            </SubActions.Right>
          </SubActions>
          <MainPagePopupListView
            handleClickPopupRow={this.handleClickPopupRow}
            mainPagePopups={mainPagePopupService.mainPagePopups}
            startNo={startNo}
          />
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(MainPagePopupListContainer);
