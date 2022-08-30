import React from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { CheckboxProps, Form, Table } from 'semantic-ui-react';
import { AutoEncourageForm } from '../AutoEncourageFormModal';

export function EncourageSendMediaCheckBox() {
  const { control } = useFormContext<AutoEncourageForm>();

  const { field: sendMediaUseEmail } = useController({
    name: 'sendMediaUseEmail',
    control,
    rules: {
      validate: (isSendUseEmail) => {
        if (!isSendUseEmail && !sendMediaUseSMS.value) {
          return '발송 매체를 선택해주세요';
        }
      },
    },
  });
  const { field: sendMediaUseSMS } = useController({
    name: 'sendMediaUseSMS',
    control,
    rules: {
      validate: (isSendUseSMS) => {
        if (!isSendUseSMS && !sendMediaUseEmail.value) {
          return '발송 매체를 선택해주세요';
        }
      },
    },
  });

  const onChangeUseEmail = (_: React.FormEvent, data: CheckboxProps) => {
    sendMediaUseEmail.onChange(data.checked as boolean);
  };

  const onChangeUseSMS = (_: React.FormEvent, data: CheckboxProps) => {
    sendMediaUseSMS.onChange(data.checked as boolean);
  };

  return (
    <Table.Row>
      <Table.Cell>
        발송 매체
        <span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        <Form.Group>
          <Form.Checkbox label="E-mail" checked={sendMediaUseEmail.value} onChange={onChangeUseEmail} />
          <Form.Checkbox label="SMS" checked={sendMediaUseSMS.value} onChange={onChangeUseSMS} />
        </Form.Group>
      </Table.Cell>
    </Table.Row>
  );
}
