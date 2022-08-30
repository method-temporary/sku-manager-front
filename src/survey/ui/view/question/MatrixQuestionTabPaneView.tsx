import React from 'react';
import { observer } from 'mobx-react';
import { Divider, Form, Header, Input, InputOnChangeData, Tab } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { alert, AlertModel } from 'shared/components';

import { QuestionModel } from '../../../form/model/QuestionModel';
import { NumberValue } from '../../../form/model/NumberValue';
import { MatrixQuestionItems } from '../../../form/model/MatrixQuestionItems';
import QuestionImageAddView from './QuestionImageAddView';

interface Props {
  question: QuestionModel;
  code: string;
  index: number;
  onChangeQuestionProp: (index: number, prop: keyof QuestionModel, value: any) => void;
  onChangeQuestionLangString: (index: number, prop: string, lang: string, string: string) => void;
  onRemoveRowItem: (index: number, item: NumberValue) => void;
  onRemoveColumnItem: (index: number, item: NumberValue) => void;
  uploadFile: (file: File, uploadImageQuestionType: string, question: QuestionModel) => void;
  resetImage: (uploadImageQuestionType: string, question: QuestionModel) => void;
}

interface States {
  newRowItem: NumberValue;
  newColumnItem: NumberValue;
  isQuestionImageAdd: boolean;
  questionFileName: string;
}

@observer
@reactAutobind
export default class MatrixQuestionTabPaneView extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      newRowItem: new NumberValue(),
      newColumnItem: new NumberValue(),
      isQuestionImageAdd: true,
      questionFileName: '',
    };
  }

  handleSentencesChange(question: QuestionModel, langCode: string, text: string) {
    const { index } = this.props;
    this.props.onChangeQuestionLangString(index, 'sentences', langCode, text);
  }

  handleChangeNewRowItem(event: any, data: InputOnChangeData) {
    const newRowItem = new NumberValue();
    newRowItem.number = `${(this.props.question.answerItems as MatrixQuestionItems).rowItems.length + 1}`;
    newRowItem.values.langStringMap.set(this.props.code, data.value);

    this.setState(() => ({ newRowItem }));
  }

  handleChangeNewColumnItem(event: any, data: InputOnChangeData) {
    const newColumnItem = new NumberValue();
    newColumnItem.number = `${(this.props.question.answerItems as MatrixQuestionItems).columnItems.length + 1}`;
    newColumnItem.values.langStringMap.set(this.props.code, data.value);

    this.setState(() => ({ newColumnItem }));
  }

  handleSetState() {
    const newColumnItem = new NumberValue();
    newColumnItem.number = `${(this.props.question.answerItems as MatrixQuestionItems).columnItems.length + 1}`;

    this.setState(() => ({ newColumnItem }));
  }

  handleAddRowItem() {
    const { index } = this.props;
    const question = this.props.question;
    const matrixItems = { ...question.answerItems } as MatrixQuestionItems;
    matrixItems.rowItems = [...matrixItems.rowItems, this.state.newRowItem];

    const newRowItem = { ...this.state.newRowItem };

    if (
      newRowItem.values.langStringMap.get(this.props.code) === '' ||
      newRowItem.values.langStringMap.get(this.props.code) === undefined
    ) {
      alert(AlertModel.getRequiredInputAlert('응답 선택지'));
      return;
    }

    const newItemNumber = matrixItems.rowItems.length + 1;
    Promise.resolve()
      .then(() => {
        this.props.onChangeQuestionProp(index, 'answerItems', matrixItems);
      })
      .then(() =>
        this.setState(() => ({
          newRowItem: new NumberValue({ number: newItemNumber }),
        }))
      );
  }

  handleAddColumnItem() {
    const { index } = this.props;
    const question = this.props.question;
    const matrixItems = { ...question.answerItems } as MatrixQuestionItems;

    const newColumnItem = { ...this.state.newColumnItem };

    if (
      newColumnItem.values.langStringMap.get(this.props.code) === '' ||
      newColumnItem.values.langStringMap.get(this.props.code) === undefined
    ) {
      alert(AlertModel.getRequiredInputAlert('응답 선택지'));
      return;
    }

    matrixItems.columnItems = [...matrixItems.columnItems, this.state.newColumnItem];

    const newItemNumber = matrixItems.columnItems.length + 1;
    Promise.resolve()
      .then(() => {
        this.props.onChangeQuestionProp(index, 'answerItems', matrixItems);
      })
      .then(() =>
        this.setState(() => ({
          newColumnItem: new NumberValue({ number: newItemNumber }),
        }))
      );
  }

  onAddQuestionImage() {
    this.setState({
      isQuestionImageAdd: true,
    });
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
    const {
      code,
      question,
      index: questionIndex,
      onChangeQuestionLangString,
      onRemoveRowItem,
      onRemoveColumnItem,
    } = this.props;

    const { newRowItem, newColumnItem, isQuestionImageAdd, questionFileName } = this.state;

    const matrixItems = question.answerItems as MatrixQuestionItems;

    return (
      <Tab.Pane key={`choice-${question.id}-${questionIndex}-${code}`}>
        <Header size="tiny">질문</Header>
        <Input
          maxLength={2000}
          placeholder="질문을 입력해 주세요."
          defaultValue={question.sentences.langStringMap.get(code)}
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
        <Header size="tiny">행</Header>
        <Input
          maxLength={2000}
          fluid
          action={{
            icon: { name: 'plus', link: true },
            onClick: this.handleAddRowItem,
          }}
          placeholder="응답 선택지를 입력해 주세요."
          value={newRowItem.values.langStringMap.get(code) || ''}
          onChange={this.handleChangeNewRowItem}
        />

        {matrixItems.rowItems.map((item, index) => (
          <Form.Group key={`row-${questionIndex}-item-${index}`} className="choice-question">
            <Form.Field width={10}>
              <Input
                action={{
                  onClick: () => {
                    this.handleSetState();
                    onRemoveRowItem(questionIndex, item);
                  },
                  icon: 'cancel',
                }}
                label={index + 1}
                placeholder="응답 선택지를 입력해 주세요."
                value={item.values.langStringMap.get(code)}
                onChange={(event, data) =>
                  onChangeQuestionLangString(questionIndex, `answerItems.rowItems[${index}].values`, code, data.value)
                }
                maxLength={2000}
              />
            </Form.Field>
          </Form.Group>
        ))}
        <Divider />
        <Header size="tiny">열</Header>
        <Input
          maxLength={2000}
          fluid
          action={{
            icon: { name: 'plus', link: true },
            onClick: this.handleAddColumnItem,
          }}
          placeholder="응답 선택지를 입력해 주세요."
          value={newColumnItem.values.langStringMap.get(code) || ''}
          onChange={this.handleChangeNewColumnItem}
        />

        {matrixItems.columnItems.map((item, index) => (
          <Form.Group key={`column-${questionIndex}-item-${index}`} className="choice-question">
            <Form.Field width={10}>
              <Input
                action={{
                  onClick: () => {
                    this.handleSetState();
                    onRemoveColumnItem(questionIndex, item);
                  },
                  icon: 'cancel',
                }}
                label={index + 1}
                placeholder="응답 선택지를 입력해 주세요."
                value={item.values.langStringMap.get(code)}
                onChange={(event, data) =>
                  onChangeQuestionLangString(
                    questionIndex,
                    `answerItems.columnItems[${index}].values`,
                    code,
                    data.value
                  )
                }
                maxLength={2000}
              />
            </Form.Field>
          </Form.Group>
        ))}
      </Tab.Pane>
    );
  }
}
