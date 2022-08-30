import * as React from 'react';
import { Form, Radio, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import { EnrollmentCubeType } from '../model/CubeType';

interface props {
  readonly?: boolean;
}

export const CubeTypeRow = observer(({ readonly }: props) => {
  //
  const { type, setType } = EnrollmentCubeStore.instance;

  const onChangeProps = (value: EnrollmentCubeType) => {
    setType(value);
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">
        학습유형 선택<span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        {readonly ? (
          <span>{(type === 'ClassRoomLecture' && 'Classroom') || (type === 'ELearning' && 'E-learning') || '-'}</span>
        ) : (
          <Form.Group>
            <Form.Field
              control={Radio}
              label="E-learning"
              value={'ELearning'}
              checked={type === 'ELearning'}
              onChange={(e: any, data: any) => onChangeProps(data.value)}
            />
            <Form.Field
              control={Radio}
              label="Classroom"
              value={'ClassRoomLecture'}
              checked={type === 'ClassRoomLecture'}
              onChange={(e: any, data: any) => onChangeProps(data.value)}
            />
          </Form.Group>
        )}
      </Table.Cell>
    </Table.Row>
  );
});
