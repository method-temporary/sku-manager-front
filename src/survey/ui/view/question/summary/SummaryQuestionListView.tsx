import React from 'react';
import { Checkbox, Radio, Table, Form } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { getLanguageValue } from 'shared/components/Polyglot';

import { SurveyFormModel } from '../../../../form/model/SurveyFormModel';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import { QuestionItemType } from '../../../../form/model/QuestionItemType';
import { ChoiceQuestionItems } from '../../../../form/model/ChoiceQuestionItems';
import AnswerSummaryModel from '../../../../analysis/model/AnswerSummaryModel';
import SummaryReviewQuestionView from './SummaryReviewQuestionView';
import SummaryChoiceQuestionView from './SummaryChoiceQuestionView';
import SummaryCriterionQuestionView from './SummaryCriterionQuestionView';
import SummaryEssayQuestionView from './SummaryEssayQuestionView';
import SummaryDateQuestionView from './SummaryDateQuestionView';
import SummaryBooleanQuestionView from './SummaryBooleanQuestionView';
import SummaryMatrixQuestionView from './SummaryMatrixQuestionView';
import SummaryChoiceFixedQuestionView from './SummaryChoiceFixedQuestionView';

interface Props {
  surveyForm: SurveyFormModel;
  answerSummaryMap: Map<string, AnswerSummaryModel>;
  onToggleQuestion: (index: number, expended: boolean) => void;
}

@reactAutobind
export default class SummaryQuestionListView extends React.Component<Props> {
  //
  createQuestionItemComponent(question: QuestionModel, index: number) {
    //
    const { answerSummaryMap, surveyForm, onToggleQuestion } = this.props;
    const questionSequences = surveyForm.questions.map((question) => question.sequence);
    const answerSummary =
      (answerSummaryMap && answerSummaryMap.get(question.sequence.toSequenceString())) || new AnswerSummaryModel();
    const lang = getLanguageValue(localStorage.getItem('language') || 'ko');

    switch (question.questionItemType) {
      case QuestionItemType.Choice:
        return <SummaryChoiceQuestionView lang={lang} question={question} answerSummary={answerSummary} />;
      case QuestionItemType.Criterion:
        return (
          <SummaryCriterionQuestionView
            lang={lang}
            question={question}
            questionSequences={questionSequences}
            answerSummary={answerSummary}
            criterionList={this.props.surveyForm.criterionList}
          />
        );
      case QuestionItemType.Essay:
        return (
          <SummaryEssayQuestionView
            lang={lang}
            question={question}
            questionSequences={questionSequences}
            answerSummary={answerSummary}
            onToggleQuestion={(expended: boolean) => onToggleQuestion(index, expended)}
          />
        );
      case QuestionItemType.Date:
        return (
          <SummaryDateQuestionView
            lang={lang}
            question={question}
            questionSequences={questionSequences}
            answerSummary={answerSummary}
            onToggleQuestion={(expended: boolean) => onToggleQuestion(index, expended)}
          />
        );
      case QuestionItemType.Boolean:
        return <SummaryBooleanQuestionView lang={lang} question={question} answerSummary={answerSummary} />;
      case QuestionItemType.Matrix:
        return <SummaryMatrixQuestionView lang={lang} question={question} answerSummary={answerSummary} />;
      case QuestionItemType.Review:
        return (
          <SummaryReviewQuestionView
            lang={lang}
            question={question}
            answerSummary={answerSummary}
            onToggleQuestion={(expended: boolean) => onToggleQuestion(index, expended)}
          />
        );
      case QuestionItemType.ChoiceFixed:
        return <SummaryChoiceFixedQuestionView lang={lang} question={question} answerSummary={answerSummary} />;
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
                    {question.sequence.number}??? ??????
                    <span className="ml-sm">
                      <Checkbox label="??????" checked={!question.optional} />
                    </span>
                    {question.questionItemType === 'Essay' && (
                      <span className="ml-sm">
                        <Checkbox checked={!question.visible} label="?????????" />
                      </span>
                    )}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {question.questionItemType === QuestionItemType.Choice && (
                  <Table.Row>
                    <Table.Cell>????????????</Table.Cell>
                    <Table.Cell>
                      <Form.Group inline className="radio-inline">
                        <Form.Field>
                          <Radio
                            label="?????? ??????"
                            name={`radioGroup${index}`}
                            value="single"
                            checked={!(question.answerItems as ChoiceQuestionItems).multipleChoice}
                          />
                          <Radio
                            label="?????? ??????"
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
                  <Table.Cell>????????????</Table.Cell>
                  <Table.Cell>
                    <Form.Field>{this.createQuestionItemComponent(question, index)}</Form.Field>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          ))}
      </>
    );
  }
}
