import React from 'react';
import { Divider, Form, Header, Input } from 'semantic-ui-react';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import { SequenceModel } from '../../../../form/model/SequenceModel';
import { CriterionModel } from '../../../../form/model/CriterionModel';
import { CriterionQuestionItems } from '../../../../form/model/CriterionQuestionItems';
import { CriteriaItemModel } from '../../../../form/model/CriteriaItemModel';
import AnswerSummaryModel from '../../../../analysis/model/AnswerSummaryModel';
import { CriteriaSummaryItems } from '../../../../analysis/model/CriteriaSummaryItems';

interface Props {
  lang: string;
  question: QuestionModel;
  questionSequences: SequenceModel[];
  criterionList: CriterionModel[];
  answerSummary: AnswerSummaryModel;
}

export default class SummaryCriterionQuestionView extends React.Component<Props> {
  render() {
    const { question, answerSummary, criterionList, lang } = this.props;

    const criterionQuestionItems = question.answerItems as CriterionQuestionItems;
    const summaryItems = answerSummary.summaryItems as CriteriaSummaryItems;
    const selectedCriterion =
      criterionQuestionItems.criterionNumber &&
      criterionList.find((criterion) => criterion.number === criterionQuestionItems.criterionNumber);

    return (
      <>
        <Header size="tiny">질문</Header>
        {question.getSentence(lang)}

        {criterionQuestionItems && criterionQuestionItems.criterionNumber && (
          <>
            <Divider />
            {selectedCriterion &&
              selectedCriterion.criteriaItems.map((item: CriteriaItemModel) => {
                const count =
                  (summaryItems.criteriaItemCountMap && summaryItems.criteriaItemCountMap.get(`${item.index}`)) || 0;
                return (
                  <Form.Group key={item.value} className="choice-question">
                    <Input
                      maxLength={100}
                      label={item.value}
                      labelPosition="left"
                      value={`${item.getName(lang)} (${count})`}
                      readOnly
                    />
                  </Form.Group>
                );
              })}
          </>
        )}
      </>
    );
  }
}
