import React from 'react';
import { Form, Table } from 'semantic-ui-react';

import { Question } from '../../viewmodel/TestSheetViewModel';
import { QuestionSelectionType } from '../../model/QuestionSelectionType';
import { QuestionSelectionConfig } from '../../viewmodel/TestCreateFormViewModel';

import { TestSelectionQuestionPopUp } from '../logic/TestSelectionPopUp';

import {
  TestCreateSelectionAllView,
  TestCreateSelectionByGroupView,
  TestCreateSelectionFixedCountView,
} from './TestCreateSelectionsView';
import { TestCreateSelectionResultView } from './TestCreateSelectionResultView';
import {
  onBlurGroupQuestionCount,
  onBlurQuestionCount,
  onChangeGroupPointPerQuestion,
  onChangeGroupQuestionCount,
} from '../../handler/TestCreateSelectOptionsHandler';

interface TestCreateSelectOptionsViewProps {
  finalCopy: boolean;
  questionSelectionType: QuestionSelectionType;
  questionSelectionConfig: QuestionSelectionConfig;
  successPoint: string;
  totalPoint: number;
  questionCount: number;
  totalQuestionCount: number;
  mandatoryCount: number;
  onChangeEnableShuffle: (checked: boolean) => void;
  onChangeSuccessPoint: (successPoint: string) => void;
  onChangePointPerQuestion: (pointPerQuestion: string) => void;
  onChangeQuestionCount: (questionCount: string) => void;
}

export function TestCreateSelectOptionsView({
  finalCopy,
  questionSelectionType,
  questionSelectionConfig,
  successPoint,
  totalPoint,
  questionCount,
  totalQuestionCount,
  mandatoryCount,
  onChangeEnableShuffle,
  onChangeSuccessPoint,
  onChangePointPerQuestion,
  onChangeQuestionCount,
}: TestCreateSelectOptionsViewProps) {
  return (
    <>
      <Form>
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="20%" />
            <col width="60%" />
          </colgroup>

          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell className="title-header" colSpan={3}>
                출제 방식 상세 설정
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header">
                문항 설정
                <TestSelectionQuestionPopUp questionSelectionType={questionSelectionType} />
              </Table.Cell>

              {questionSelectionType === QuestionSelectionType.ALL && (
                <TestCreateSelectionAllView
                  finalCopy={finalCopy}
                  enableShuffle={questionSelectionConfig.enableShuffle}
                  onChange={onChangeEnableShuffle}
                />
              )}

              {questionSelectionType === QuestionSelectionType.BY_GROUP && (
                <TestCreateSelectionByGroupView
                  finalCopy={finalCopy}
                  questionGroup={questionSelectionConfig.questionGroups}
                  totalCount={totalQuestionCount}
                  onChangeGroupPointPerQuestion={onChangeGroupPointPerQuestion}
                  onChangeGroupQuestionCount={onChangeGroupQuestionCount}
                  onBlurGroupQuestionCount={onBlurGroupQuestionCount}
                />
              )}

              {questionSelectionType === QuestionSelectionType.FIXED_COUNT && (
                <TestCreateSelectionFixedCountView
                  finalCopy={finalCopy}
                  pointPerQuestion={questionSelectionConfig.pointPerQuestion}
                  onChangePointPerQuestion={onChangePointPerQuestion}
                />
              )}
            </Table.Row>

            <TestCreateSelectionResultView
              finalCopy={finalCopy}
              questionSelectionType={questionSelectionType}
              questionCount={questionCount}
              totalQuestionCount={totalQuestionCount}
              successPoint={successPoint}
              totalPoint={totalPoint}
              configQuestionCount={questionSelectionConfig.questionCount}
              mandatoryCount={mandatoryCount}
              onChangeSuccessPoint={onChangeSuccessPoint}
              onChangeQuestionCount={onChangeQuestionCount}
              onBlurQuestionCount={onBlurQuestionCount}
            />
          </Table.Body>
        </Table>
      </Form>
    </>
  );
}
