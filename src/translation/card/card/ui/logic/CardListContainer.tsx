import React from 'react';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import moment from 'moment';
import XLSX from 'xlsx';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel, CardCategory, UserGroupRuleModel, GroupBasedAccessRule } from 'shared/model';
import { SharedService, AccessRuleService } from 'shared/present';
import { PageTitle, Pagination, SearchBox, SubActions, UserGroupSelectModal, Loader } from 'shared/components';
import { Language, getPolyglotToAnyString, setLangSupports, setPolyglotValues } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';
import { SearchBoxService } from 'shared/components/SearchBox';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { CollegeService } from 'college';
import UserGroupService from 'usergroup/group/present/logic/UserGroupService';

import { translationManagementUrl } from 'Routes';

import { CardService } from '../../index';
import { displayChannel } from 'card/card/ui/logic/CardHelper';
import { CardExcelModel } from 'card/card/model/CardExcelModel';
import { CardPolyglotUdo, getInitCardPolyglotUdo } from '../../../../../_data/lecture/cards/model/CardPolyglotUdo';
import CardListView from '../../../../../card/card/ui/view/CardListView';
import { getCollegeOptions } from '../../../../../card/list/CardList.util';

interface Params {
  cineroomId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface State {
  excelReadModalWin: boolean;
  invalidModalWin: boolean;
  fileName: string;
  loaderText: string;
  failedIds: string[];
}

interface Injected {
  cardService: CardService;
  sharedService: SharedService;
  collegeService: CollegeService;
  searchBoxService: SearchBoxService;
  userGroupService: UserGroupService;
  accessRuleService: AccessRuleService;
  loaderService: LoaderService;
}

@inject(
  'cardService',
  'sharedService',
  'collegeService',
  'searchBoxService',
  'userGroupService',
  'accessRuleService',
  'loaderService'
)
@observer
@reactAutobind
class CardListContainer extends ReactComponent<Props, State, Injected> {
  //
  paginationKey = 'card';

  constructor(props: Props) {
    //
    super(props);
    this.state = {
      excelReadModalWin: false,
      invalidModalWin: false,
      fileName: '',
      loaderText: '',
      failedIds: [],
    };

    this.init();
  }

  async init() {
    //
    this.injected.cardService.clearCardQuery();
    this.injected.cardService.clearCardContentsQuery();

    this.injected.cardService.changeCardSearchQueryProps('searchPart', '과정명');
    await this.injected.userGroupService.findUserGroupMap();
  }

  async findCards() {
    //
    const { cardService, sharedService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    const totalCount = await cardService.findCards(pageModel);

    await sharedService.setCount(this.paginationKey, totalCount);
  }

  async findCardsAndCount() {
    //
    const { cardService } = this.injected;

    await this.findCards();

    await cardService.findCardCount();
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

  onSaveAccessRule(accessRoles: UserGroupRuleModel[]): void {
    //
    const { searchBoxService, accessRuleService } = this.injected;
    const accessRuleList = accessRoles.map((accessRole) => accessRole.seq);
    const ruleStrings = GroupBasedAccessRule.getRuleValueString(accessRoles);

    accessRuleService.clearGroupBasedAccessRule();
    accessRuleService.changeGroupBasedAccessRuleProp(
      `groupAccessRoles[${accessRuleService.groupBasedAccessRule.accessRules.length}].accessRoles`,
      accessRuleService.accessRules
    );

    searchBoxService.changePropsFn('accessRule', accessRuleList);
    searchBoxService.changePropsFn('ruleStrings', ruleStrings);
  }

  clearGroupBasedRules(): void {
    //
    const { searchBoxService } = this.injected;

    searchBoxService.changePropsFn('accessRule', []);
    searchBoxService.changePropsFn('ruleStrings', '');
  }

  onChangeSharedOnly(check: boolean) {
    //
    const { cardService, searchBoxService } = this.injected;

    searchBoxService.changePropsFn('sharedOnly', check);
    cardService.changeCardSearchQueryProps('sharedOnly', check);

    if (check) {
      searchBoxService.changePropsFn('collegeId', '');
      searchBoxService.changePropsFn('channelId', '');
    }
  }

  async onClickExcelDown() {
    //
    const { cardService, collegeService, userGroupService } = this.injected;
    const { userGroupMap } = userGroupService;

    const wbList: CardExcelModel[] = [];

    await cardService.findAllCardsForExcel();

    cardService.cardsForExcel &&
      cardService.cardsForExcel.forEach((cardWiths) =>
        wbList.push(new CardExcelModel(cardWiths, collegeService, userGroupMap))
      );
    const cardExcel = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, cardExcel, 'Card');

    const date = moment().format('YYYY-MM-DD_HH:mm:ss');
    const fileName = `Card 관리.${date}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
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

  displayChannel(categories: CardCategory[]) {
    //
    return displayChannel(categories);
  }

  routeToCreated() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${translationManagementUrl}/cards/card-create`
    );
  }

