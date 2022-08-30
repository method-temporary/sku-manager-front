import React from 'react';
import { Table, Form } from 'semantic-ui-react';
import { useFormContext, useController } from 'react-hook-form';
import { AutoEncourageForm } from '../AutoEncourageFormModal';

export function EncourageTitleInput() {
  const { control } = useFormContext<AutoEncourageForm>();

  const {
    field: { onChange, value },
  } = useController({
    name: 'encourageTitle',
    control,
    rules: {
      required: '독려 제목을 입력해 주세요',
    },
  });

  return (
    <Table.Row>
      <Table.Cell width={2}>
        독려 제목
        <span className="required">*</span>
      </Table.Cell>
      <Table.Cell width={8}>
        <Form.Input placeholder="제목을 입력해주세요." value={value} onChange={onChange} />
      </Table.Cell>
    </Table.Row>
  );
}
