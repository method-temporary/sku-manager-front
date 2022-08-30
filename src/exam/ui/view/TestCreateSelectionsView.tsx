import React from 'react';
import { Checkbox, Form, Input, InputOnChangeData, Popup, Table } from 'semantic-ui-react';
import { QuestionGroup } from '../../viewmodel/TestCreateFormViewModel';
import { TestQuestionGroupModalContainer } from '../logic/TestQuestionGroupModalContainer';

interface TestCreateSelectionAllViewProps {
  finalCopy: boolean;
  enableShuffle: boolean;
  onChange: (checked: boolean) => void;
}

export const TestCreateSelectionAllView = ({ finalCopy, enableShuffle, onChange }: TestCreateSelectionAllViewProps) => {
  return (
    <>
      <Table.Cell textAlign="center" colSpan={2}>
        <Form.Field
          readOnly={finalCopy}
          control={Checkbox}
          checked={enableShuffle}
          label="문항 순서 셔플"
          onChange={(e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => onChange(data.checked)}
        />
      </Table.Cell>
    </>
  );
};

interface TestCreateSelectionByGroupViewProps {
  finalCopy: boolean;
  questionGroup: QuestionGroup[];
  totalCount: number;
  onChangeGroupPointPerQuestion: (groupName: string, pointPerQuestion: string) => void;
  onChangeGroupQuestionCount: (groupName: string, groupQuestionCount: string) => void;
  onBlurGroupQuestionCount: (groupName: string, groupQuestionCount: string) => void;
}

export const TestCreateSelectionByGroupView = ({
  finalCopy,
  questionGroup,
  totalCount,
  onChangeGroupPointPerQuestion,
  onChangeGroupQuestionCount,
  onBlurGroupQuestionCount,
}: TestCreateSelectionByGroupViewProps) => {
  return (
    <>
      <Table.Cell textAlign="center" colSpan={2}>
        {!finalCopy && <TestQuestionGroupModalContainer />}
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="30%" />
            <col width="50%" />
          </colgroup>

          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell className="title-header">{`그룹 ( ${questionGroup.length - 1} )`}</Table.HeaderCell>
              <Table.HeaderCell className="title-header">그룹별 점수</Table.HeaderCell>
              <Table.HeaderCell className="title-header">{`그룹별 출제 문항 수 ( 전체 ${totalCount} )`}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {questionGroup &&
              questionGroup.map((group, index) => {
                return (
                  <Table.Row key={index} textAlign="center" verticalAlign="middle">
                    {/* 그룹이 미지정인 경우 */}
                    {group.name === '' ? (
                      <>
                        <Table.Cell>미지정</Table.Cell>
                        <Table.Cell>-</Table.Cell>
                        <Table.Cell>{group.totalQuestionCount} 문항</Table.Cell>
                      </>
                    ) : (
                      <>
                        <Table.Cell>{group.name}</Table.Cell>
                        <Table.Cell>
                          <Form.Group className="inline-block">
                            <Form.Field
                              readOnly={finalCopy}
                              control={Input}
                              type="number"
                              min={0}
                              max={100}
                              value={group.pointPerGroup}
                              onChange={(e: React.ChangeEvent, data: InputOnChangeData) =>
                                onChangeGroupPointPerQuestion(group.name, data.value)
                              }
                            />
                            <span className="label">점</span>
                          </Form.Group>
                        </Table.Cell>
                        <Table.Cell>
                          <Form.Group className="inline-block">
                            <Form.Field
                              readOnly={finalCopy}
                              control={Input}
                              type="number"
                              min={group.mandatoryCount}
                              max={group.totalQuestionCount}
                              value={group.questionCount}
                              onChange={(e: React.ChangeEvent, data: InputOnChangeData) =>
                                onChangeGroupQuestionCount(group.name, data.value)
                              }
                              onBlur={() => onBlurGroupQuestionCount(group.name, group.questionCount)}
                            />
                            <span>{`/ ${group.totalQuestionCount} 문항 ( 필수 ${group.mandatoryCount} 문항 )`}</span>
                          </Form.Group>
                        </Table.Cell>
                      </>
                    )}
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </Table.Cell>
    </>
  );
};

interface TestCreateSelectionFixedCountViewProps {
  finalCopy: boolean;
  pointPerQuestion: string;
  onChangePointPerQuestion: (pointPerQuestion: string) => void;
}

export const TestCreateSelectionFixedCountView = ({
  finalCopy,
  pointPerQuestion,
  onChangePointPerQuestion,
}: TestCreateSelectionFixedCountViewProps) => {
  return (
    <>
      <Table.Cell textAlign="center" className="tb-header">
        문항 점수
      </Table.Cell>
      <Table.Cell>
        <Table celled className="no-border">
          <colgroup>
            <col width="45%" />
            <col width="55%" />
          </colgroup>

          <Table.Body>
            <Table.Row>
              <Table.Cell textAlign="right">
                <Form.Field
                  readOnly={finalCopy}
                  control={Input}
                  className="no-spin-button"
                  type="number"
                  min={0}
                  max={100}
                  value={pointPerQuestion}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) =>
                    onChangePointPerQuestion(data.value)
                  }
                />
              </Table.Cell>
              <Table.Cell colSpan={2}>점</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Table.Cell>
    </>
  );
};
