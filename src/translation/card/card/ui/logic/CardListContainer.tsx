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

    this.injected.cardService.changeCardSearchQueryProps('searchPart', '?????????');
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
    const fileName = `Card ??????.${date}.xlsx`;
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
          const defaultLanguage = card['????????????'];
          const cardName = setPolyglotValues(card['Card ??? (??????)'], card['Card ??? (??????)'], card['Card???(??????)']);
          const tags = setPolyglotValues(card['Tag ?????? (??????)'], card['Tag ?????? (??????)'], card['Tag??????(??????)']);
          const simpleDescription = setPolyglotValues(
            card['Card ?????? ?????? (??????)'],
            card['Card ?????? ?????? (??????)'],
            card['Card????????????(??????)']
          );
          const description = setPolyglotValues(
            card['Card ?????? (??????)'],
            card['Card ?????? (??????)'],
            card['Card??????(??????)']
          );
          const reportName = setPolyglotValues(
            card['Report ??? (??????)'],
            card['Report ??? (??????)'],
            card['Report ??? (??????)']
          );
          const reportQuestion = setPolyglotValues(
            card['?????? ????????? (??????)'],
            card['?????? ????????? (??????)'],
            card['?????? ????????? (??????)']
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
        loaderText: `?????? ?????? ???(${loadingCount}/${cardPolyglotUdos.length})`,
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
          <SearchBox.Group name="????????????">
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
              placeholder="??????"
              onChange={(event, data) => this.onChangeCollege(data.value)}
            />
            <SearchBox.Select
              disabled={
                searchBoxQueryModel[channelDisableKey] === '' || searchBoxQueryModel[channelDisableKey] === '??????'
              }
              options={this.selectChannels()}
              fieldName="channelId"
              placeholder="??????"
              sub
            />
            <SearchBox.CheckBox name="?????? ???????????? ??????" fieldName="mainCategoryOnly" />
            <SearchBox.Select name="?????? ??????" options={this.getTypeSelect()} fieldName="cardType" placeholder="??????" />
          </SearchBox.Group>
          <SearchBox.Group name="Stamp ?????? ??????">
            <SearchBox.Select options={SelectType.stampForSearch} fieldName="hasStamp" placeholder="??????" />
            <SearchBox.Select
              name="????????????"
              options={SelectType.status}
              fieldName="searchCardState"
              placeholder="??????"
            />
            <SearchBox.Select
              name="????????????"
              options={SelectType.openType}
              fieldName="searchSearchable"
              placeholder="??????"
            />
            <SearchBox.CheckBox
              name="????????? Card??? ??????"
              fieldName="sharedOnly"
              onChange={(e: any, data: any) => this.onChangeSharedOnly(data.checked)}
            />
          </SearchBox.Group>
          <SearchBox.Query
            options={SelectType.searchPartForCard}
            placeholders={['??????', '???????????? ???????????????.']}
            searchWordDisabledKey="searchPart"
            searchWordDisabledValues={['', '??????']}
          />
          <SearchBox.Group name="????????? ??????">
            <div className="field">
              <UserGroupSelectModal
                multiple
                onConfirm={this.onSaveAccessRule}
                button="??????"
                title="????????? ?????? ??????"
                description="????????? ????????? ??????????????????."
              />
            </div>
            <SearchBox.Input width={6} fieldName="ruleStrings" readOnly placeholder="????????? ????????? ???????????????." />
            <SearchBox.FieldButton onClick={this.clearGroupBasedRules}>?????? ??????</SearchBox.FieldButton>
          </SearchBox.Group>
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findCards}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{count}</strong> ??? Card ?????? | ?????? <strong>{cardSearchableCount.searchableCount}</strong> ??? |
                ????????? <strong>{cardSearchableCount.unsearchableCount}</strong> ???
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
