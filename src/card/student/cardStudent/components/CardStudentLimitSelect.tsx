import React from 'react';
import { observer } from 'mobx-react';
import { DropdownProps, Select } from 'semantic-ui-react';
import CardStudentStore from '../CardStudent.store';

const LIMIT_OPTIONS = [
  { key: '1', text: '20개씩 보기', value: 20 },
  { key: '2', text: '50개씩 보기', value: 50 },
  { key: '3', text: '100개씩 보기', value: 100 },
];

export const CardStudentLimitSelect = observer(() => {
  //
  const { cardStudentParams, setLimit, setParams, setOffset } = CardStudentStore.instance;

  const onChangeLimit = (_: React.SyntheticEvent, data: DropdownProps): void => {
    setLimit(data.value as number);
    setOffset(1);
    setParams();
  };

  return (
    <Select
      className="ui small-border dropdown m0"
      options={LIMIT_OPTIONS}
      value={cardStudentParams.limit}
      onChange={onChangeLimit}
    />
  );
});
