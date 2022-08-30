import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { DropdownProps, Form, Grid, Input, InputOnChangeData, Select } from 'semantic-ui-react';
import { PaidCourseSearchBoxForm } from '../PaidCourseSearchBox';

const searchTypeOption = [
  { key: '0', text: '전체', value: '' },
  { key: '1', text: '신청자', value: 'studentName' },
  { key: '2', text: '조직', value: 'departmentName' },
  { key: '3', text: '과정명', value: 'cardName' },
  { key: '4', text: 'email', value: 'email' },
];

export const PaidCourseSearchInput = () => {
  const { control } = useFormContext<PaidCourseSearchBoxForm>();

  const { field: searchType } = useController({
    name: 'searchType',
    control,
    defaultValue: '',
  });

  const { field: searchWord } = useController({
    name: 'searchWord',
    control,
    defaultValue: '',
  });

  const onChangeSearchType = (_: React.SyntheticEvent, data: DropdownProps) => {
    searchType.onChange(data.value);
  };

  const onChangeSearchWord = (_: React.ChangeEvent, data: InputOnChangeData) => {
    searchWord.onChange(data.value);
  };

  return (
    <Grid.Column width={16}>
      <Form.Group inline>
        <label>검색어</label>
        <Form.Field
          control={Select}
          placeholder="전체"
          options={searchTypeOption}
          value={searchType.value}
          onChange={onChangeSearchType}
        />
        <Form.Field
          control={Input}
          width={10}
          placeholder="검색어를 입력해주세요."
          value={searchWord.value}
          disabled={searchType.value === ''}
          onChange={onChangeSearchWord}
        />
      </Form.Group>
    </Grid.Column>
  );
};
