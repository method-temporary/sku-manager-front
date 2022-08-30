import React from 'react';
import { observer } from 'mobx-react';
import { Divider, Form, Header, Input, Tab } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { Language } from 'shared/components/Polyglot';

import { QuestionModel } from '../../../form/model/QuestionModel';
import { NumberValue } from '../../../form/model/NumberValue';
import { ReviewQuestionItems } from 'survey/form/model/ReviewQuestionItems';

interface Props {
  question: QuestionModel;
  code: string;
  index: number;
  onChangeQuestionProp: (index: number, prop: keyof QuestionModel, value: any) => void;
  onChangeQuestionLangString: (index: number, prop: string, lang: string, string: string) => void;
}

@observer
@reactAutobind
export default class ReviewQuestionTabPaneView extends React.Component<Props> {
  //
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    const { code, question, index } = this.props;

    //handleSentencesChange
    this.props.onChangeQuestionLangString(index, 'sentences', Language.Ko, '이 과정은 다른 사람에게도 추천하고 싶다.');
    this.props.onChangeQuestionLangString(
      index,
      'sentences',
      Language.En,
      'I would like to recommend this course to other learners.'
    );
    this.props.onChangeQuestionLangString(index, 'sentences', Language.Zh, '想把这个课程推荐给其他成员。');

    if (question.answerItems === undefined || (question.answerItems as ReviewQuestionItems).items.length === 0) {
      Promise.resolve()
        .then(() => this.addAnswerItem(['전혀 아니다', 'Not at all', '完全不是']))
        .then(() => this.addAnswerItem(['아니다', 'Disagree', '不是']))
        .then(() => this.addAnswerItem(['보통이다', 'Average', '一般']))
        .then(() => this.addAnswerItem(['그렇다', 'Agree', '如此']))
        .then(() => this.addAnswerItem(['매우 그렇다', 'Highly agree', '非常如此']));
    }
  }

  addAnswerItem(value: string[]) {
    //handleChangeNewAnswerItem
    const newAnswerItem = new NumberValue();
    newAnswerItem.number = `${(this.props.question.answerItems as ReviewQuestionItems).items.length + 1}`;
    newAnswerItem.values.langStringMap.set(Language.Ko, value[0]);
    newAnswerItem.values.langStringMap.set(Language.En, value[1]);
    newAnswerItem.values.langStringMap.set(Language.Zh, value[2]);

    //handleAddAnswerItem
    const { index } = this.props;
    const question = this.props.question;
    const answerItems = { ...question.answerItems } as ReviewQuestionItems;
    answerItems.items = [...answerItems.items, newAnswerItem];

    Promise.resolve().then(() => {
      this.props.onChangeQuestionProp(index, 'answerItems', answerItems);
    });
  }

  render() {
    const { code, question, index: questionIndex } = this.props;

    const answerItems = question.answerItems as ReviewQuestionItems;

    return (
      <Tab.Pane key={`review-${question.id}-${questionIndex}-${code}`}>
        <Header size="tiny">질문</Header>
        {question.sentences.langStringMap.get(code) || ''}
        <Divider />
        {answerItems.items.map((item, index) => (
          <Form.Group key={`question-${questionIndex}-item-${index}`} className="choice-question">
            <Input label={index + 1} value={item.values.langStringMap.get(code)} maxLength={100} readOnly />
          </Form.Group>
        ))}
        주관식 답변 (200자 이내)
      </Tab.Pane>
    );
  }
}
