import React, { useRef } from 'react';
import { Button, Form, Table, Radio, Input, Checkbox } from 'semantic-ui-react';
import { HtmlEditor } from 'shared/ui';
import QuizItem from 'cubetype/quiz/model/QuizItem';
import { QuillModel } from 'cubetype/quiz/model/SelectType';

interface Props extends QuizItem {
  answerCheck: boolean;
  quizType: string;
  quizRowIndex: number;
  length: number;
  quizIndex: number;
  onAddQuizRow: () => void;
  onDeleteQuizRow: (quizRowIndex: number) => void;
  onChangeQuizAnswer: (type: string, value: boolean, quizRowIndex: number) => void;
  onChangeQuizAnswerText: (type: string, quizAnswerText: string, quizRowIndex: number) => void;
  onChangeResultViewCheck: () => void;
  onChangeResultSubText: (text: string) => void;
  onChangeQuizAnswerImage: (type: string, e: any, quizRowIndex: number) => void;
}

const QuizTableChoiceRowView: React.FC<Props> = ({
  answerCheck,
  quizType,
  quizRowIndex,
  answerItem,
  img,
  text,
  number,
  length,
  quizIndex,
  onAddQuizRow,
  onDeleteQuizRow,
  onChangeQuizAnswer,
  onChangeQuizAnswerText,
  onChangeResultViewCheck,
  onChangeResultSubText,
  onChangeQuizAnswerImage,
}) => {
  const FileInputRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef(null);

  return (
    <Table.Row>
      {answerCheck && quizType === 'SingleChoice' ? (
        <Table.Cell style={{ textAlign: 'center' }}>
          <Radio
            id={`questions-${quizIndex}-${quizRowIndex}`}
            name={`questions-${quizIndex}-${quizRowIndex}`}
            checked={answerItem === true}
            onChange={() => onChangeQuizAnswer('answerItem', answerItem, quizRowIndex)}
          />
        </Table.Cell>
      ) : answerCheck && quizType === 'MultipleChoice' ? (
        <Table.Cell style={{ textAlign: 'center' }}>
          <Checkbox
            value={`questionsCheckbox-${quizIndex}`}
            checked={answerItem === true}
            onChange={() => onChangeQuizAnswer('answerItem', answerItem, quizRowIndex)}
          />
        </Table.Cell>
      ) : null}
      <>
        <Table.Cell className="tb-header" style={{ textAlign: 'center' }}>
          답변
          <br />
          번호
        </Table.Cell>
        <Table.Cell>
          <Form.Field
            width={1}
            control={Input}
            value={number}
            onChange={(e: any) => console.log(e)}
            style={{ margin: 0, textAlign: 'center' }}
          />
        </Table.Cell>
        <Table.Cell className="tb-header" style={{ textAlign: 'center' }}>
          내용
        </Table.Cell>
        <Table.Cell colSpan={5} className="pop-editor">
          <HtmlEditor
            quillRef={(el) => (answerRef.current = el)}
            modules={QuillModel.modules}
            formats={QuillModel.formats}
            value={text}
            height={85}
            quizEditor={true}
            onChange={(html) => onChangeQuizAnswerText('text', html === '<p><br></p>' ? '' : html, quizRowIndex)}
          />
          <Button
            className="file-select-btn"
            content="파일 선택"
            labelPosition="left"
            icon="file"
            onClick={() => {
              if (FileInputRef && FileInputRef.current) {
                FileInputRef.current.click();
              }
            }}
          />
          <input
            id="file"
            type="file"
            ref={FileInputRef}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeQuizAnswerImage('img', e, quizRowIndex)}
            hidden
          />
          {img !== '' && <span style={{ display: 'inlineBlock', marginLeft: '10px' }}>{img}</span>}
        </Table.Cell>
        <Table.Cell>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {quizRowIndex === length! - 1 && quizRowIndex < 20 && (
              <Button
                style={{
                  padding: '5px',
                  width: '20px',
                  height: '20px',
                  lineHeight: '10px',
                }}
                onClick={onAddQuizRow}
              >
                +
              </Button>
            )}
            {quizRowIndex > 0 && (
              <Button
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '5px',
                  margin: 0,
                  width: '20px',
                  height: '20px',
                }}
                onClick={() => onDeleteQuizRow(quizRowIndex)}
              >
                -
              </Button>
            )}
          </div>
        </Table.Cell>
      </>
    </Table.Row>
  );
};

export default React.memo(QuizTableChoiceRowView);
