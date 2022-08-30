import React from 'react';
import { Form, Input, InputOnChangeData, Table } from 'semantic-ui-react';

import { QuestionSelectionType } from '../../model/QuestionSelectionType';
import { TestSelectionResultPopUp } from '../logic/TestSelectionPopUp';

interface TestCreateSelectionResultViewProps {
  finalCopy: boolean;
  questionSelectionType: QuestionSelectionType;
  questionCount: number;
  totalQuestionCount: number;
  successPoint: string;
  totalPoint: number;
  mandatoryCount: number;
  configQuestionCount: string;
  onChangeSuccessPoint: (successPoint: string) => void;
  onChangeQuestionCount: (questionCount: string) => void;
  onBlurQuestionCount: (questionCount: string) => void;
}

export const TestCreateSelectionResultView = ({
  finalCopy,
  questionSelectionType,
  questionCount,
  successPoint,
  totalPoint,
  totalQuestionCount,

  mandatoryCount,
  configQuestionCount,

  onChangeSuccessPoint,
  onChangeQuestionCount,
  onBlurQuestionCount,
}: TestCreateSelectionResultViewProps) => {
  return (
    <>
      <Table.Row>
        <Table.Cell className="tb-header" rowSpan={2}>
          결과 설정
          <TestSelectionResultPopUp questionSelectionType={questionSelectionType} />
        </Table.Cell>
        <Table.Cell textAlign="center" className="tb-header ">
          출제 문항 수
        </Table.Cell>
        <Table.Cell>
          <Table celled className="no-border">
            <colgroup>
              <col width="45%" />
              <col width="10%" />
              <col width="45%" />
            </colgroup>

            <Table.Body>
              <Table.Row>
                <Table.Cell textAlign="center" verticalAlign="middle">
                  {/*모두 출제 */}
                  {questionSelectionType === QuestionSelectionType.ALL && totalQuestionCount}

                  {/* 그룹 셔플 */}
                  {questionSelectionType === QuestionSelectionType.BY_GROUP && questionCount}

                  {/* 선택 셔플 */}
                  {questionSelectionType === QuestionSelectionType.FIXED_COUNT && (
                    <Form.Field
                      readOnly={finalCopy}
                      control={Input}
                      type="number"
                      min={mandatoryCount}
                      max={totalQuestionCount}
                      value={configQuestionCount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) =>
                        onChangeQuestionCount(data.value)
                      }
                      onBlur={() => onBlurQuestionCount(configQuestionCount)}
                    />
                  )}
                </Table.Cell>
                <Table.Cell>/</Table.Cell>
                <Table.Cell>
                  {questionSelectionType === QuestionSelectionType.FIXED_COUNT ? (
                    <>{`${totalQuestionCount} 문항 (필수 ${mandatoryCount} 문항)`}</>
                  ) : (
                    <>{`${totalQuestionCount} 문항`}</>
                  )}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell textAlign="center" className="tb-header only-border-left">
          합격점 / 총점
        </Table.Cell>
        <Table.Cell>
          <Table celled className="no-border">
            <colgroup>
              <col width="45%" />
              <col width="10%" />
              <col width="45%" />
            </colgroup>

            <Table.Body>
              <Table.Row>
                <Table.Cell textAlign="right">
                  <Form.Field
                    readOnly={finalCopy}
                    control={Input}
                    type="number"
                    min={0}
                    max={totalPoint}
                    value={successPoint}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) =>
                      onChangeSuccessPoint(data.value)
                    }
                  />
                </Table.Cell>
                <Table.Cell>/</Table.Cell>
                <Table.Cell>{` ${totalPoint} 점`}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Table.Cell>
      </Table.Row>
    </>
  );
};
