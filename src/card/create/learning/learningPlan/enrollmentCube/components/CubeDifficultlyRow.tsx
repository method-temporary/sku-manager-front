import * as React from 'react';
import { observer } from 'mobx-react';
import { Form, Select, Table } from 'semantic-ui-react';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import { DifficultyLevel } from '../../../../../../_data/cube/model/DifficultyLevel';

interface props {
  readonly?: boolean;
}
export const CubeDifficultlyRow = observer(({ readonly }: props) => {
  //
  const { difficultyLevel, setDifficultyLevel } = EnrollmentCubeStore.instance;

  const onChangeProps = (value: DifficultyLevel) => {
    setDifficultyLevel(value);
  };

  const selectList = [
    { key: 'Basic', value: 'Basic', text: 'Basic' },
    { key: 'Intermediate', value: 'Intermediate', text: 'Intermediate' },
    { key: 'Advanced', value: 'Advanced', text: 'Advanced' },
    { key: 'Expert', value: 'Expert', text: 'Expert' },
  ];

  return (
    <Table.Row>
      <Table.Cell className="tb-header">
        난이도<span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        {readonly ? (
          selectList.find((select) => select.value === difficultyLevel)?.text || '-'
        ) : (
          <Form.Field
            width={4}
            control={Select}
            placeholder="Select"
            options={selectList}
            value={difficultyLevel}
            onChange={(e: any, data: any) => onChangeProps(data.value)}
          />
        )}
      </Table.Cell>
    </Table.Row>
  );
});
