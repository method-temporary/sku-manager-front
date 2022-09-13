import * as React from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { Params, SelectType } from 'shared/model';
import { TempSearchBox } from 'shared/components';

import { onChangeCollege } from '../../shared/utiles';
import {
  cardLearningTypeOptions,
  cardOpenType,
  cardSearchPart,
  cardStatus,
  cardTypeOptions,
  cardTypeOptions1,
  stampOptions,
} from '../../shared/model/CardSelectOptions';
import CardListStore from '../CardList.store';
import { getChannelOptions, getCollegeOptions } from '../CardList.util';
import { CardSearchPartType } from '../../card/model/vo/CardSearchPartType';

interface Props {
  //
  onSearch: () => void;
}

const CardSearchBox = observer(({ onSearch }: Props) => {
  //
  const { cineroomId } = useParams<Params>();

  const {
    startDate,
    endDate,
    collegeId,
    channelId,
    mainCategoryOnly,
    studentEnrollmentType,
    cardType,
    hasStamp,
    cardState,
    searchable,
    sharedOnly,
    searchPart,
    searchWord,
    setStartDate,
    setEndDate,
    setCollegeId,
    setChannelId,
    setMainCategoryOnly,
    setStudentEnrollmentType,
    setCardType,
    setHasStamp,
    setCardState,
    setSearchable,
    setSearchPart,
    setSearchWord,
    setUserGroupSequences,
  } = CardListStore.instance;

  const collegeOptions = getCollegeOptions(cineroomId);
  const channelOptions = getChannelOptions();

  const onChangeSharedOnly = (check: boolean) => {
    //
    const { setChannelId, setCollegeId, setSharedOnly } = CardListStore.instance;

    setSharedOnly(check);

    if (check) {
      setChannelId('');
      setCollegeId('');
    }
  };

  const onChangeBasicSearchSelect = (value: CardSearchPartType) => {
    //
    setSearchPart(value);

    if (value === '') {
      //
      setSearchWord('');
    }
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
          // searchButtons
        />
      </TempSearchBox.Group>
      {/* <TempSearchBox.Group name="Category / Channel">
        <TempSearchBox.Select
          value={collegeId}
          options={collegeOptions}
          fieldName="collegeId"
          placeholder="전체"
          onChange={(_e, data) => onChangeCollege(data.value, setCollegeId, setChannelId)}
          disabled={sharedOnly}
        />
        <TempSearchBox.Select
          value={channelId}
          options={channelOptions}
          onChange={(_e, data) => setChannelId(data.value)}
          fieldName="channelId"
          disabled={collegeId === ''}
          sub
        />
        <TempSearchBox.CheckBox
          name="서브 카테고리 포함"
          value={!mainCategoryOnly}
          fieldName="mainCategoryOnly"
          onChange={(_e, data) => setMainCategoryOnly(!data.checked)}
        />
      </TempSearchBox.Group> */}
      <TempSearchBox.Group name="Card형태">
        {/* <TempSearchBox.Select
          options={cardLearningTypeOptions}
          fieldName="studentEnrollmentType"
          value={studentEnrollmentType}
          onChange={(_e, data) => setStudentEnrollmentType(data.value)}
        /> */}
        <TempSearchBox.Select
          options={cardTypeOptions1}
          fieldName="cardType"
          value={cardType}
          onChange={(_e, data) => setCardType(data.value)}
        />
        <TempSearchBox.Select
          name="승인상태"
          value={cardState}
          options={cardStatus}
          fieldName="cardState"
          onChange={(_e, data) => setCardState(data.value)}
        />
      </TempSearchBox.Group>
      {/* <TempSearchBox.Select
          name="Stamp 획득 여부"
          value={hasStamp}
          fieldName="hasStamp"
          options={stampOptions}
          onChange={(_e, data) => setHasStamp(data.value)}
        /> */}

      {/* <TempSearchBox.Group name="승인상태">
        <TempSearchBox.Select
          value={cardState}
          options={cardStatus}
          fieldName="cardState"
          onChange={(_e, data) => setCardState(data.value)}
        /> */}
      {/* <TempSearchBox.Select
          name="공개여부"
          value={searchable}
          options={cardOpenType}
          fieldName="searchSearchable"
          onChange={(_e, data) => setSearchable(data.value)}
        /> */}
      {/* </TempSearchBox.Group> */}
      {/* <TempSearchBox.Group name="공유된 Card만 보기">
        <TempSearchBox.CheckBox
          value={sharedOnly}
          fieldName="sharedOnly"
          onChange={(e, data) => onChangeSharedOnly(data.checked)}
        />
      </TempSearchBox.Group> */}
      <TempSearchBox.BasicSearch
        disabledKey=""
        options={cardSearchPart}
        values={[searchPart, searchWord]}
        onSelectChange={(_e, data) => onChangeBasicSearchSelect(data.value)}
        onChange={(_e, data) => setSearchWord(data.value)}
      />
      {/* <TempSearchBox.UserGroup fieldName="userGroupSequences" onChange={setUserGroupSequences} /> */}
    </TempSearchBox>
  );
});

export default CardSearchBox;
