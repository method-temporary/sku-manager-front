import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { DropdownProps, Form, Grid, Select } from 'semantic-ui-react';
import { PaidCourseProposalState } from '_data/lecture/students/model/PaidCourseProposalState';
import { PaidCourseSearchBoxForm } from '../PaidCourseSearchBox';

const selectProposalState: { key: string; value: PaidCourseProposalState; text: string }[] = [
  { key: '0', value: '', text: '전체' },
  { key: '1', value: 'Submitted', text: '승인요청' },
  { key: '2', value: 'Rejected', text: '반려' },
  { key: '3', value: 'Approved', text: '승인' },
  { key: '4', value: 'Canceled', text: '취소' },
];

export const ProposalStateSelectBox = () => {
  const { control } = useFormContext<PaidCourseSearchBoxForm>();

  const {
    field: { onChange, value },
  } = useController({
    name: 'proposalState',
    control,
    defaultValue: '',
  });

  const onChangeProposalState = (_: React.SyntheticEvent, data: DropdownProps) => {
    const value = data.value === '' ? undefined : data.value;
    onChange(value);
  };

  return (
    <Grid.Column width={8}>
      <Form.Group inline>
        <label>신청현황</label>
        <Form.Field
          control={Select}
          placeholder="전체"
          options={selectProposalState}
          value={value}
          onChange={onChangeProposalState}
        />
      </Form.Group>
    </Grid.Column>
  );
};
