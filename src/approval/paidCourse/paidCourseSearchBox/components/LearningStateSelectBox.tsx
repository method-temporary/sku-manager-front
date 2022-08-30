import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { DropdownProps, Form, Grid, Select } from 'semantic-ui-react';
import { PaidCourseSearchBoxForm } from '../PaidCourseSearchBox';

const approvalSearchBoxLearningState = [
  { key: '1', text: '전체', value: '' },
  { key: '2', text: '학습중', value: 'Progress' },
  { key: '3', text: '이수', value: 'Passed' },
  { key: '4', text: '미이수', value: 'Missed' },
  { key: '5', text: '불참', value: 'NoShow' },
  { key: '6', text: '학습예정', value: 'Planned' },
];

export const LearningStateSelectBox = () => {
  const { control } = useFormContext<PaidCourseSearchBoxForm>();

  const {
    field: { onChange, value },
  } = useController({
    name: 'paidCourseLearningState',
    control,
    defaultValue: '',
  });

  const onChangeLearningState = (_: React.SyntheticEvent, data: DropdownProps) => {
    onChange(data.value);
  };

  return (
    <Grid.Column width={8}>
      <Form.Group inline>
        <label>이수여부</label>
        <Form.Field
          control={Select}
          placeholder="전체"
          options={approvalSearchBoxLearningState}
          value={value}
          onChange={onChangeLearningState}
        />
      </Form.Group>
    </Grid.Column>
  );
};
