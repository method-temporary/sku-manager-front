import React from 'react';
import { Divider, Form, Header, Input, Label } from 'semantic-ui-react';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import { SequenceModel } from '../../../../form/model/SequenceModel';
import { CriterionModel } from '../../../../form/model/CriterionModel';
import { CriterionQuestionItems } from '../../../../form/model/CriterionQuestionItems';
import { CriteriaItemModel } from '../../../../form/model/CriteriaItemModel';
import { reactAutobind } from '@nara.platform/accent';

interface Props {
  lang: string;
  question: QuestionModel;
  questionSequences: SequenceModel[];
  criterionList: CriterionModel[];
}

@reactAutobind
export default class ReadOnlyCriterionQuestionTabPaneView extends React.Component<Props> {
  render() {
    const { question, criterionList, lang } = this.props;

    const criterionQuestionItems = question.answerItems as CriterionQuestionItems;
    const selectedCriterion =
      criterionQuestionItems.criterionNumber &&
      criterionList.find((criterion) => criterion.number === criterionQuestionItems.criterionNumber);

    return (
      <>
        <Header size="tiny">질문</Header>
        {question.sentences.langStringMap.get(lang)}

        {criterionQuestionItems && criterionQuestionItems.criterionNumber && (
          <>
            <Divider />
            <Label content={`척도: ${criterionQuestionItems.criterionNumber}번`} basic />
            <br />
            {selectedCriterion &&
              selectedCriterion.criteriaItems.map((item: CriteriaItemModel) => (
                <Form.Group key={item.value} className="choice-question">
                  <Input maxLength={100} label={item.value} labelPosition="left" value={item.getName(lang)} readOnly />
                </Form.Group>
              ))}
          </>
        )}
      </>
    );
  }
}
