import React from 'react';
import { Checkbox, Radio, Table, Form } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';
import ReadOnlyChoiceQuestionTabPaneView from './ReadOnlyChoiceQuestionTabPaneView';
import ReadOnlyCriterionQuestionTabPaneView from './ReadOnlyCriterionQuestionTabPaneView';
import { ReadOnlyEssayQuestionTabPaneView } from './ReadOnlyEssayQuestionTabPaneView';
import { ReadOnlyDateQuestionTabPaneView } from './ReadOnlyDateQuestionTabPaneView';
import { ReadOnlyBooleanQuestionTabPaneView } from './ReadOnlyBooleanQuestionTabPaneView';
import ReadOnlyMatrixQuestionTabPaneView from './ReadOnlyMatrixQuestionTabPaneView';
import { SurveyFormModel } from '../../../../form/model/SurveyFormModel';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import { QuestionItemType } from '../../../../form/model/QuestionItemType';
import { ChoiceQuestionItems } from '../../../../form/model/ChoiceQuestionItems';
import ReadOnlyReviewQuestionTabPaneView from './ReadOnlyReviewQuestionTabPaneView';

interface Props {
  lang: string;
  surveyForm: SurveyFormModel;
}

@reactAutobind
export default class ReadOnlyQuestionListView extends React.Component<Props> {
  //
  createQuestionItemComponent(question: QuestionModel) {
    //
    const { lang } = this.props;

    const questionSequences = this.props.surveyForm.questions.map((question) => question.sequence);

    switch (question.questionItemType) {
      case QuestionItemType.Choice:
        return <ReadOnlyChoiceQuestionTabPaneView question={question} lang={lang} />;
      case QuestionItemType.Criterion:
        return (
          <ReadOnlyCriterionQuestionTabPaneView
            question={question}
            questionSequences={questionSequences}
            criterionList={this.props.surveyForm.criterionList}
            lang={lang}
          />
        );
      case QuestionItemType.Essay:
        return (
          <ReadOnlyEssayQuestionTabPaneView question={question} lang={lang} questionSequences={questionSequences} />
        );
      case QuestionItemType.Date:
        return (
          <ReadOnlyDateQuestionTabPaneView question={question} lang={lang} questionSequences={questionSequences} />
        );
      case QuestionItemType.Boolean:
        return (
          <ReadOnlyBooleanQuestionTabPaneView question={question} lang={lang} questionSequences={questionSequences} />
        );
      case QuestionItemType.Matrix:
        return <ReadOnlyMatrixQuestionTabPaneView question={question} lang={lang} />;
      case QuestionItemType.Review:
        return <ReadOnlyReviewQuestionTabPaneView question={question} lang={lang} />;
      case QuestionItemType.ChoiceFixed:
        return <ReadOnlyChoiceQuestionTabPaneView question={question} lang={lang} />;
      default:
        return null;
    }
  }

  render() {
    const { surveyForm } = this.props;
    const questions = (surveyForm && surveyForm.questions) || [];

    return (
      <>
        {questions &&
          questions.map((question, index) => (
            <Table celled key={question.sequence.index}>
              <colgroup>
                <col width="20%" />
                <col width="80%" />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan={2}>
                    {question.sequence.number}번 문항
                    <span className="ml-sm">
                      <Checkbox label="필수" checked={!question.optional} />
                    </span>
                    {question.questionItemType === 'Essay' && (
                      // 20210209 설문 추가
                      <span className="ml-sm">
                        <Checkbox checked={!question.visible} label="비공개" />
                      </span>
                    )}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {question.questionItemType === QuestionItemType.Choice && (
                  <Table.Row>
                    <Table.Cell>응답방식</Table.Cell>
                    <Table.Cell>
                      <Form.Group inline className="radio-inline">
                        <Form.Field>
                          <Radio
                            label="단수 선택"
                            name={`radioGroup${index}`}
                            value="single"
                            checked={!(question.answerItems as ChoiceQuestionItems).multipleChoice}
                          />
                          <Radio
                            label="복수 선택"
                            name={`radioGroup${index}`}
                            value="multiple"
                            checked={(question.answerItems as ChoiceQuestionItems).multipleChoice}
                          />
                        </Form.Field>
                      </Form.Group>
                    </Table.Cell>
                  </Table.Row>
                )}
                <Table.Row>
                  <Table.Cell>설문내용</Table.Cell>
                  <Table.Cell>
                    <Form.Field>{this.createQuestionItemComponent(question)}</Form.Field>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          ))}
      </>
    );
  }
}
