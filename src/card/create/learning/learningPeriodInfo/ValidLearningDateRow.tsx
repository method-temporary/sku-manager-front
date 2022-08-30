import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Input } from 'semantic-ui-react';
import { FormTable } from '../../../../shared/components';
import LearningStore from '../Learning.store';

interface props {
  readonly?: boolean;
}

export const ValidLearningDateRow = observer(({ readonly }: props) => {
  //
  const { validLearningDateCheck, validLearningDate, setValidLearningDateCheck, setValidLearningDate } =
    LearningStore.instance;

  const onChangeValidLearningDateCheck = (checked: boolean) => {
    //
    setValidLearningDate(checked ? 1 : 0);
    setValidLearningDateCheck(checked);
  };

  return (
    <FormTable.Row name="참여 기간 설정">
      {!readonly ? (
        <Form.Group>
          <Form.Field
            control={Checkbox}
            label="기간설정"
            checked={validLearningDateCheck}
            onChange={(_: any, data: any) => onChangeValidLearningDateCheck(data.checked)}
          />
          <Form.Field
            control={Input}
            disabled={!validLearningDateCheck}
            type="number"
            min={1}
            value={validLearningDate}
            onChange={(_: any, data: any) => setValidLearningDate(data.value)}
          />
          <span className="label">일</span>
        </Form.Group>
      ) : (
        <>{validLearningDateCheck ? `${validLearningDate} 일` : '-'}</>
      )}
      <div className="margin-top-6px">
        <span className="span-information ">
          * 참여 기간 설정 시, 학습 시작일로부터 설정된 일정 내에만 학습에 참여할 수 있습니다.
        </span>
      </div>
    </FormTable.Row>
  );
});
