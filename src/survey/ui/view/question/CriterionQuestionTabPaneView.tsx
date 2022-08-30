import React from 'react';
import { Divider, Form, Label, Tab } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { QuestionModel } from '../../../form/model/QuestionModel';
import { CriterionModel } from '../../../form/model/CriterionModel';
import { CriterionQuestionItems } from '../../../form/model/CriterionQuestionItems';

interface Props {
  code: string;
  question: QuestionModel;
  index: number;
  criterionList: CriterionModel[];
  onChangeQuestionProp: (index: number, prop: string, value: any) => void;
  onChangeQuestionLangString: (index: number, prop: string, lang: string, string: string) => void;
}

@observer
export default class CriterionQuestionTabPaneView extends React.Component<Props> {
  handleSentencesChange(question: QuestionModel, langCode: string, text: string) {
    const { index } = this.props;
    this.props.onChangeQuestionLangString(index, 'sentences', langCode, text);
  }

  render() {
    const { code, question, index, criterionList, onChangeQuestionProp } = this.props;

    const selectOptions = criterionList.map((criterion) => ({
      key: criterion.number,
      text: `${criterion.number}번`,
      value: criterion.number,
    }));

    const criterionQuestionItems = question.answerItems as CriterionQuestionItems;
    const selectedCriterion =
      criterionQuestionItems.criterionNumber &&
      criterionList.find((criterion) => criterion.number === criterionQuestionItems.criterionNumber);

    return (
      <Tab.Pane key={`${question.id}-${code}`}>
        <Form.Group>
          <Form.Input
            maxLength={2000}
            label="질문"
            labelPosition="left"
            placeholder="질문을 입력해 주세요."
            defaultValue={question.sentences.langStringMap.get(code)}
            onChange={(event, data) => this.handleSentencesChange(question, code, data.value)}
            width={11}
          />
          <Form.Select
            label="척도"
            placeholder="선택"
            options={selectOptions}
            defaultValue={criterionQuestionItems.criterionNumber}
            onChange={(event, data) => onChangeQuestionProp(index, 'answerItems.criterionNumber', data.value)}
          />
        </Form.Group>
        {criterionQuestionItems && criterionQuestionItems.criterionNumber && (
          <>
            <Divider />
            {selectedCriterion &&
              selectedCriterion.criteriaItems.map((item) => (
                <Label
                  key={item.value}
                  content={`${item.value}번: ${item.names.langStringMap.get(code) || 'No Text'}`}
                  basic
                />
              ))}
          </>
        )}
      </Tab.Pane>
    );
  }
}
