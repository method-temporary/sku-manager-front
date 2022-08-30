import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import { Dimmer, Loader, Table, Checkbox, Icon, CheckboxProps } from 'semantic-ui-react';
import { parseLearningState } from 'shared/helper/parseLeaningState';
import { AutoEncourageQdo } from '_data/lecture/autoEncourage/model/AutoEncourageQdo';
import { useFindAutoEncourageQdo } from '../historyTab.hooks';
import HistoryTabStore from '../historyTab.store';
import { getItemNo } from 'shared/helper/getItemNo';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import AutoEncourageFormModalStore from 'card/autoEncourage/autoEncourageFormModal/autoEncourageFormModal.store';
import AutoEncourageDetailModalStore from 'card/autoEncourage/autoEncourageDetailModal/autoEncourageDetailModal.store';

export const HistoryTabTable = observer(() => {
  const { autoEncourageParams, historyTabState } = HistoryTabStore.instance;
  const { limit, offset } = historyTabState;

  const { data, isLoading } = useFindAutoEncourageQdo(autoEncourageParams);

  return (
    <Dimmer.Dimmable dimmed={isLoading}>
      <Dimmer active={isLoading} inverted>
        <Loader size="medium">Loading</Loader>
      </Dimmer>
      <Table celled className="selectable">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>선택</Table.HeaderCell>
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>차수</Table.HeaderCell>
            <Table.HeaderCell>제목</Table.HeaderCell>
            <Table.HeaderCell>발송 대상</Table.HeaderCell>
            <Table.HeaderCell>발송 인원</Table.HeaderCell>
            <Table.HeaderCell>발송 일시</Table.HeaderCell>
            <Table.HeaderCell>사용 여부</Table.HeaderCell>
            <Table.HeaderCell>등록자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isEmpty(data?.results) && (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={11}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과를 찾을 수 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
          {data &&
            !isLoading &&
            data.results.map((encourage, index) => (
              <EncourageItem
                encourage={encourage}
                itemNo={getItemNo(data.totalCount, (offset - 1) * limit, index, data.results.length)}
              />
            ))}
        </Table.Body>
      </Table>
    </Dimmer.Dimmable>
  );
});

interface EncourageItemprops {
  encourage: AutoEncourageQdo;
  itemNo: number;
}

const EncourageItem = observer(({ itemNo, encourage }: EncourageItemprops) => {
  const { historyTabState, setSelectedAutoEncourageIds, setAutoEncourageId } = HistoryTabStore.instance;
  const { setIsOpenAutoEncourageFormModal, setAutoEncourageFormType } = AutoEncourageFormModalStore.instance;
  const { setIsOpen, setActiveIndex } = AutoEncourageDetailModalStore.instance;

  const { selectedAutoEncourageIds } = historyTabState;

  const isDisabledChecked = encourage.sentTime ? true : false;
  const parseEncourageUsedToWord = encourage.sentTime ? '사용' : '미사용';
  const convertedSentTime = encourage.sentTime ? dayjs(encourage.sentTime).format('YYYY-MM-DD HH:MM') : '-';
  const round = encourage.round ? encourage.round : '전체';

  const onChangeSelectedAutoEncourageIds = (_: React.SyntheticEvent, data: CheckboxProps) => {
    if (data.checked) {
      setSelectedAutoEncourageIds([...selectedAutoEncourageIds, data.id as string]);
    } else {
      const filteredEncourageIds = selectedAutoEncourageIds.filter(
        (encourageId) => encourageId !== (data.id as string)
      );
      setSelectedAutoEncourageIds(filteredEncourageIds);
    }
  };

  const onOpenModifyModal = () => {
    setIsOpenAutoEncourageFormModal(true);
    setAutoEncourageFormType('modify');
  };

  const onOpenDetailModalHistoryTab = () => {
    setIsOpen(true);
    setActiveIndex(0);
  };

  const onClickEncourageTitle = () => {
    setAutoEncourageId(encourage.id);

    if (isAfterScheduledSendTime()) {
      onOpenDetailModalHistoryTab();
    } else {
      onOpenModifyModal();
    }
  };

  const onOpenDetailModalSendTargetTab = () => {
    setIsOpen(true);
    setActiveIndex(1);
  };

  const isAfterScheduledSendTime = () => {
    if (encourage.scheduledSendTime) {
      return dayjs().isAfter(encourage.scheduledSendTime);
    }

    return false;
  };
  return (
    <Table.Row key={encourage.id}>
      <Table.Cell>
        <Checkbox
          id={encourage.id}
          onChange={onChangeSelectedAutoEncourageIds}
          checked={selectedAutoEncourageIds.includes(encourage.id)}
          disabled={isDisabledChecked}
        />
      </Table.Cell>
      <Table.Cell>{itemNo}</Table.Cell>
      <Table.Cell>{round}</Table.Cell>
      <Table.Cell onClick={onClickEncourageTitle}>{encourage.title}</Table.Cell>
      <Table.Cell onClick={parseEncourageUsedToWord === '사용' ? onOpenDetailModalSendTargetTab : undefined}>
        {parseLearningState(encourage.target.learningState)}
      </Table.Cell>
      <Table.Cell>{`${encourage.targetUsers?.length || 0}명`}</Table.Cell>
      <Table.Cell>{convertedSentTime}</Table.Cell>
      <Table.Cell>{parseEncourageUsedToWord}</Table.Cell>
      <Table.Cell>{encourage.registrantName.ko}</Table.Cell>
    </Table.Row>
  );
});
