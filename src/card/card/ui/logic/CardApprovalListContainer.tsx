import React from 'react';
import { observer, inject } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { RouteComponentProps } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { SharedService } from 'shared/present';
import { SelectType, SelectTypeModel, CardCategory } from 'shared/model';
import { PageTitle, Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { SearchBoxService } from 'shared/components/SearchBox';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { CollegeService } from '../../../../college';
import { getCollegeOptions } from '../../../../college/ui/logic/CollegeHelper';

import { learningManagementUrl } from '../../../../Routes';

import { CardService } from '../../index';
import { displayChannel } from './CardHelper';
import CardApprovalListView from '../view/CardApprovalListView';

interface Params {
  cineroomId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface Injected {
  cardService: CardService;
  sharedService: SharedService;
  collegeService: CollegeService;
  searchBoxService: SearchBoxService;
}

@inject('cardService', 'sharedService', 'collegeService', 'searchBoxService')
@observer
@reactAutobind
class CardApprovalListContainer extends ReactComponent<Props, {}, Injected> {
  //
  paginationKey = 'cardApproval';

  constructor(props: Props) {
    super(props);

    this.injected.cardService.clearCardQueryWithOutSearch();
  }

  async findCards() {
    //
    const { cardService, sharedService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    const totalCount = await cardService.findApprovalCards(pageModel);

    sharedService.setCount(this.paginationKey, totalCount);
  }

  async findCardsAndCount() {
    //
    const { cardService } = this.injected;

    await this.findCards();

    await cardService.findCardApprovalCount();
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
    }
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

  routeToDetail(cardId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/card-approval/card-approval-detail/${cardId}`
    );
  }

  displayChannel(categories: CardCategory[]) {
    //
    return displayChannel(categories);
  }

  render() {
    //
    const cineroomId = this.props.match.params.cineroomId;
    const { cardService, sharedService, collegeService, searchBoxService } = this.injected;

    const { cardApprovalCount, cardApprovalSearchQuery, changeCardApprovalSearchQueryProps, cardsApprovals } =
      cardService;
    const collegesSelect = getCollegeOptions(cineroomId, collegeService);
    const { searchBoxQueryModel } = searchBoxService;

    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const { cardStateCount } = cardApprovalCount;

    const channelDisableKey = 'collegeId';

    return (
      <Container>
        <PageTitle breadcrumb={SelectType.cardApprovalSections} />

        <SearchBox
          onSearch={this.findCardsAndCount}
          changeProps={changeCardApprovalSearchQueryProps}
          queryModel={cardApprovalSearchQuery}
          name={this.paginationKey}
        >
          <SearchBox.Group name="등록일자">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
            />
          </SearchBox.Group>
          <SearchBox.Group name="Category / Channel">
            <SearchBox.Select
              options={addSelectTypeBoxAllOption(collegesSelect)}
              fieldName="collegeId"
              placeholder="전체"
              onChange={(event, data) => this.onChangeCollege(data.value)}
            />
            <SearchBox.Select
              disabled={
                searchBoxQueryModel[channelDisableKey] === '' || searchBoxQueryModel[channelDisableKey] === '전체'
              }
              options={this.selectChannels()}
              fieldName="channelId"
              placeholder="전체"
            />
            <SearchBox.Select
              name="제공상태"
              options={SelectType.statusForApprovalContents}
              fieldName="searchCardState"
              placeholder="전체"
            />
          </SearchBox.Group>
          <SearchBox.Query
            options={SelectType.searchPartForCard}
            placeholders={['전체', '검색어를 입력하세요.']}
            searchWordDisabledKey="searchPart"
            searchWordDisabledValues={['', '전체']}
          />
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findCards}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{count}</strong> 개 | 승인요청 <strong>{cardStateCount.openApprovalCount}</strong>개 / 승인
                <strong>{cardStateCount.openedCount}</strong> 개 / 반려 <strong>{cardStateCount.rejectedCount}</strong>
                개
              </SubActions.Count>
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect />
            </SubActions.Right>
          </SubActions>

          <Loader>
            <CardApprovalListView
              cards={cardsApprovals}
              startNo={startNo}
              routeToDetail={this.routeToDetail}
              displayChannel={this.displayChannel}
            />
          </Loader>

          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default CardApprovalListContainer;
