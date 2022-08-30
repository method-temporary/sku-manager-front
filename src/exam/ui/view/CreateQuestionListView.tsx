import React, { useRef } from 'react';
import {
  Button,
  Checkbox,
  Form,
  FormGroup,
  Grid,
  Input,
  Select,
  Table,
  TextArea,
  TextAreaProps,
} from 'semantic-ui-react';

import { SelectType } from 'shared/model';
import { Image, SubActions } from 'shared/components';

import { Question } from 'exam/viewmodel/TestSheetViewModel';

import {
  onChangeMandatory,
  onChangePoint,
  onChangeQuestion,
  onChangeDescription,
  onChangeQuestionAnswerExplanation,
  onChangeQuestionImage,
  onChangeQuestionType,
  onCopyQuestion,
  onRemoveQuestion,
} from 'exam/handler/TestCreateQuestionHandler';
import { CreateChoiceView } from './CreateChoiceView';
import { CreateShortAnswerView } from './CreateShortAnswerView';
import { QuestionType } from '../../model/QuestionType';
import { QuestionSelectionType } from '../../model/QuestionSelectionType';

interface CreateQuestionListViewProps {
  finalCopy: boolean;
  questionIndex: number;
  questionSelectionType: QuestionSelectionType;
  newQuestion: Question;
}

export function CreateQuestionListView({
  finalCopy,
  questionIndex,
  questionSelectionType,
  newQuestion,
}: CreateQuestionListViewProps) {
  //
  const questionImgRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {!finalCopy && (
        <SubActions>
          <SubActions.Right>
            <Button type="button" onClick={() => onRemoveQuestion(questionIndex)}>
              삭제
            </Button>
            <Button type="button" onClick={() => onCopyQuestion(newQuestion)}>
              문항 복사
            </Button>
          </SubActions.Right>
        </SubActions>
      )}
      <Table celled>
        <colgroup>
          <col width="8%" />
          <col width="5%" />
          <col width="4%" />
          <col width="8%" />
          <col width="5%" />
          <col width="8%" />
          <col width="12%" />
          <col width="5%" />
          <col width="8%" />
          <col width="12%" />
          <col width="5%" />
          <col width="8%" />
          <col width="12%" />
        </colgroup>

        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header" colSpan={2}>
              문항
            </Table.Cell>
            <Table.Cell colSpan={2}>{newQuestion.sequence}</Table.Cell>
            <Table.Cell className="tb-header" colSpan={2}>
              옵션
            </Table.Cell>
            <Table.Cell>
              <Grid.Column>
                <FormGroup>
                  <Form.Field
                    readOnly={finalCopy}
                    className="vertical-middle"
                    control={Checkbox}
                    label={{
                      children: <span>필수 출제</span>,
                    }}
                    checked={newQuestion.mandatory}
                    onChange={(e: any, data: any) => onChangeMandatory(newQuestion.sequence, data.checked)}
                  />
                </FormGroup>
              </Grid.Column>
            </Table.Cell>
            <Table.Cell className="tb-header" colSpan={2}>
              유형
            </Table.Cell>
            <Table.Cell colSpan={questionSelectionType !== QuestionSelectionType.ALL ? 4 : 1}>
              <Form.Field
                disabled={finalCopy}
                className={finalCopy ? 'read-only' : ''}
                width={16}
                control={Select}
                value={newQuestion.questionType}
                options={SelectType.examQuestionTypeOptions}
                onChange={(e: any, data: any) => onChangeQuestionType(newQuestion.sequence, data.value)}
              />
            </Table.Cell>

            {questionSelectionType === QuestionSelectionType.ALL && (
              <>
                <Table.Cell className="tb-header" colSpan={2}>
                  점수
                </Table.Cell>
                <Table.Cell>
                  <Form.Field
                    readOnly={finalCopy}
                    width={16}
                    min={0}
                    type="number"
                    control={Input}
                    value={newQuestion.point}
                    onChange={(e: any, data: any) => onChangePoint(newQuestion.sequence, data.value)}
                  />
                </Table.Cell>
              </>
            )}
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header" colSpan={2}>
              문제
            </Table.Cell>
            <Table.Cell colSpan={11}>
              <>
                <TextArea
                  rows={3}
                  value={newQuestion.question}
                  onChange={(event, data) => onChangeQuestion(newQuestion.sequence, data)}
                />
                <Button
                  size="mini"
                  className="file-select-btn"
                  content="파일 선택"
                  labelPosition="left"
                  icon="file"
                  onClick={() => {
                    if (questionImgRef && questionImgRef.current) {
                      questionImgRef.current.click();
                    }
                  }}
                />
                <input
                  type="file"
                  ref={questionImgRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    e.target.files && onChangeQuestionImage(newQuestion.sequence, e.target.files[0])
                  }
                  hidden
                />

                {newQuestion && newQuestion.imagePath && (
                  <div>
                    <Image
                      src={`${newQuestion.imagePath}`}
                      size="small"
                      verticalAlign="bottom"
                      className="max-width-100"
                    />
                  </div>
                )}

                <p className="info-text-gray">- JPG, PNG 파일을 등록하실 수 있습니다.</p>
              </>
            </Table.Cell>
          </Table.Row>
          {/*/!* 객관식 *!/*/}
          {(newQuestion.questionType === QuestionType.SingleChoice ||
            newQuestion.questionType === QuestionType.MultiChoice ||
            newQuestion.questionType === QuestionType.MatchingChoice) && (
            <CreateChoiceView finalCopy={finalCopy} newQuestion={newQuestion} />
          )}

          {/* 주관식 */}
          {newQuestion.questionType === QuestionType.ShortAnswer && (
            <CreateShortAnswerView finalCopy={finalCopy} newQuestion={newQuestion} />
          )}
          {newQuestion.description && (
            <Table.Row>
              <Table.Cell colSpan={2} className="tb-header">
                비고
              </Table.Cell>
              <Table.Cell colSpan={11}>
                <div
                  className={
                    newQuestion.description?.length >= 1000
                      ? 'ui right-top-count input error'
                      : 'ui right-top-count input'
                  }
                >
                  <span className="count">
                    <span className="now">{newQuestion.description?.length}</span>/
                    <span className="max">5000</span>
                  </span>
                  <TextArea
                    placeholder="비고를 입력해주세요. (최대 5000자까지 입력가능)"
                    rows={5}
                    className="height-rows"
                    value={newQuestion.description}
                    onChange={(_: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) =>
                      onChangeDescription(newQuestion.sequence, data)
                    }
                  />
                </div>
              </Table.Cell>
            </Table.Row>
          )}
          {/* 서술형은 해설 없음 */}
          {newQuestion.questionType !== QuestionType.Essay && (
            <Table.Row>
              <Table.Cell colSpan={2} className="tb-header">
                해설
              </Table.Cell>
              <Table.Cell colSpan={11}>
                <div
                  className={
                    newQuestion.questionAnswer.explanation.length >= 2000
                      ? 'ui right-top-count input error'
                      : 'ui right-top-count input'
                  }
                >
                  <span className="count">
                    <span className="now">{newQuestion.questionAnswer.explanation.length}</span>/
                    <span className="max">2000</span>
                  </span>
                  <TextArea
                    placeholder="문항 해설을 입력해주세요. (최대 2000자까지 입력가능)"
                    rows={5}
                    className="height-rows"
                    value={newQuestion.questionAnswer.explanation}
                    onChange={(_: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) =>
                      onChangeQuestionAnswerExplanation(newQuestion.sequence, data)
                    }
                  />
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <hr className="contour" />
    </>
  );
}
