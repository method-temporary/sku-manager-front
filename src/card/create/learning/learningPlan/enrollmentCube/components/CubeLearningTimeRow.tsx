import * as React from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Table } from 'semantic-ui-react';
import EnrollmentCubeStore from '../EnrollmentCube.store';

interface props {
  readonly?: boolean;
}
export const CubeLearningTimeRow = observer(({ readonly }: props) => {
  //
  const { learningTime, setLearningTime } = EnrollmentCubeStore.instance;

  const onChangeHour = (value: number) => {
    const newTime = value * 60 + getMinutes();

    setLearningTime(newTime);
  };

  const onChangeMinutes = (value: number) => {
    const newTime = getHour() * 60 + value;
    setLearningTime(newTime);
  };

  const getHour = () => {
    return (learningTime >= 60 && Math.floor(learningTime / 60)) || 0;
  };

  const getMinutes = () => {
    return (learningTime > 0 && learningTime % 60) || 0;
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">
        교육시간
        {/*<span className="required">*</span>*/}
      </Table.Cell>
      <Table.Cell>
        {readonly ? (
          `${(getHour() > 0 && String(getHour()) + '시간 ') || ''}${getMinutes()}분`
        ) : (
          <Form.Group>
            <Form.Field
              control={Input}
              placeholder="Select"
              width={3}
              type="number"
              value={getHour()}
              onChange={(e: any, data: any) => onChangeHour(Number(data.value || 0))}
            />
            <Form.Field>시간</Form.Field>
            <Form.Field
              control={Input}
              placeholder="Select"
              width={3}
              type="number"
              value={getMinutes()}
              onChange={(e: any, data: any) => onChangeMinutes(Number(data.value || 0))}
            />
            <Form.Field>분</Form.Field>
          </Form.Group>
        )}
      </Table.Cell>
    </Table.Row>
  );
});