  routeToDetail(cardId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${translationManagementUrl}/cards/card-detail/${cardId}`
    );
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

  onChangeOpen() {
    //
    const { excelReadModalWin } = this.state;
    if (excelReadModalWin) this.setState({ excelReadModalWin: false });
    else this.setState({ excelReadModalWin: true });
  }

  uploadFile(file: File) {
    //
    const { cardService } = this.injected;

    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      let binary = '';
      const data = new Uint8Array(e.target.result);
      const length = data.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(data[i]);
      }
      const workbook: any = XLSX.read(binary, { type: 'binary' });
      let cards: any[] = [];

      const jsonArray = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      if (jsonArray.length === 0) {
        return;
      }
      cards = jsonArray;

      const udos: CardPolyglotUdo[] = [];

      cards &&
        cards.forEach((card, index) => {
          const udo = getInitCardPolyglotUdo();
          const cardId = card['Card Id'];
          const defaultLanguage = card['기본언어'];
          const cardName = setPolyglotValues(card['Card 명 (국문)'], card['Card 명 (영문)'], card['Card名(中文)']);
          const tags = setPolyglotValues(card['Tag 정보 (국문)'], card['Tag 정보 (영문)'], card['Tag信息(中文)']);
          const simpleDescription = setPolyglotValues(
            card['Card 표시 문구 (국문)'],
            card['Card 표시 문구 (영문)'],
            card['Card显示文字(中文)']
          );
          const description = setPolyglotValues(
            card['Card 소개 (국문)'],
            card['Card 소개 (영문)'],
            card['Card介绍(中文)']
          );
          const reportName = setPolyglotValues(
            card['Report 명 (국문)'],
            card['Report 명 (영문)'],
            card['Report 명 (중문)']
          );
          const reportQuestion = setPolyglotValues(
            card['작성 가이드 (국문)'],
            card['작성 가이드 (영문)'],
            card['작성 가이드 (중문)']
          );

          //tag?

          udo.cardId = cardId;
          udo.name = cardName;
          udo.tags = tags;
          udo.simpleDescription = simpleDescription;

          udo.description = description;
          udo.reportName = reportName;
          udo.reportQuestion = reportQuestion;

          udo.langSupports = setLangSupports(
            cardName.getValue(Language.Ko),
            cardName.getValue(Language.En),
            cardName.getValue(Language.Zh),
            defaultLanguage
          );
          udos.push(udo);
        });

      this.setState({ fileName: file.name });
      cardService.setCardUdos(udos);
    };
    fileReader.readAsArrayBuffer(file);
  }

  async onReadExcel(): Promise<void> {
    //
    const { cardService, loaderService } = this.injected;
    const { cardPolyglotUdos } = cardService;

    loaderService.openPageLoader(true);

    let loadingCount = 0;
    const failedIds: string[] = [];

    /* eslint-disable no-await-in-loop */
    for (const udo of cardPolyglotUdos) {
      this.setState({
        loaderText: `일괄 변경 중(${loadingCount}/${cardPolyglotUdos.length})`,
      });
      try {
        await cardService.modifyPolyglotsForAdmin(udo.cardId, udo);
      } catch (ex) {
        failedIds.push(udo.cardId);
      }
      loadingCount++;
    }

    this.setState({
      excelReadModalWin: false,
      invalidModalWin: true,
      loaderText: '',
      fileName: '',
      failedIds,
    });

    loaderService.closeLoader(true);
  }

  async onInvalidModalClose(value: boolean): Promise<void> {
    this.setState({ invalidModalWin: false });
    await this.findCards();
  }

  render() {
    //
    const cineroomId = this.props.match.params.cineroomId;
    const { loaderText } = this.state;
    const { cardService, sharedService, searchBoxService } = this.injected;

    const { cardCount, cards, cardSearchQuery, changeCardSearchQueryProps } = cardService;
    const collegesSelect = getCollegeOptions(cineroomId);

    const { searchBoxQueryModel } = searchBoxService;

    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const { cardSearchableCount } = cardCount;

    const collegeDisableKey = 'sharedOnly';
    const channelDisableKey = 'collegeId';

    return (
      <Container>
        <PageTitle breadcrumb={SelectType.translationCardSections} />

        <SearchBox
          onSearch={this.findCardsAndCount}
          changeProps={changeCardSearchQueryProps}
          queryModel={cardSearchQuery}
          name={this.paginationKey}
        >
          <SearchBox.Group name="등록일자">
            <SearchBox.CubeDatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
            />
          </SearchBox.Group>
          <SearchBox.Group name="College / Channel">
            <SearchBox.Select
              disabled={searchBoxQueryModel[collegeDisableKey]}
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
              sub
            />
            <SearchBox.CheckBox name="서브 카테고리 포함" fieldName="mainCategoryOnly" />
            <SearchBox.Select name="카드 유형" options={this.getTypeSelect()} fieldName="cardType" placeholder="전체" />
          </SearchBox.Group>
          <SearchBox.Group name="Stamp 획득 여부">
            <SearchBox.Select options={SelectType.stampForSearch} fieldName="hasStamp" placeholder="전체" />
            <SearchBox.Select
              name="제공상태"
              options={SelectType.status}
              fieldName="searchCardState"
              placeholder="전체"
            />
            <SearchBox.Select
              name="공개여부"
              options={SelectType.openType}
              fieldName="searchSearchable"
              placeholder="전체"
            />
            <SearchBox.CheckBox
              name="공유된 Card만 보기"
              fieldName="sharedOnly"
              onChange={(e: any, data: any) => this.onChangeSharedOnly(data.checked)}
            />
          </SearchBox.Group>
          <SearchBox.Query
            options={SelectType.searchPartForCard}
            placeholders={['전체', '검색어를 입력하세요.']}
            searchWordDisabledKey="searchPart"
            searchWordDisabledValues={['', '전체']}
          />
          <SearchBox.Group name="사용자 그룹">
            <div className="field">
              <UserGroupSelectModal
                multiple
                onConfirm={this.onSaveAccessRule}
                button="선택"
                title="사용자 그룹 추가"
                description="사용자 그룹을 선택해주세요."
              />
            </div>
            <SearchBox.Input width={6} fieldName="ruleStrings" readOnly placeholder="사용자 그룹을 선택하세요." />
            <SearchBox.FieldButton onClick={this.clearGroupBasedRules}>선택 취소</SearchBox.FieldButton>
          </SearchBox.Group>
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findCards}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{count}</strong> 개 Card 등록 | 공개 <strong>{cardSearchableCount.searchableCount}</strong> 개 |
                비공개 <strong>{cardSearchableCount.unsearchableCount}</strong> 개
              </SubActions.Count>
            </SubActions.Left>
            {/* <SubActions.Right>
              <Button className="button" onClick={() => this.onChangeOpen()}>
                Bulk Upload
              </Button>
              <Pagination.SortFilter options={SelectType.sortFilterForCard} />
              <Pagination.LimitSelect allViewable />
              <SubActions.ExcelButton download useDownloadHistory={false} onClick={this.onClickExcelDown} />
              <SubActions.CreateButton onClick={this.routeToCreated} />
            </SubActions.Right> */}
          </SubActions>

          <Loader loaderText={loaderText && loaderText}>
            <CardListView cards={cards} startNo={startNo} />
          </Loader>

          <Pagination.Navigator />
        </Pagination>

        {/* <PolyglotExcelUploadModal
          open={excelReadModalWin}
          onChangeOpen={this.onChangeOpen}
          fileName={fileName}
          uploadFile={this.uploadFile}
          onReadExcel={this.onReadExcel}
          resourceFileName="Card_Polyglot_Templete.xlsx"
        /> */}
        {/* <PolyglotExcelUploadFailedListModal
          open={invalidModalWin}
          failedList={failedIds}
          onClosed={this.onInvalidModalClose}
        /> */}
      </Container>
    );
  }
}

export default CardListContainer;
