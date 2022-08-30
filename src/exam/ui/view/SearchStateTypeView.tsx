import React from 'react';
import { DropdownProps, Form, Grid, Select } from 'semantic-ui-react';

interface SearchStateTypeViewProps {
  searchState: string;
  searchType: string;
  onChangeState: (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  onChangeType: (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

export function SearchStateTypeView({
  searchState,
  searchType,
  onChangeState,
  onChangeType,
}: SearchStateTypeViewProps) {
  return (
    <Grid.Column width={16}>
      <Form.Group inline>
        <label>상태</label>
        <Form.Field>
          <Select
            placeholder="전체"
            defaultValue={searchState || stateSelectOptions[0].value}
            options={stateSelectOptions}
            onChange={onChangeState}
          />
        </Form.Field>
        <label>출제 방식</label>
        <Form.Field>
          <Select
            placeholder="전체"
            defaultValue={searchType || typeSelectOptions[0].value}
            options={typeSelectOptions}
            onChange={onChangeType}
          />
        </Form.Field>
      </Form.Group>
    </Grid.Column>
  );
}

const stateSelectOptions = [
  { key: '0', value: '', text: '전체' },
  { key: '1', value: 'finalVersion', text: '최종본' },
  { key: '2', value: 'editableVersion', text: '수정가능본' },
];

const typeSelectOptions = [
  { key: '0', value: '', text: '전체' },
  { key: '1', value: 'BY_GROUP', text: '그룹 셔플' },
  { key: '2', value: 'FIXED_COUNT', text: '선택 셔플' },
  { key: '3', value: 'ALL', text: '모두 출제' },
];
