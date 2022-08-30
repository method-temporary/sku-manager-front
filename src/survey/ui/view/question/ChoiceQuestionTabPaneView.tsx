import React from 'react';
import { observer } from 'mobx-react';
import { Divider, Form, Header, Input, InputOnChangeData, Tab, Segment } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { Image, alert, AlertModel } from 'shared/components';

import { QuestionModel } from '../../../form/model/QuestionModel';
import { NumberValue } from '../../../form/model/NumberValue';
import { AnswerImageUrlModel } from '../../../form/model/AnswerImageUrlModel';
import { ChoiceQuestionItems } from '../../../form/model/ChoiceQuestionItems';
import QuestionImageAddView from './QuestionImageAddView';

interface Props {
  question: QuestionModel;
  code: string;
  index: number;
  onChangeQuestionProp: (index: number, prop: keyof QuestionModel, value: any) => void;
  onChangeQuestionLangString: (index: number, prop: string, lang: string, string: string) => void;
  onRemoveAnswerItem: (index: number, item: NumberValue) => void;
  uploadFile: (file: File, uploadImageQuestionType: string, question: QuestionModel) => void;
  resetImage: (uploadImageQuestionType: string, question: QuestionModel) => void;
}

interface States {
  newAnswerItem: NumberValue;
  isQuestionImageAdd: boolean;
  isAnswerImageAdd: boolean;
  questionFileName: string;
  answerFileName: string;
  answerNameLength: number;
}

@observer
@reactAutobind
export default class ChoiceQuestionTabPaneView extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      newAnswerItem: new NumberValue(),
      isQuestionImageAdd: true,
      isAnswerImageAdd: true,
      questionFileName: '',
      answerFileName: '',
      answerNameLength: 0,
    };
  }

  handleSentencesChange(question: QuestionModel, langCode: string, text: string) {
    const { index } = this.props;
    this.props.onChangeQuestionLangString(index, 'sentences', langCode, text);
  }

  handleChangeNewAnswerItem(event: any, data: InputOnChangeData) {
    // 객관식 응답선택지 입력 글자수 제한
    if (event.target.value.length > 2000) return;
    this.setState({ answerNameLength: event.target.value.length });

    const newAnswerItem = new NumberValue();
    newAnswerItem.number = `${(this.props.question.answerItems as ChoiceQuestionItems).items.length + 1}`;
    newAnswerItem.values.langStringMap.set(this.props.code, data.value);

    this.setState(() => ({ newAnswerItem }));
  }

  handleSetState() {
    const newAnswerItem = new NumberValue();
    newAnswerItem.number = `${(this.props.question.answerItems as ChoiceQuestionItems).items.length + 1}`;
    this.setState(() => ({ newAnswerItem }));
  }

  handleAddAnswerItem() {
    const { index } = this.props;
    const question = this.props.question;
    const answerItems = { ...question.answerItems } as ChoiceQuestionItems;
    answerItems.items = [...answerItems.items, this.state.newAnswerItem];

    const newAnswerItem = { ...this.state.newAnswerItem };

    if (
      newAnswerItem.values.langStringMap.get(this.props.code) === '' ||
      newAnswerItem.values.langStringMap.get(this.props.code) === undefined
    ) {
      alert(AlertModel.getRequiredInputAlert('응답 선택지'));
      return;
    }

    const newAnswerImageUrl = new AnswerImageUrlModel();
    newAnswerImageUrl.number = `${(this.props.question.answerItems as ChoiceQuestionItems).items.length + 1}`;
    newAnswerImageUrl.imageUrl = question.answerImageUrl;
    answerItems.imageUrls = [...answerItems.imageUrls, newAnswerImageUrl];

    const newItemNumber = answerItems.items.length + 1;
    Promise.resolve()
      .then(() => {
        this.props.onChangeQuestionProp(index, 'answerItems', answerItems);
        this.resetAnswerImage();
      })
      .then(() =>
        this.setState(() => ({
          newAnswerItem: new NumberValue({ number: newItemNumber }),
        }))
      );
  }

  onAddQuestionImage() {
    this.setState({
      isQuestionImageAdd: true,
    });
  }

  onAddAnswerImage() {
    this.setState({
      isAnswerImageAdd: true,
    });
  }

  uploadQuestionFile(file: File) {
    const question = this.props.question;
    this.props.uploadFile(file, 'question', question);
  }

  uploadAnswerFile(file: File) {
    const question = this.props.question;
    this.props.uploadFile(file, 'answer', question);
  }

  resetQuestionImage() {
    const question = this.props.question;
    this.props.resetImage('question', question);
  }

  resetAnswerImage() {
    const question = this.props.question;
    this.props.resetImage('answer', question);
  }

  render() {
    const { code, question, index: questionIndex, onChangeQuestionLangString, onRemoveAnswerItem } = this.props;

    const { newAnswerItem, isQuestionImageAdd, isAnswerImageAdd, questionFileName, answerFileName, answerNameLength } =
      this.state;

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
        <div style={{ position: 'relative', margin: '40px 0' }}>
          <span
            className="count"
            style={{ position: 'absolute', right: 0, top: '-2rem', fontSize: '0.875rem', color: '#999' }}
          >
            <span className="now" style={{ color: '#333' }}>
              {answerNameLength}
            </span>
            /<span className="max">2000</span>
          </span>
        </div>
        <Input
          maxLength={2000}
          fluid
          action={{
            icon: { name: 'plus', link: true },
            onClick: this.handleAddAnswerItem,
          }}
          placeholder="응답 선택지를 입력해 주세요. (2000자 까지 입력가능)"
          value={newAnswerItem.values.langStringMap.get(code) || ''}
          onChange={this.handleChangeNewAnswerItem}
        />
        {/*
        <Button icon basic onClick={() => this.onAddAnswerImage()}>
          <Icon name="plus" /> 이미지 추가
        </Button>
        */}
        {isAnswerImageAdd ? (
          <QuestionImageAddView
            uploadFile={this.uploadAnswerFile}
            resetImage={this.resetAnswerImage}
            imageUrl={question.answerImageUrl}
            fileName={answerFileName}
          />
        ) : null}
        {answerItems.items.map((item, index) => (
          <Form.Group key={`question-${questionIndex}-item-${index}`} className="choice-question">
            <Form.Field width={10}>
              <Input
                action={{
                  onClick: () => {
                    this.handleSetState();
                    onRemoveAnswerItem(questionIndex, item);
                  },
                  icon: 'cancel',
                }}
                label={index + 1}
                placeholder="응답 선택지를 입력해 주세요."
                value={item.values.langStringMap.get(code)}
                onChange={(event, data) =>
                  onChangeQuestionLangString(questionIndex, `answerItems.items[${index}].values`, code, data.value)
                }
                maxLength={100}
              />
            </Form.Field>
            {answerItems.imageUrls && answerItems.imageUrls.length > 0 && answerItems.imageUrls[index].imageUrl ? (
              <Segment.Inline>
                <Image src={answerItems.imageUrls[index].imageUrl} size="small" verticalAlign="bottom" />
              </Segment.Inline>
            ) : null}

            {/* 연결 문항 기능 불필요 */}
            {/*<Form.Field>*/}
            {/*  <Select placeholder="연결 문항" options={dropdownItems} />*/}
            {/*</Form.Field>*/}

            {/*<Form.Field>*/}
            {/*  <Button icon onClick={() => onRemoveAnswerItem(questionIndex, item)}> <Icon name="times" /></Button>*/}
            {/*</Form.Field>*/}
          </Form.Group>
        ))}
      </Tab.Pane>
    );
  }
}
