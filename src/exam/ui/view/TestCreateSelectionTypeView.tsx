import React from 'react';
import { FormTable, RadioGroup } from 'shared/components';
import { QuestionSelectionType } from '../../model/QuestionSelectionType';
import { Form } from 'semantic-ui-react';

interface TestCreateSelectionTypeViewProps {
  finalCopy: boolean;
  questionSelectionType: QuestionSelectionType;
  onChangeQuestionSelectionType: (value: string | number | undefined) => void;
}

export const TestCreateSelectionTypeView = ({
  finalCopy,
  questionSelectionType,
  onChangeQuestionSelectionType,
}: TestCreateSelectionTypeViewProps) => {
  return (
    <>
      <Form>
        <FormTable title="출제 방식 설정">
          <FormTable.Row name="출제 방식">
            <Form.Group>
              <RadioGroup
                readOnly={finalCopy}
                values={[QuestionSelectionType.BY_GROUP, QuestionSelectionType.FIXED_COUNT, QuestionSelectionType.ALL]}
                labels={['그룹 셔플', '선택 셔플', '모두 출제']}
                value={questionSelectionType}
                onChange={(e, data) => onChangeQuestionSelectionType(data.value)}
              />
            </Form.Group>
          </FormTable.Row>
        </FormTable>
      </Form>
    </>
  );
};
