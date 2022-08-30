import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';

import { SharedService, AccessRuleService } from 'shared/present';
import {
  GroupBasedAccessRuleModel,
  SelectType,
  GroupBasedAccessRule,
  SelectTypeModel,
  CardCategory,
} from 'shared/model';

import { Loader, Modal, Pagination, SearchBox, TempSearchBox } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';
import { LoaderService } from 'shared/components/Loader';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { CollegeService } from '../../../../college';
import { getCollegeOptions } from '../../../../college/ui/logic/CollegeHelper';

import { CardService } from '../../index';
import { CardQueryModel, CardWithContents } from '../..';

import CardListModalView from '../view/CardListModalView';
import { displayChannel } from './CardHelper';

interface Props {
  readonly?: boolean;
  groupAccessRoles?: GroupBasedAccessRule;
  selectedCards?: CardWithContents[];
  onClickOk?: () => void;
  searchQuery?: CardQueryModel;
  changeSearchQueryProps?: (name: string, value: any) => void;
  singleSelectedCard?: CardWithContents;
  isSingle?: boolean;
}

interface Injected {
  cardService: CardService;
  sharedService: SharedService;
  accessRuleService: AccessRuleService;
  collegeService: CollegeService;
  searchBoxService: SearchBoxService;
  loaderService: LoaderService;
}

@inject('cardService', 'sharedService', 'accessRuleService', 'collegeService', 'searchBoxService', 'loaderService')
@observer
@reactAutobind
class CardSelectModal extends ReactComponent<Props, {}, Injected> {
  //
  paginationKey = 'cardModal';

  static defaultProps = {
    readonly: false,
    selectedCards: [],
  };

  onMount() {
    //
    if (this.props.selectedCards && this.props.selectedCards.length > 0) {
      this.injected.cardService.setSelectedCards(this.props.selectedCards);
    }

    if (this.props.singleSelectedCard && this.props.isSingle) {
      this.injected.cardService.setSingleSelectedCards(this.props.singleSelectedCard);
    }

    this.findCardsByCardRdo();
  }

  async findCardsByCardRdo(): Promise<void> {
    //
    const { cardService, sharedService, loaderService } = this.injected;

    loaderService.openLoader();

    const pageModel = sharedService.getPageModel(this.paginationKey);
    const query = this.props.searchQuery ? this.props.searchQuery : cardService.modalCardQuery;

    const groupAccessRoles = GroupBasedAccessRuleModel.asGroupBasedAccessRule(
      this.injected.accessRuleService.groupBasedAccessRule
    );

    const totalCount = await cardService.findCardsByRdo(
      CardQueryModel.asCardAdminRdo(query, pageModel),
      groupAccessRoles
    );

    await sharedService.setCount(this.paginationKey, totalCount || 0);

    loaderService.closeLoader();
  }

  onChangeCardQueryProps(name: string, value: any): void {
    //
    const { cardService } = this.injected;
    cardService.changeCardQueryProps(name, value);
  }

  onSelectCard(card: CardWithContents, checked: boolean): void {
    //
    const { cardService } = this.injected;

    if (checked) {
      cardService.addSelectedCards(card);
    } else {
      const copied = [...cardService.selectedCards];
      const filter = copied.filter((sCards) => sCards.card.id !== card.card.id);

      cardService.setSelectedCards(filter);
    }
  }

  onSingleSelectCard(card: CardWithContents): void {
    //
    const { cardService } = this.injected;

    cardService.addSingleSelectedCard(card);
  }

  onClearCardQueryProps(): void {
    //
    const { cardService } = this.injected;
    cardService.clearCardQuery();
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

  displayChannel(categories: CardCategory[]) {
    //
    return displayChannel(categories);
  }

  onChangeSharedOnly(check: boolean) {
    //
    const { searchBoxService } = this.injected;

    searchBoxService.changePropsFn('sharedOnly', check);

    if (check) {
      searchBoxService.changePropsFn('collegeId', '');
      searchBoxService.changePropsFn('channelId', '');
    }
  }

  onSaveCards(): void {
    //
    const { onClickOk, isSingle } = this.props;

    if (onClickOk) {
      onClickOk();
    } else if (!isSingle) {
      const { cardService } = this.injected;
      cardService.setCards([...cardService.selectedCards]);
    }
  }

  onOpenModal() {
    //onSelectCard
    this.props.selectedCards && this.injected.cardService.setSelectedCards(this.props.selectedCards);
  }

  render() {
    //
    const { cardService, collegeService, searchBoxService } = this.injected;
    const { modalCardQuery, selectedCards, cardsWithAccessRule, changeModalCardQueryProps, singleSelectedCard } =
      cardService;
    const { readonly, searchQuery, changeSearchQueryProps, isSingle } = this.props;

    const { collegesMap, channelMap } = collegeService;
    const query = searchQuery || modalCardQuery;
    const changeQueryProps = changeSearchQueryProps || changeModalCardQueryProps;

    const collegesSelect = getCollegeOptions(patronInfo.getCineroomId() || '', collegeService);
    const { searchBoxQueryModel } = searchBoxService;

    const collegeDisableKey = 'sharedOnly';
    const channelDisableKey = 'collegeId';

    return (
      <Modal
        size="large"
        triggerAs="a"
        modSuper={readonly}
        trigger={
          <Button disabled={readonly} onClick={this.onOpenModal}>
            Card 선택
          </Button>
        }
        onMount={this.onMount}
        // onMount={this.findCardsByCardRdo}
      >
        <Modal.Header className="res">불러오기</Modal.Header>
        <Modal.Content className="fit-layout">
          <>
            <SearchBox
              onSearch={this.findCardsByCardRdo}
              changeProps={changeQueryProps}
              queryModel={query}
              name={this.paginationKey}
              modal
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
                />
                {patronInfo.getCineroomId() !== 'ne1-m2-c2' && (
                  <SearchBox.CheckBox
                    name="공유된 Card만 보기"
                    fieldName="sharedOnly"
                    onChange={(e: any, data: any) => this.onChangeSharedOnly(data.checked)}
                  />
                )}
                <SearchBox.Select
                  placeholder="전체"
                  name="공개여부"
                  options={SelectType.disclosureStatus}
                  fieldName="searchSearchable"
                />
              </SearchBox.Group>

              <SearchBox.Query
                options={SelectType.searchPartForCard}
                placeholders={['전체', '검색어를 입력하세요.']}
                searchWordDisabledKey="searchPart"
                searchWordDisabledValues={['', '전체']}
              />
            </SearchBox>

            <Pagination name={this.paginationKey} onChange={this.findCardsByCardRdo}>
              <Loader>
                <CardListModalView
                  onSelectCard={this.onSelectCard}
                  cards={cardsWithAccessRule}
                  selectedCards={selectedCards}
                  collegesMap={collegesMap}
                  channelMap={channelMap}
                  isSingle={isSingle}
                  singleSelectedCard={singleSelectedCard}
                  onSingleSelectCard={this.onSingleSelectCard}
                />
              </Loader>

              <Pagination.Navigator />
            </Pagination>
          </>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton className="w190 d">CANCEL</Modal.CloseButton>
          <Modal.CloseButton className="w190 p" onClick={this.onSaveCards}>
            OK
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CardSelectModal;
