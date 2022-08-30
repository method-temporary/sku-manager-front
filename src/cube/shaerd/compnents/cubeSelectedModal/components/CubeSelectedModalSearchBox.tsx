import React from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { TempSearchBox } from 'shared/components';

import { onChangeCollege } from 'card/shared/utiles';
import { getChannelOptions, getCollegeOptions } from 'card/list/CardList.util';

import { CubeSearchPartType } from '../../../model/CubeSearchPartType';
import { cubeSearchPart, cubeTypeOptions } from '../../../model/CubeSelectOptions';

import CubeSelectedModalStore from '../CubeSelectedModal.store';
import { getContentsProviderOptions } from '../CubeSelectedModal.util';

interface Params {
  //
  cineroomId: string;
}

const CubeSelectedModalSearchBox = observer(() => {
  //
  const { cineroomId } = useParams<Params>();

  const {
    startDate,
    endDate,
    collegeId,
    channelId,
    cubeType,
    organizerId,
    sharedOnly,
    searchPart,
    searchWord,
    setStartDate,
    setEndDate,
    setCollegeId,
    setChannelId,
    setCubeType,
    setOrganizerId,
    setSharedOnly,
    setSearchPart,
    setSearchWord,
    setOffset,
    setCubeAdminRdo,
  } = CubeSelectedModalStore.instance;

  const collegeOptions = getCollegeOptions(cineroomId);
  const channelOptions = getChannelOptions();

  const onSearch = () => {
    //
    setOffset(1);
    setCubeAdminRdo();
  };

  const onChangeBasicSearchSelect = (value: CubeSearchPartType) => {
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

      <TempSearchBox.Group>
        <TempSearchBox.Select
          name="교육형태"
          fieldName="cubeType"
          value={cubeType}
          options={cubeTypeOptions}
          placeholder="전체"
          onChange={(_, data) => setCubeType(data.value)}
        />
        <TempSearchBox.Select
          name="교육기관"
          fieldName="organizerId"
          value={organizerId}
          options={getContentsProviderOptions()}
          placeholder="전체"
          onChange={(_, data) => setOrganizerId(data.value)}
        />
      </TempSearchBox.Group>
      <TempSearchBox.Group name="공유된 Cube만 보기">
        <TempSearchBox.CheckBox
          fieldName="sharedOnly"
          value={sharedOnly}
          onChange={(_, data) => setSharedOnly(data.checked)}
        />
      </TempSearchBox.Group>

      <TempSearchBox.BasicSearch
        disabledKey=""
        options={cubeSearchPart}
        values={[searchPart, searchWord]}
        onSelectChange={(_e, data) => onChangeBasicSearchSelect(data.value)}
        onChange={(_e, data) => setSearchWord(data.value)}
      />
    </TempSearchBox>
  );
});

export default CubeSelectedModalSearchBox;
