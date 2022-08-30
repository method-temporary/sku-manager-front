import React from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { TempSearchBox } from 'shared/components';
import { getChannelOptions, getCollegeOptions } from '../../../../list/CardList.util';

import { onChangeCollege } from '../../../utiles';
import { cardSearchPart } from '../../../model/CardSelectOptions';
import CardSelectModalStore from '../CardSelectModal.store';
import { CardSearchPartType } from '../../../../card/model/vo/CardSearchPartType';

interface Params {
  cineroomId: string;
}

const CardSelectModalSearchBox = observer(() => {
  //
  const { cineroomId } = useParams<Params>();

  const {
    startDate,
    endDate,
    collegeId,
    channelId,
    searchPart,
    searchWord,
    setStartDate,
    setEndDate,
    setCollegeId,
    setChannelId,
    setSearchPart,
    setSearchWord,
    setOffset,
    setCardRdo,
  } = CardSelectModalStore.instance;

  const collegeOptions = getCollegeOptions(cineroomId);
  const channelOptions = getChannelOptions();

  const onSearch = () => {
    //
    setOffset(1);
    setCardRdo();
  };

  const onChangeSearchPart = (searchPart: CardSearchPartType) => {
    //
    if (searchPart === '') setSearchWord('');
    setSearchPart(searchPart);
  };

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
          isModal
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
      </TempSearchBox.Group>

      <TempSearchBox.BasicSearch
        disabledKey=""
        options={cardSearchPart}
        values={[searchPart, searchWord]}
        onSelectChange={(_e, data) => onChangeSearchPart(data.value)}
        onChange={(_e, data) => setSearchWord(data.value)}
      />
    </TempSearchBox>
  );
});

export default CardSelectModalSearchBox;
