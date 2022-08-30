import React from 'react';
import { observer } from 'mobx-react';
import { Button, DropdownProps, Grid, Select } from 'semantic-ui-react';
import HistoryTabStore from '../historyTab.store';
import { useFindAutoEncourageQdo } from '../historyTab.hooks';
import AutoEncourageFormModalStore from 'card/autoEncourage/autoEncourageFormModal/autoEncourageFormModal.store';
import { AutoEncourageCopyModal } from 'card/autoEncourage/autoEncourageCopyModal/AutoEncourageCopyModal';
import { useFindCardById } from 'card/list/CardList.hook';
import { isEmpty } from 'lodash';
import { countRound } from 'card/autoEncourage/utiles';
import AutoEncourageStore from 'card/autoEncourage/autoEncourage.store';

const LIMIT_OPTIONS = [
  { key: '1', text: '20개씩 보기', value: 20 },
  { key: '2', text: '50개씩 보기', value: 50 },
  { key: '3', text: '100개씩 보기', value: 100 },
];

export const HistoryTabTableTop = observer(() => {
  const { historyTabState, autoEncourageParams, setLimit, setRound } = HistoryTabStore.instance;
  const { setIsOpenAutoEncourageFormModal, setAutoEncourageFormType } = AutoEncourageFormModalStore.instance;
  const { cardId } = AutoEncourageStore.instance;

  const { limit } = historyTabState;

  const { data: autoEncourage } = useFindAutoEncourageQdo(autoEncourageParams);
  const { data: card } = useFindCardById(cardId);

  const onChangeLimit = (_: React.SyntheticEvent, data: DropdownProps) => {
    setLimit(data.value as number);
  };

  const onChangeRegisterModal = () => {
    setIsOpenAutoEncourageFormModal(true);
    setAutoEncourageFormType('register');
  };

  const onChangeRound = (_: React.SyntheticEvent, data: DropdownProps) => {
    setRound(data.value as number);
  };

  return (
    <Grid className="list-info two column">
      <colgroup>
        <col width="20%" />
        <col width="20%" />
        <col width="80%" />
      </colgroup>
      <Grid.Row>
        <Grid.Column>
          {!isEmpty(card?.cardContents.enrollmentCards) && (
            <Select
              className="ui small-border dropdown m0"
              placeholder="전체"
              value={historyTabState.round}
              options={countRound(card?.cardContents.enrollmentCards)}
              onChange={onChangeRound}
            />
          )}
          <span>{`전체 ${autoEncourage?.totalCount || 0}건`}</span>
        </Grid.Column>
        <Grid.Column>
          <div className="fl-right">
            <Select
              className="ui small-border dropdown m0"
              value={limit}
              defaultValue={limit}
              options={LIMIT_OPTIONS}
              onChange={onChangeLimit}
            />
            <AutoEncourageCopyModal />
            <Button onClick={onChangeRegisterModal}>신규</Button>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});
