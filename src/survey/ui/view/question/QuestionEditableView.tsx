import React from 'react';
import { Button, Checkbox, Form, Icon, Radio, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import ChoiceQuestionTabPaneView from './ChoiceQuestionTabPaneView';
import CriterionQuestionTabPaneView from './CriterionQuestionTabPaneView';
import { EssayQuestionTabPaneView } from './EssayQuestionTabPaneView';
import { DateQuestionTabPaneView } from './DateQuestionTabPaneView';
import { BooleanQuestionTabPaneView } from './BooleanQuestionTabPaneView';
import MatrixQuestionTabPaneView from './MatrixQuestionTabPaneView';
import { SurveyFormModel } from '../../../form/model/SurveyFormModel';
import { QuestionItemType } from '../../../form/model/QuestionItemType';
import { NumberValue } from '../../../form/model/NumberValue';
import { QuestionModel } from '../../../form/model/QuestionModel';
import { ChoiceQuestionItems } from '../../../form/model/ChoiceQuestionItems';
import { CriterionModel } from '../../../form/model/CriterionModel';
import { toJS } from 'mobx';
import SurveyUsePropsFormModal from 'cube/cube/ui/logic/SurveyUsePropsFormModal';
import ReviewQuestionTabPaneView from './ReviewQuestionTabPaneView';
import ChoiceFixedQuestionTabPaneView from './ChoiceFixedQuestionTabPaneView';

interface Props {
  lang: string;
  commonSurveyForm: SurveyFormModel;
  questions: QuestionModel[];
  criterionList: CriterionModel[];
  onAddQuestion: (questionItemType: QuestionItemType) => void;
  onRemoveQuestion: (index: number) => void;
  onCopyQuestion: (question: QuestionModel, index: number) => void;
  onChangeQuestionProp: (index: number, prop: string, value: any) => void;
  onChangeQuestionSequence: (index: number, targetIndex: number) => void;
  onChangeQuestionLangString: (index: number, prop: string, lang: string, string: string) => void;
  onRemoveAnswerItem: (index: number, item: NumberValue) => void;
  onRemoveRowItem: (index: number, item: NumberValue) => void;
  onRemoveColumnItem: (index: number, item: NumberValue) => void;
  uploadFile: (file: File, uploadImageQuestionType: string, question: QuestionModel) => void;
  resetImage: (uploadImageQuestionType: string, question: QuestionModel) => void;
  onChangeSurveyFormProp: (prop: keyof SurveyFormModel, value: any) => void;
  useCommon?: boolean;
}

interface QuestionItemProps {
  lang: string;
  onChangeQuestionProp: (index: number, prop: string, value: any) => void;
  onChangeQuestionLangString: (index: number, prop: string, lang: string, string: string) => void;
  onRemoveAnswerItem: (index: number, item: NumberValue) => void;
  onRemoveRowItem: (index: number, item: NumberValue) => void;
  onRemoveColumnItem: (index: number, item: NumberValue) => void;
  uploadFile: (file: File, uploadImageQuestionType: string, question: QuestionModel) => void;
  resetImage: (uploadImageQuestionType: string, question: QuestionModel) => void;
  question: QuestionModel;
  index: number;
  criterionList: CriterionModel[];
}

const QuestionItem: React.FC<QuestionItemProps> = function QuestionItem({
  lang,
  onChangeQuestionProp,
  onChangeQuestionLangString,
  onRemoveAnswerItem,
  onRemoveRowItem,
  onRemoveColumnItem,
  uploadFile,
  resetImage,
  question,
  index,
  criterionList,
}) {
  switch (question.questionItemType) {
    case QuestionItemType.Choice:
      return (
        <ChoiceQuestionTabPaneView
          question={question}
          code={lang}
          index={index}
          onChangeQuestionProp={onChangeQuestionProp}
          onChangeQuestionLangString={onChangeQuestionLangString}
          onRemoveAnswerItem={onRemoveAnswerItem}
          uploadFile={uploadFile}
          resetImage={resetImage}
        />
      );
    case QuestionItemType.Criterion:
      return (
        <CriterionQuestionTabPaneView
          question={question}
          code={lang}
          index={index}
          criterionList={criterionList}
          onChangeQuestionLangString={onChangeQuestionLangString}
          onChangeQuestionProp={onChangeQuestionProp}
        />
      );
    case QuestionItemType.Essay:
      return (
        <EssayQuestionTabPaneView
          question={question}
          code={lang}
          index={index}
          onChangeQuestionProp={onChangeQuestionProp}
          onChangeQuestionLangString={onChangeQuestionLangString}
          uploadFile={uploadFile}
          resetImage={resetImage}
        />
      );
    case QuestionItemType.Date:
      return (
        <DateQuestionTabPaneView
          question={question}
          code={lang}
          index={index}
          onChangeQuestionLangString={onChangeQuestionLangString}
          uploadFile={uploadFile}
          resetImage={resetImage}
        />
      );
    case QuestionItemType.Boolean:
      return (
        <BooleanQuestionTabPaneView
          question={question}
          code={lang}
          index={index}
          onChangeQuestionLangString={onChangeQuestionLangString}
          uploadFile={uploadFile}
          resetImage={resetImage}
        />
      );
    case QuestionItemType.Matrix:
      return (
        <MatrixQuestionTabPaneView
          question={question}
          code={lang}
          index={index}
          onChangeQuestionProp={onChangeQuestionProp}
          onChangeQuestionLangString={onChangeQuestionLangString}
          onRemoveRowItem={onRemoveRowItem}
          onRemoveColumnItem={onRemoveColumnItem}
          uploadFile={uploadFile}
          resetImage={resetImage}
        />
      );
    case QuestionItemType.Review:
      return (
        <ReviewQuestionTabPaneView
          question={question}
          code={lang}
          index={index}
          onChangeQuestionProp={onChangeQuestionProp}
          onChangeQuestionLangString={onChangeQuestionLangString}
        />
      );
    case QuestionItemType.ChoiceFixed:
      return (
        <ChoiceFixedQuestionTabPaneView
          question={question}
          code={lang}
          index={index}
          onChangeQuestionProp={onChangeQuestionProp}
          onChangeQuestionLangString={onChangeQuestionLangString}
          uploadFile={uploadFile}
          resetImage={resetImage}
        />
      );
    default:
      return null;
  }
};

@observer
@reactAutobind
export default class QuestionEditableView extends React.Component<Props> {
  render() {
    const {
      lang,
      commonSurveyForm,
      questions,
      onAddQuestion,
      onRemoveQuestion,
      onCopyQuestion,
      onChangeQuestionProp,
      onChangeQuestionSequence,
      onChangeQuestionLangString,
      onRemoveAnswerItem,
      onRemoveRowItem,
      onRemoveColumnItem,
      uploadFile,
      resetImage,
      criterionList,
      onChangeSurveyFormProp,
      useCommon,
    } = this.props;

    const unsafe_questins = toJS(questions);

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} className="title-header">
              설문 문항
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {/*<Table.Row>
            <Table.Cell className="tb-header">공통설문</Table.Cell>
            <Table.Cell>
              <Form.Field
                control={Checkbox}
                label=""
                checked={useCommon}
                onChange={(e: any, data: any) => onChangeSurveyFormProp('useCommon', data.checked)}
                disabled={false}
                style={{ float: 'left' }}
              />
              <p className="info-text-gray" style={{ float: 'left', marginBottom: '0px', marginTop: '3px' }}>
                ※ 선택 시 공통설문 4개 문항이 추가 됩니다.
              </p>
              <SurveyUsePropsFormModal
                surveyId={commonSurveyForm.id}
                surveyForm={commonSurveyForm}
                trigger={<Icon name="question" size="small" link circular style={{ marginLeft: '5px' }} />}
              />
            </Table.Cell>
          </Table.Row>*/}
          <Table.Row>
            <Table.Cell className="tb-header">설문항목</Table.Cell>
            <Table.Cell>
              <Button icon basic onClick={() => onAddQuestion(QuestionItemType.Criterion)}>
                <Icon name="plus" /> 척도 추가
              </Button>
              <Button icon basic onClick={() => onAddQuestion(QuestionItemType.Choice)}>
                <Icon name="plus" /> 객관식 추가
              </Button>
              <Button icon basic onClick={() => onAddQuestion(QuestionItemType.Essay)}>
                <Icon name="plus" /> 주관식 추가
              </Button>
              <Button icon basic onClick={() => onAddQuestion(QuestionItemType.Date)}>
                <Icon name="plus" /> 날짜 추가
              </Button>
              <Button icon basic onClick={() => onAddQuestion(QuestionItemType.Boolean)}>
                <Icon name="plus" /> Yes or No 추가
              </Button>
              <Button icon basic onClick={() => onAddQuestion(QuestionItemType.Matrix)}>
                <Icon name="plus" /> 행렬 추가
              </Button>
              <Button icon basic onClick={() => onAddQuestion(QuestionItemType.Review)}>
                <Icon name="plus" /> 리뷰 추가
              </Button>
              <Button icon basic onClick={() => onAddQuestion(QuestionItemType.ChoiceFixed)}>
                <Icon name="plus" /> 아이콘 추가
              </Button>

              {questions.map((question, index) => (
                <Table celled key={`question_table_${index}`}>
                  <colgroup>
                    <col width="20%" />
                    <col width="80%" />
                  </colgroup>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell colSpan={2}>
                        <div style={{ float: 'right' }}>
                          {question.questionItemType !== QuestionItemType.Review && (
                            <Button icon basic onClick={() => onCopyQuestion(question, questions.length)}>
                              항목복사
                            </Button>
                          )}

                          <Button.Group>
                            {question.questionItemType !== QuestionItemType.Review && (
                              <>
                                <Button icon basic onClick={() => onChangeQuestionSequence(index, index - 1)}>
                                  <Icon name="angle up" />
                                </Button>
                                <Button icon basic onClick={() => onChangeQuestionSequence(index, index + 1)}>
                                  <Icon name="angle down" />
                                </Button>
                                <Button icon basic onClick={() => onChangeQuestionSequence(index, 0)}>
                                  <Icon name="angle double up" />
                                </Button>
                                <Button
                                  icon
                                  basic
                                  onClick={() => onChangeQuestionSequence(index, questions.length - 1)}
                                >
                                  <Icon name="angle double down" />
                                </Button>
                              </>
                            )}
                            <Button icon basic onClick={() => onRemoveQuestion(index)}>
                              <Icon color="red" name="trash alternate outline" />
                            </Button>
                          </Button.Group>
                        </div>
                        {index + 1}번
                        <span className="ml-sm">
                          <Checkbox
                            checked={!question.optional}
                            onChange={(event, data) => {
                              if (question.questionItemType === 'Review' || question.questionItemType === 'ChoiceFixed')
                                return;
                              onChangeQuestionProp(index, 'optional', !data.checked);
                            }}
                            label="필수"
                          />
                        </span>
                        {question.questionItemType === 'Essay' && (
                          // 20210209 설문 추가
                          <span className="ml-sm">
                            <Checkbox
                              checked={!question.visible}
                              onChange={(event, data) => onChangeQuestionProp(index, 'visible', !data.checked)}
                              label="비공개"
                            />
                          </span>
                        )}
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {question.questionItemType === 'Choice' && (
                      <Table.Row>
                        <Table.Cell>응답방식</Table.Cell>
                        <Table.Cell>
                          <Form.Group inline className="radio-inline">
                            <Form.Field>
                              <Radio
                                label="단수 선택"
                                name={`${index}-multipleChoice`}
                                value="single"
                                checked={!(question.answerItems as ChoiceQuestionItems).multipleChoice}
                                onChange={(event, data) =>
                                  onChangeQuestionProp(index, 'answerItems', {
                                    ...question.answerItems,
                                    multipleChoice: !data.checked,
                                  })
                                }
                              />
                              <Radio
                                label="복수 선택"
                                name={`${index}-multipleChoice`}
                                value="multiple"
                                checked={(question.answerItems as ChoiceQuestionItems).multipleChoice}
                                onChange={(event, data) =>
                                  onChangeQuestionProp(index, 'answerItems', {
                                    ...question.answerItems,
                                    multipleChoice: data.checked,
                                  })
                                }
                              />
                            </Form.Field>
                          </Form.Group>
                        </Table.Cell>
                      </Table.Row>
                    )}
                    <Table.Row>
                      <Table.Cell>설문내용</Table.Cell>
                      <Table.Cell>
                        <Form.Field>
                          <QuestionItem
                            lang={lang}
                            question={question}
                            index={index}
                            onChangeQuestionProp={onChangeQuestionProp}
                            onChangeQuestionLangString={onChangeQuestionLangString}
                            onRemoveAnswerItem={onRemoveAnswerItem}
                            onRemoveRowItem={onRemoveRowItem}
                            onRemoveColumnItem={onRemoveColumnItem}
                            uploadFile={uploadFile}
                            resetImage={resetImage}
                            criterionList={criterionList}
                          />
                        </Form.Field>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              ))}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}
