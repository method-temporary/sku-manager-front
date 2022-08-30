import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { DropdownProps, Form, Grid, Select } from 'semantic-ui-react';
import { PaidCourseSearchBoxForm } from '../PaidCourseSearchBox';

const EmployedSelectOptions = [
  { id: '1', text: '전체', value: '' },
  { id: '2', text: '재직자', value: true },
  { id: '3', text: '퇴직자', value: false },
];

export const EmployedSelectBox = () => {
  const { control } = useFormContext<PaidCourseSearchBoxForm>();

  const {
    field: { onChange, value },
  } = useController({
    name: 'employed',
    control,
    defaultValue: undefined,
  });

  const onChangeLearningState = (_: React.SyntheticEvent, data: DropdownProps) => {
    onChange(data.value);
  };

  return (
    <Grid.Column width={8}>
      <Form.Group inline>
        <label>재직자 여부</label>
        <Form.Field
          control={Select}
          options={EmployedSelectOptions}
          placeholder="전체"
          checked={value}
          onChange={onChangeLearningState}
        />
      </Form.Group>
    </Grid.Column>
  );
};
