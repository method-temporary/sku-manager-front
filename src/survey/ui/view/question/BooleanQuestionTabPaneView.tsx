import React from 'react';
import { Form, Tab, Button, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { QuestionModel } from '../../../form/model/QuestionModel';
import QuestionImageAddView from './QuestionImageAddView';
import toggleImage from '../../../../style/images/icon/btn_toggle_yesno_default.png';
import { Image } from 'shared/components';

interface Props {
  code: string;
  question: QuestionModel;
  index: number;
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
export class BooleanQuestionTabPaneView extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      isQuestionImageAdd: true,
      questionFileName: '',
    };
  }

  handleSentencesChange(question: QuestionModel, langCode: string, text: string) {
    const { index } = this.props;
    this.props.onChangeQuestionLangString(index, 'sentences', langCode, text);
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
    const { code, question } = this.props;

    const { isQuestionImageAdd, questionFileName } = this.state;

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
            // style={{ marginRight: '1rem' }}
            width={14}
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

          <Image src={toggleImage} style={{ width: '240px', display: 'block', marginTop: '10px' }} />
        </Form.Group>
      </Tab.Pane>
    );
  }
}
