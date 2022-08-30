import * as React from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { Params } from 'shared/model';
import { TempSearchBox } from 'shared/components';

import CardApprovalListStore from '../CardApprovalList.store';
import { getChannelOptions, getCollegeOptions } from '../../../list/CardList.util';
import { onChangeCollege } from '../../../shared/utiles';
import { cardApprovalStatus, cardSearchPart } from '../../../shared/model/CardSelectOptions';

interface Props {
  //
  onSearch: () => void;
}

const CardApprovalSearchBox = observer(({ onSearch }: Props) => {
  //
  const { cineroomId } = useParams<Params>();

  const {
    startDate,
    endDate,
    collegeId,
    channelId,
    cardState,
    searchPart,
    searchWord,
    setStartDate,
    setEndDate,
    setCollegeId,
    setChannelId,
    setCardState,
    setSearchPart,
    setSearchWord,
  } = CardApprovalListStore.instance;

  const collegeOptions = getCollegeOptions(cineroomId);
  const channelOptions = getChannelOptions();

  return (
    <TempSearchBox onSearch={onSearch} changeProps={() => {}}>
      <TempSearchBox.Group name="등록일자">
        <TempSearchBox.DatePicker
          startFieldName="startDate"
          startDate={startDate}
          endDate={endDate}
          endFieldName="endDate"
          onChangeStartDate={(date) => setStartDate(dayjs(date).valueOf())}
          onChangeEndDate={(date) => setEndDate(dayjs(date).valueOf())}
          searchButtons
        />
      </TempSearchBox.Group>
      <TempSearchBox.Group name="Category / Channel">
        <TempSearchBox.Select
          value={collegeId}
          options={collegeOptions}
          fieldName="collegeId"
          placeholder="전체"
          onChange={(_e, data) => onChangeCollege(data.value, setCollegeId, setChannelId)}
        />
        <TempSearchBox.Select
          value={channelId}
          options={channelOptions}
          onChange={(_e, data) => setChannelId(data.value)}
          fieldName="channelId"
          disabled={collegeId === ''}
          sub
        />
        <TempSearchBox.Select
          name="제공상태"
          value={cardState}
          options={cardApprovalStatus}
          fieldName="cardState"
          onChange={(_e, data) => setCardState(data.value)}
        />
      </TempSearchBox.Group>
      <TempSearchBox.BasicSearch
        disabledKey=""
        options={cardSearchPart}
        values={[searchPart, searchWord]}
        onSelectChange={(_e, data) => setSearchPart(data.value)}
        onChange={(_e, data) => setSearchWord(data.value)}
      />
    </TempSearchBox>
  );
});

export default CardApprovalSearchBox;
