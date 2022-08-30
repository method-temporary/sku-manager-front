import React from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { Form, Table } from 'semantic-ui-react';
import { AutoEncourageForm } from '../AutoEncourageFormModal';

export function EncourageIsUsedRadio() {
  const { control } = useFormContext<AutoEncourageForm>();
  const {
    field: { onChange, value },
  } = useController({
    name: 'encourageIsUse',
    control,
    defaultValue: true,
  });

  const onChangeEnourageUsed = () => {
    onChange(true);
  };

  const onChangeEncourageNotUsed = () => {
    onChange(false);
  };

  return (
    <Table.Row>
      <Table.Cell width={2}>
        사용여부
        <span className="required">*</span>
      </Table.Cell>
      <Table.Cell width={6}>
        <Form.Group>
          <Form.Radio label="사용" checked={value} onChange={onChangeEnourageUsed} style={{ marginRight: '10px' }} />
          <Form.Radio label="미사용" checked={!value} onChange={onChangeEncourageNotUsed} />
        </Form.Group>
      </Table.Cell>
    </Table.Row>
  );
}
