import React from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { Form, Table } from 'semantic-ui-react';
import { SelectType } from 'shared/model';
import HtmlEditor from 'shared/ui/view/HtmlEditor';
import { AutoEncourageForm } from '../AutoEncourageFormModal';

export function EncourageEmailForm() {
  const { watch, control } = useFormContext<AutoEncourageForm>();

  const sendMediaUseEmail = watch('sendMediaUseEmail');

  const { field: title } = useController({
    name: 'emailFormat.title',
    control,
    rules: {
      required: sendMediaUseEmail && '이메일의 제목을 입력해주세요',
    },
  });

  const { field: mailContents } = useController({
    name: 'emailFormat.mailContents',
    control,
    rules: {
      required: sendMediaUseEmail && '이메일의 내용을 입력해주세요',
    },
  });

  return (
    <Table.Row>
      <Table.Cell>E-mail</Table.Cell>
      <Table.Cell>
        <Table>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                제목
                <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <Form.Input {...title} placeholder="메일 제목을 입력해주세요." disabled={!sendMediaUseEmail} />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>내용</Table.Cell>
              <Table.Cell>
                <HtmlEditor
                  modules={SelectType.modules}
                  formats={SelectType.formats}
                  value={mailContents.value || ''}
                  readOnly={!sendMediaUseEmail}
                  onChange={mailContents.onChange}
                />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Table.Cell>
    </Table.Row>
  );
}
