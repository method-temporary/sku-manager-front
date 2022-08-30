import React, { useCallback } from 'react';
import { Checkbox, CheckboxProps, Pagination, PaginationProps, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import AutoEncourageCopyModalStore from '../autoEncourageCopyModal.store';
import { useFindAutoEncourage } from '../AutoEncourageCopyModal.hook';
import { ceil, find, includes, isEmpty } from 'lodash';
import dayjs from 'dayjs';

export const CopyModalTable = observer(() => {
  const { selectedCardIds, offset, autoEncourageCardParams, setSelectedCardIds, setOffset } =
    AutoEncourageCopyModalStore.instance;

  const { data: autoEncourageCards } = useFindAutoEncourage(autoEncourageCardParams);

  const onSelectedAllCard = useCallback(
    (_: React.SyntheticEvent, data: CheckboxProps) => {
      const currentPageCardIds = autoEncourageCards?.results.map((card) => card.cardId) || [];
      const checked = data.checked || false;

      if (checked) {
        const AllCardIds = new Set([...selectedCardIds, ...currentPageCardIds]);
        setSelectedCardIds([...Array.from(AllCardIds)]);
      } else {
        const filteredAllCardIds = selectedCardIds.filter((cardId) => !includes(currentPageCardIds, cardId));
        setSelectedCardIds(filteredAllCardIds);
      }
    },
    [autoEncourageCards]
  );

  const onSelectedCard = (_: React.SyntheticEvent, data: CheckboxProps) => {
    if (data.checked) {
      setSelectedCardIds([...selectedCardIds, data.id as string]);
    } else {
      const filteredCardIds = selectedCardIds.filter((cardId) => cardId !== data.id);
      setSelectedCardIds(filteredCardIds);
    }
  };

  const onChangeOffset = (_: React.MouseEvent, data: PaginationProps) => {
    setOffset(data.activePage as number);
  };

  const isAllChecked = () => {
    const allCardIds = autoEncourageCards?.results.map((card) => card.cardId);

    if (isEmpty(selectedCardIds.slice())) {
      return false;
    }

    if (selectedCardIds.slice().some((cardIds) => !find(allCardIds, cardIds))) {
      return false;
    }

    return true;
  };

  const totalPageCount = ceil((autoEncourageCards?.totalCount || 0) / 10);

  return (
    <div className="table_card">
      <Table>
        <colgroup>
          <col width="60px" />
          <col width="600px" />
          <col width="120px" />
          <col width="160px" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Checkbox onChange={onSelectedAllCard} checked={isAllChecked()} />
              <span className="hidden">선택여부</span>
            </Table.HeaderCell>
            <Table.HeaderCell style={{ textAlign: 'center' }}>과정명</Table.HeaderCell>
            <Table.HeaderCell>생성자</Table.HeaderCell>
            <Table.HeaderCell>등록일자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {autoEncourageCards?.results.map((card) => (
            <Table.Row key={card.cardId}>
              <Table.Cell>
                <Checkbox
                  className="base"
                  id={card.cardId}
                  onChange={onSelectedCard}
                  checked={selectedCardIds.includes(card.cardId)}
                />
              </Table.Cell>
              <Table.Cell>{card.name.ko}</Table.Cell>
              <Table.Cell>{card.registrantName.ko}</Table.Cell>
              <Table.Cell>{dayjs(card.registeredTime).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="lms-paging-holder" style={{ textAlign: 'center' }}>
        <Pagination activePage={offset} totalPages={totalPageCount} onPageChange={onChangeOffset} />
      </div>
    </div>
  );
});
