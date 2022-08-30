import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { cardListUrl } from 'card/autoEncourage/utiles';
import { Button, Grid, Pagination, PaginationProps } from 'semantic-ui-react';
import { useFindAutoEncourageQdo, useDeleteAutoEncourageIds } from '../historyTab.hooks';
import { isEmpty } from 'lodash';
import { reactAlert, reactConfirm } from '@nara.platform/accent';
import HistoryTabStore from '../historyTab.store';

export const HistoryTableBottom = observer(() => {
  const history = useHistory();
  const deleteMutation = useDeleteAutoEncourageIds().mutate;
  const { historyTabState, autoEncourageParams, setOffset } = HistoryTabStore.instance;

  const { limit, offset, selectedAutoEncourageIds } = historyTabState;
  const { data } = useFindAutoEncourageQdo(autoEncourageParams);

  const totalPages = () => {
    if (data === undefined) {
      return 0;
    }

    return Math.ceil(data.totalCount / limit);
  };

  const onChangeOffset = (_: React.MouseEvent, data: PaginationProps) => {
    setOffset(data.activePage as number);
  };

  const onClickMoveToCardList = () => {
    history.push(cardListUrl());
  };

  const onClickDelete = () => {
    if (isEmpty(selectedAutoEncourageIds)) {
      reactAlert({
        title: '삭제 안내',
        message: '삭제할 내역을 선택해 주세요',
      });
      return;
    }

    reactConfirm({
      title: '삭제 안내',
      message: '예약된 내역을 삭제하시겠습니까? <br/> 삭제할 경우 발송되지 않습니다.',
      onOk: async () => deleteMutation(selectedAutoEncourageIds),
    });
  };

  return (
    <Grid columns={3} className="list-info">
      <Grid.Row>
        <Grid.Column style={{ paddingLeft: '0px', width: '20%' }}>
          <Button onClick={onClickDelete}>삭제</Button>
        </Grid.Column>
        <Grid.Column style={{ width: '60%' }}>
          <div className="center">
            <Pagination activePage={offset} totalPages={totalPages()} onPageChange={onChangeOffset} />
          </div>
        </Grid.Column>
        <Grid.Column style={{ width: '20%' }}>
          <div className="fl-right">
            <Button onClick={onClickMoveToCardList}>목록</Button>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});
