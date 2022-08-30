import React, { Fragment } from 'react';
import { Button, Table, Input, InputOnChangeData, Form, Grid, Checkbox, Icon, Item, Radio } from 'semantic-ui-react';
import { Modal } from 'shared/components';
import { ModalGroup, ModalQuestion } from '../../viewmodel/TestQuestionGroupModalViewModel';
import { QuestionType } from '../../model/QuestionType';
import { SingleChoiceView } from './gradesheet/SingleChoiceView';
import { MultiChoiceView } from './gradesheet/MultiChoiceView';
import { ShortAnswerView } from './gradesheet/ShortAnswerView';
import { EssayView } from './gradesheet/EssayView';

interface TestQuestionGroupModalViewProps {
  onMount: () => void;
  onOk: (close: () => void) => void;
  onClose: (close: () => void) => void;
  groupName: string; // 생성 그룹명

  groups: ModalGroup[]; // 그룹 목록
  questions: ModalQuestion[]; // 문항 목록

  selectedGroupName: string; // 선택된 그룹 명
  selectedQuestions: number[]; // 선택된 문항 sequence 목록
  selectedQuestionsInGroup: number[]; // 선택된 그룹 안의 문항 sequence 목록

  onChangeSelectQuestion: (checked: boolean, sequence: number) => void; // 문항 선택 Fn
  onChangeUpdateGroupName: (groupName: string, changeGroupName: string) => void; // 그룹명 Change Fn
  onChangeGroupNameInModal: (groupName: string) => void; // 생성 그룹명 Change Fn
  onChangeSelectedGroupName: (groupName: string) => void; // 그룹 선택 Fn
  onChangeSelectedQuestionInGroup: (sequence: number, checked: boolean) => void; // 그룹 안의 문항 선택 Fn

  onClickAddGroup: (groupName: string) => void; // 그룹 추가 버튼 Fn
  onClickOpenGroup: (groupName: string, isOpen: boolean) => void; // 그룹 설정된 문항 보기 상태 수정 버튼 Fn
  onClickUpdateForm: (groupName: string, updatable: boolean) => void; // 그룹명 수정 Form 버튼 Fn
  onClickRemoveGroup: (groupName: string) => void; // 그룹 삭제 버튼 Fn
  onClickOpenQuestion: (sequence: number, isOpen: boolean) => void; // 문항 답항 보기 상태 수정 버튼 Fn
  onClickUpdateGroupName: (groupName: string, changeGroupName: string) => void; // 그룹명 수정 버튼 Fn
  onClickGroupInQuestions: () => void; // 문항 그룹 할당 Fn
  onClickGroupOutQuestions: () => void; // 문항 그룹 할당 취소 Fn
  onClickAllSelectQuestion: () => void; // 문항 모두 선택 Fn
}

