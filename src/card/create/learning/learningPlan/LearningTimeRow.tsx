import { observer } from 'mobx-react';
import { Form, Input, Table } from 'semantic-ui-react';
import React from 'react';
import LearningStore from '../Learning.store';

interface props {
  readonly?: boolean;
}

export const LearningTimeRow = observer(({ readonly }: props) => {
  //
  const { totalLearningTime, additionalLearningTime, setAdditionalLearningTime } = LearningStore.instance;

  const getTotalLearningTimeText = () => {
    const hour = totalLearningTime >= 60 && Math.floor(totalLearningTime / 60);
    const minutes = totalLearningTime % 60;

    let resultText = (hour > 0 && `${hour}h `) || '';
    resultText += `${minutes}m`;

    return resultText;
  };

  const getAdditionLearningTimeText = () => {
    const hour = additionalLearningTime >= 60 && Math.floor(additionalLearningTime / 60);
    const minutes = additionalLearningTime % 60;

    let resultText = (hour > 0 && `${hour}h `) || '';
    resultText += `${minutes}m`;

    return resultText;
  };

  const onChangeAdditionLearningTime = (value: string) => {
    //
    let val = value;
    if (val === '') {
      val = '0';
    } else if (value.startsWith('0') && value !== '0') {
      val = value.substr(1);
    }

    setAdditionalLearningTime(parseInt(val, 10));
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">총 학습 시간</Table.Cell>
      <Table.Cell>
        <span>{getTotalLearningTimeText()}</span>
        <span className="span-information">{` + ${getAdditionLearningTimeText()}`}</span>
      </Table.Cell>
      <Table.Cell className="tb-header">추가 학습 시간</Table.Cell>
      <Table.Cell>
        {!readonly ? (
          <Form.Group>
            <Form.Field
              width={3}
              control={Input}
              type="number"
              min={0}
              value={additionalLearningTime}
              onChange={(e: any, data: any) => onChangeAdditionLearningTime(data.value)}
            />
            <span className="label">분</span>
          </Form.Group>
        ) : (
          <>{`${additionalLearningTime} 분`}</>
        )}
      </Table.Cell>
    </Table.Row>
  );
});
