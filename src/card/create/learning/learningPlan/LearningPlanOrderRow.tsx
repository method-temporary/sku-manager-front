import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Table } from 'semantic-ui-react';
import LearningStore from '../Learning.store';

interface Props {
  //
  readonly?: boolean;
}

const LearningPlanOrderRow = observer(({ readonly }: Props) => {
  //
  const { sequentialStudyRequired, setSequentialStudyRequired } = LearningStore.instance;

  const onChangeCheckBox = (value: boolean) => {
    setSequentialStudyRequired(value);
  };

  return (
    <>
      <Table.Row>
        <Table.Cell className="tb-header">Cube 학습 순서 설정</Table.Cell>
        <Table.Cell colSpan={3}>
          <Form.Field
            disabled={readonly}
            control={Checkbox}
            checked={sequentialStudyRequired}
            onChange={(_: any, data: any) => onChangeCheckBox(data.checked)}
            label="등록한 Cube 순서대로 학습할 수 있도록 설정합니다."
          />
        </Table.Cell>
      </Table.Row>
    </>
  );
});

export default LearningPlanOrderRow;