export function TestQuestionGroupModalView({
  onMount,
  onOk,
  onClose,
  groupName,

  groups,
  questions,

  selectedGroupName,
  selectedQuestions,
  selectedQuestionsInGroup,

  onChangeSelectQuestion,
  onChangeUpdateGroupName,
  onChangeGroupNameInModal,
  onChangeSelectedGroupName,
  onChangeSelectedQuestionInGroup,

  onClickAddGroup,
  onClickOpenGroup,
  onClickUpdateForm,
  onClickRemoveGroup,
  onClickOpenQuestion,
  onClickUpdateGroupName,
  onClickGroupInQuestions,
  onClickGroupOutQuestions,
  onClickAllSelectQuestion,
}: TestQuestionGroupModalViewProps) {
  return (
    <Modal
      size="large"
      trigger={
        <Button type="button" floated="right" className="only-margin-button">
          그룹 설정
        </Button>
      }
      onMount={onMount}
    >
      <Modal.Header>그룹 지정</Modal.Header>
      <Modal.Content>
        <Table celled>
          <colgroup>
            <col width="50%" />
            <col width="2%" />
            <col width="48%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <span>전체 문항 {questions.length}개</span>
              </Table.HeaderCell>
              <Table.HeaderCell colSpan={2}>
                <span className="vertical-sub">전체 그룹 {groups.length - 1}개</span>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="vertical-top">
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <Button type="button" floated="right" onClick={onClickAllSelectQuestion}>
                        전체선택
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <div className="scrolling-50vh">
                        <Table celled className="no-border">
                          <colgroup>
                            <col width="3%" />
                            <col width="94%" />
                            <col width="3%" />
                          </colgroup>
                          <Table.Body>
                            {questions.map((question, index) => (
                              <Fragment key={`question-${index}`}>
                                <Table.Row>
                                  <Table.Cell>
                                    <Form.Field
                                      control={Checkbox}
                                      disabled={question.groupName !== ''}
                                      checked={
                                        selectedQuestions.includes(question.sequence) || question.groupName !== ''
                                      }
                                      onChange={(e: any, data: any) =>
                                        onChangeSelectQuestion(data.checked, question.sequence)
                                      }
                                    />
                                  </Table.Cell>
                                  <Table.Cell textAlign="left">{`${question.sequence}. ${question.question} ${
                                    question.mandatory ? '[필수]' : ''
                                  }`}</Table.Cell>
                                  <Table.Cell>
                                    {question.isOpen ? (
                                      <Icon
                                        className="angle up"
                                        onClick={() => onClickOpenQuestion(question.sequence, false)}
                                      />
                                    ) : (
                                      <Icon
                                        className="angle down"
                                        onClick={() => onClickOpenQuestion(question.sequence, true)}
                                      />
                                    )}
                                  </Table.Cell>
                                </Table.Row>
                                {question.isOpen && (
                                  <Table.Row>
                                    <Table.Cell />
                                    <Table.Cell>
                                      {question.questionType === QuestionType.SingleChoice && (
                                        <SingleChoiceView
                                          questionNo={question.sequence}
                                          answer={question.questionAnswer.answer}
                                          questionItems={question.items}
                                        />
                                      )}

                                      {question.questionType === QuestionType.MultiChoice && (
                                        <MultiChoiceView
                                          answer={question.questionAnswer.answer}
                                          questionItems={question.items}
                                        />
                                      )}

                                      {question.questionType === QuestionType.ShortAnswer && (
                                        <ShortAnswerView answer={question.questionAnswer.answer} />
                                      )}

                                      {question.questionType === QuestionType.Essay && (
                                        <EssayView answer={question.questionAnswer.answer} />
                                      )}
                                    </Table.Cell>
                                    <Table.Cell />
                                  </Table.Row>
                                )}
                              </Fragment>
                            ))}
                          </Table.Body>
                        </Table>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Table.Cell>
              <Table.Cell textAlign="center" className="padding-10px">
                {
                  <>
                    <p className="none-padding only-margin-button">
                      <Button
                        icon="angle left"
                        className="no-margin"
                        size="mini"
                        basic
                        onClick={() => onClickGroupOutQuestions()}
                      />
                    </p>
                    <p className="none-padding">
                      <Button
                        icon="angle right"
                        className="no-margin"
                        size="mini"
                        basic
                        onClick={() => onClickGroupInQuestions()}
                      />
                    </p>
                  </>
                }
              </Table.Cell>
              <Table.Cell className="vertical-top padding-10px none-border-left">
                <Grid>
                  <Grid.Row>
                    <Grid.Column textAlign="right" verticalAlign="middle">
                      <Form.Group className="inline-block">
                        <Form.Field
                          control={Input}
                          className="middle aligned"
                          placeholder="그룹명을 입력하세요. (50자)"
                          value={groupName}
                          onChange={(e: React.ChangeEvent, data: InputOnChangeData) =>
                            onChangeGroupNameInModal(data.value)
                          }
                        />

                        <Button type="button" onClick={() => onClickAddGroup(groupName)}>
                          그룹 추가
                        </Button>
                      </Form.Group>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <div className="scrolling-50vh">
                        <Table celled className="no-border">
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell verticalAlign="middle" className="padding-10px">
                                <Item.Group>
                                  {groups.map((group, index) => {
                                    return group.name === '' ? null : (
                                      <Item key={`group-${index}`}>
                                        <Item.Content>
                                          <Table celled className="no-border">
                                            <colgroup>
                                              <col width="5%" />
                                              <col width="61%" />
                                              <col width="34%" />
                                            </colgroup>

                                            <Table.Body>
                                              <Table.Row className="td-border no-first-border">
                                                <Table.Cell textAlign="center">
                                                  <Form.Field
                                                    control={Radio}
                                                    className="inline-block"
                                                    checked={group.name === selectedGroupName}
                                                    onChange={() => onChangeSelectedGroupName(group.name)}
                                                  />
                                                </Table.Cell>
                                                <Table.Cell className="none-border-right min-width-240">
                                                  {group.isOpen ? (
                                                    <Icon
                                                      className="angle up"
                                                      onClick={() => onClickOpenGroup(group.name, false)}
                                                    />
                                                  ) : (
                                                    <Icon
                                                      className="angle down"
                                                      onClick={() => onClickOpenGroup(group.name, true)}
                                                    />
                                                  )}
                                                  {group.updatable ? (
                                                    <Form.Field
                                                      className="inline-block"
                                                      control={Input}
                                                      value={group.updateName}
                                                      onChange={(e: React.ChangeEvent, data: InputOnChangeData) =>
                                                        onChangeUpdateGroupName(group.name, data.value)
                                                      }
                                                    />
                                                  ) : (
                                                    <>
                                                      {group.name} ( {group.questions.length} )
                                                    </>
                                                  )}
                                                </Table.Cell>
                                                <Table.Cell textAlign="center" className="padding-2px min-width-145">
                                                  <Button
                                                    type="button"
                                                    size="tiny"
                                                    onClick={() => onClickUpdateForm(group.name, group.updatable)}
                                                  >
                                                    {group.updatable ? '취소' : '수정'}
                                                  </Button>
                                                  {group.updatable ? (
                                                    <Button
                                                      type="button"
                                                      size="tiny"
                                                      className="no-margin-right"
                                                      onClick={() =>
                                                        onClickUpdateGroupName(group.name, group.updateName)
                                                      }
                                                    >
                                                      저장
                                                    </Button>
                                                  ) : (
                                                    <Button
                                                      type="button"
                                                      size="tiny"
                                                      className="no-margin-right"
                                                      onClick={() => onClickRemoveGroup(group.name)}
                                                    >
                                                      삭제
                                                    </Button>
                                                  )}
                                                </Table.Cell>
                                              </Table.Row>
                                              {group.isOpen && (
                                                <Table.Row>
                                                  <Table.Cell />
                                                  <Table.Cell colSpan={2}>
                                                    <Table celled>
                                                      <colgroup>
                                                        <col width="5%" />
                                                        <col width="95%" />
                                                      </colgroup>

                                                      <Table.Body>
                                                        {group.questions.map((question) => (
                                                          <Table.Row>
                                                            <Table.Cell>
                                                              <Form.Field
                                                                control={Checkbox}
                                                                checked={selectedQuestionsInGroup.includes(
                                                                  question.sequence
                                                                )}
                                                                onChange={(e: any, data: any) =>
                                                                  onChangeSelectedQuestionInGroup(
                                                                    question.sequence,
                                                                    data.checked
                                                                  )
                                                                }
                                                              />
                                                            </Table.Cell>
                                                            <Table.Cell className="none-border-left" textAlign="left">
                                                              {`${question.sequence}. ${question.question} ${
                                                                question.mandatory ? '[필수]' : ''
                                                              }`}
                                                            </Table.Cell>
                                                          </Table.Row>
                                                        ))}
                                                      </Table.Body>
                                                    </Table>
                                                  </Table.Cell>
                                                </Table.Row>
                                              )}
                                            </Table.Body>
                                          </Table>
                                        </Item.Content>
                                      </Item>
                                    );
                                  })}
                                </Item.Group>
                              </Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Modal.CloseButton onClickWithClose={(event, close) => onClose(close)}>취소</Modal.CloseButton>
        <Modal.CloseButton onClickWithClose={(event, close) => onOk(close)}>확인</Modal.CloseButton>
      </Modal.Actions>
    </Modal>
  );
}
