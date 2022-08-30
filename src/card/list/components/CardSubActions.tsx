import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Button, DropdownProps } from 'semantic-ui-react';
import { useHistory, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import XLSX from 'xlsx';

import { DimmerLoader, SubActions } from 'shared/components';
import { Params, SortFilterState } from 'shared/model';
import { LimitSelect, SortSelect } from 'shared/ui';

import { getInitCardAdminCount } from '_data/lecture/cards/model/CardAdminCount';

import { learningManagementUrl } from '../../../Routes';
import { useUserGroupMap } from '../../../usergroup/group/present/logic/usergroup.util';

import CardListStore from '../CardList.store';
import { useFindCardAdminCount, useFindCardRdoForExcel } from '../CardList.hook';
import { CardExcel, getCardExcelByCardWiths } from '../model/CardExcel';
import TempSearchBoxService from '../../../shared/components/TempSearchBox/logic/TempSearchBoxService';
import CardWithContentsAndRelatedCount from '../../../_data/lecture/cards/model/CardWithContentsAndRelatedCount';

interface Props {
  onChangeOpen: () => void;
  setIsLoading: (isLoading: boolean) => void;
}
const sortFilterForCard = [
  { key: '1', text: '최근 등록 순', value: SortFilterState.TimeDesc },
  { key: '2', text: '오래된 등록 순', value: SortFilterState.TimeAsc },
  { key: '3', text: '학습자 많은 순', value: SortFilterState.StudentCountDesc },
  { key: '4', text: '학습자 적은 순', value: SortFilterState.StudentCountAsc },
  { key: '5', text: '이수자 많은 순', value: SortFilterState.PassedStudentCountDesc },
  { key: '6', text: '이수자 적은 순', value: SortFilterState.PassedStudentCountAsc },
];

const CardSubActions = observer(({ onChangeOpen, setIsLoading }: Props) => {
  //
  const { cineroomId } = useParams<Params>();
  const history = useHistory();

  const {
    limit,
    cardOrderBy,
    cardRdo,
    isLoading,
    setOffset,
    setLimit,
    setCardOrderBy,
    setCardRdo,
    setCardRdoForExcel,
  } = CardListStore.instance;

  const { data } = useFindCardAdminCount(cardRdo);
  const { cardSearchableCount, totalCardCount } = data || getInitCardAdminCount();

  const userGroupMap = useUserGroupMap();
  const mutation = useFindCardRdoForExcel();

  const excelDown = (excelData: CardWithContentsAndRelatedCount[]) => {
    //
    const wbList: CardExcel[] = [];

    excelData &&
      excelData &&
      excelData.forEach(({ card, cardContents, cardRelatedCount }) => {
        wbList.push(getCardExcelByCardWiths(card, cardContents, cardRelatedCount, userGroupMap));
      });
    const cardExcel = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, cardExcel, 'Card');

    const date = dayjs().format('YYYY-MM-DD_HH:mm:ss');
    const fileName = `Card 관리.${date}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });

    setIsLoading(false);
  };

  const routeToCreated = () => {
    //
    history.push(`/cineroom/${cineroomId}/${learningManagementUrl}/cards/card-create`);
  };

  const onChangeLimit = (_e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    //
    setLimit(data.value as number);
    setCardRdo();
  };

  const onChangeSort = (_e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    //
    setOffset(1);
    setCardOrderBy(data.value as SortFilterState);
    setCardRdo();
  };

  const onClickExcelDown = async () => {
    //
    const { isSearch } = TempSearchBoxService.instance;

    setIsLoading(true);

    if (isSearch) {
      const cardRdoForExcel = setCardRdoForExcel();
      const excelData = await mutation.mutateAsync(cardRdoForExcel);
      excelDown(excelData.results);
    } else {
      excelDown(mutation.data?.results || []);
    }
  };

  return (
    <DimmerLoader active={isLoading} page>
      <SubActions>
        <SubActions.Left>
          <SubActions.Count>
            <strong>{totalCardCount}</strong> 개 Card 등록 | 공개 <strong>{cardSearchableCount.searchableCount}</strong>{' '}
            개 | 비공개 <strong>{cardSearchableCount.unsearchableCount}</strong> 개
          </SubActions.Count>
        </SubActions.Left>
        <SubActions.Right>
          <Button className="button" onClick={() => onChangeOpen()}>
            Bulk Upload
          </Button>
          <SortSelect sortFilter={cardOrderBy} onChange={onChangeSort} options={sortFilterForCard} />
          <LimitSelect limit={limit} onChange={onChangeLimit} />
          <SubActions.ExcelButton download useDownloadHistory={false} onClick={onClickExcelDown} />
          <SubActions.CreateButton onClick={routeToCreated} />
        </SubActions.Right>
      </SubActions>
    </DimmerLoader>
  );
});

export default CardSubActions;
