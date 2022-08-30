import React from 'react';
import { observer } from 'mobx-react';
import { Divider, Form, Header, Input, Tab } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { Language } from 'shared/components/Polyglot';

import { QuestionModel } from '../../../form/model/QuestionModel';
import { NumberValue } from '../../../form/model/NumberValue';
import { ChoiceQuestionItems } from '../../../form/model/ChoiceQuestionItems';
import QuestionImageAddView from './QuestionImageAddView';
import { QuestionItemType } from 'survey/form/model/QuestionItemType';
import { ChoiceFixedQuestionItems } from 'survey/form/model/ChoiceFixedQuestionItems';

interface Props {
  question: QuestionModel;
  code: string;
  index: number;
  onChangeQuestionProp: (index: number, prop: keyof QuestionModel, value: any) => void;
  onChangeQuestionLangString: (index: number, prop: string, lang: string, string: string) => void;
  uploadFile: (file: File, uploadImageQuestionType: string, question: QuestionModel) => void;
  resetImage: (uploadImageQuestionType: string, question: QuestionModel) => void;
}

interface States {
  isQuestionImageAdd: boolean;
  questionFileName: string;
}

@observer
@reactAutobind
export default class ChoiceFixedQuestionTabPaneView extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      isQuestionImageAdd: true,
      questionFileName: '',
    };
  }

  componentDidMount() {
    const { question } = this.props;

    if (question.answerItems === undefined || (question.answerItems as ChoiceFixedQuestionItems).items.length === 0) {
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
    newAnswerItem.number = `${(this.props.question.answerItems as ChoiceFixedQuestionItems).items.length + 1}`;
    newAnswerItem.values.langStringMap.set(Language.Ko, value[0]);
    newAnswerItem.values.langStringMap.set(Language.En, value[1]);
    newAnswerItem.values.langStringMap.set(Language.Zh, value[2]);

    //handleAddAnswerItem
    const { index } = this.props;
    const question = this.props.question;
    const answerItems = { ...question.answerItems } as ChoiceFixedQuestionItems;
    answerItems.items = [...answerItems.items, newAnswerItem];

    answerItems.answerType = QuestionItemType.Review;

    Promise.resolve().then(() => {
      this.props.onChangeQuestionProp(index, 'answerItems', answerItems);
    });
  }

  handleSentencesChange(question: QuestionModel, langCode: string, text: string) {
    const { index } = this.props;
    this.props.onChangeQuestionLangString(index, 'sentences', langCode, text);
  }

  uploadQuestionFile(file: File) {
    const question = this.props.question;
    this.props.uploadFile(file, 'question', question);
  }

  resetQuestionImage() {
    const question = this.props.question;
    this.props.resetImage('question', question);
  }

  render() {
    const { code, question, index: questionIndex } = this.props;

    const { isQuestionImageAdd, questionFileName } = this.state;

    const answerItems = question.answerItems as ChoiceQuestionItems;

    return (
      <Tab.Pane key={`choice-${question.id}-${questionIndex}-${code}`}>
        <Header size="tiny">질문</Header>
        <Input
          maxLength={2000}
          placeholder="질문을 입력해 주세요."
          value={question.sentences.langStringMap.get(code) || ''}
          onChange={(event, data) => this.handleSentencesChange(question, code, data.value)}
          width={10}
        />
        {/*
        <Button icon basic onClick={() => this.onAddQuestionImage()}>
          <Icon name="plus" /> 이미지 추가
        </Button>
        */}
        {question.sentencesImageUrl || isQuestionImageAdd ? (
          <QuestionImageAddView
            uploadFile={this.uploadQuestionFile}
            resetImage={this.resetQuestionImage}
            imageUrl={question.sentencesImageUrl}
            fileName={questionFileName}
          />
        ) : null}
        <Divider />
        {answerItems.items?.map((item, index) => (
          <Form.Group key={`question-${questionIndex}-item-${index}`} className="choice-question">
            <Input label={index + 1} value={item.values.langStringMap.get(code)} maxLength={100} readOnly />
          </Form.Group>
        ))}
      </Tab.Pane>
    );
  }
}
