import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button, Form, Table, Select, Radio, Input, Checkbox } from 'semantic-ui-react';
import { HtmlEditor } from 'shared/ui';
import { upload } from 'cubetype/quiz/api/FileApi';
import { QuillModel, quizOptions } from 'cubetype/quiz/model/SelectType';
import QuizQuestions, { getEmptyQuizQuestions } from 'cubetype/quiz/model/QuizQuestions';
import QuizItem, { getEmptyQuizItem } from 'cubetype/quiz/model/QuizItem';
import QuizTableChoiceRowView from '../view/QuizTableChoiceRowView';

interface Props {
  quizContentState: QuizQuestions[] | undefined;
  setQuizContentState: (state: any) => void;
}

const QuizTableLayout = React.memo(
  ({
    quiz,
    quizIndex,
    onDeleteQuizTable,
    onChangeQuizRow,
    onChangeContentState,
  }: {
    quiz: QuizQuestions;
    quizIndex: number;
    onDeleteQuizTable: (quizIndex: number) => void;
    onChangeQuizRow: (item: QuizItem[], quizIndex: number) => void;
    onChangeContentState: (type: string, value: any, quizIndex: number) => void;
  }) => {
    const QuizNameFileInputRef = useRef<HTMLInputElement>(null);
    const AlertFileInputRef = useRef<HTMLInputElement>(null);
    const PassAlertFileInputRef = useRef<HTMLInputElement>(null);
    const questionRef = useRef(null);
    const alertRef = useRef(null);
    const passAlertRef = useRef(null);
    const [quizRow, setQuizRow] = useState<QuizItem[]>(quiz.quizQuestionItems || []);

    useEffect(() => {
      quizRow && onChangeQuizRow(quizRow, quizIndex);
    }, [quizRow]);

    const onChangeQuizNameFile = useCallback(
      async (e: any) => {
        await upload(e)?.then((thumbnailId) => {
          const filePath = `files/community/${thumbnailId}`;
          onChangeContentState('img', filePath, quizIndex);
        });
      },
      [quiz]
    );

    const onChangeQuizAlertFile = useCallback(
      async (e: any) => {
        await upload(e)?.then((thumbnailId) => {
          const filePath = `files/community/${thumbnailId}`;
          onChangeContentState(
            'alert',
            {
              failMessage: quiz.alertMessage.failMessage,
              failImg: filePath,
              passMessage: quiz.alertMessage.passMessage,
              passImg: quiz.alertMessage.passImg,
            },
            quizIndex
          );
        });
      },
      [quiz]
    );

    const onChangeQuizPassAlertFile = useCallback(
      async (e: any) => {
        await upload(e)?.then((thumbnailId) => {
          const filePath = `files/community/${thumbnailId}`;
          onChangeContentState(
            'passAlert',
            {
              failMessage: quiz.alertMessage.failMessage,
              failImg: quiz.alertMessage.failImg,
              passMessage: quiz.alertMessage.passMessage,
              passImg: filePath,
            },
            quizIndex
          );
        });
      },
      [quiz]
    );

    const onChangeQuizName = useCallback(
      (html) => {
        const name = html === '<p><br></p>' ? '' : html;
        onChangeContentState('text', name, quizIndex);
      },
      [quiz]
    );

    const onChangeQuizType = useCallback(
      (type: string) => {
        if (type === 'ShortAnswer' || type === 'Essay') {
          setQuizRow(quizRow?.splice(0, quizRow.length - 1));
          onChangeContentState('answer', false, quizIndex);
        }
        setQuizRow(quizRow?.map((row, index) => ({ ...row, answerItem: false })));
        onChangeContentState('type', type, quizIndex);
      },
      [quiz]
    );

    const onChangeAnswerType = useCallback(
      (type: boolean) => {
        onChangeContentState('answer', type, quizIndex);
      },
      [quiz]
    );

    const onChangeResultViewCheck = useCallback(() => {
      onChangeContentState('resultView', quiz.resultView, quizIndex);
    }, [quiz]);

    const onChangeResultSubText = useCallback(
      (text: string) => {
        onChangeContentState('subText', text, quizIndex);
      },
      [quiz]
    );

    const onChangeAlertMessage = useCallback(
      (html) => {
        const text = html === '<p><br></p>' ? '' : html;
        onChangeContentState(
          'alert',
          {
            passMessage: quiz.alertMessage.passMessage,
            passImg: quiz.alertMessage.passImg,
            failMessage: text,
            failImg: quiz.alertMessage.failImg,
          },
          quizIndex
        );
      },
      [quiz]
    );

    const onChangePassAlertMessage = useCallback(
      (html) => {
        const text = html === '<p><br></p>' ? '' : html;
        onChangeContentState(
          'passAlert',
          {
            failMessage: quiz.alertMessage.failMessage,
            failImg: quiz.alertMessage.failImg,
            passMessage: text,
            passImg: quiz.alertMessage.passImg,
          },
          quizIndex
        );
      },
      [quiz]
    );

    const onAddQuizRow = useCallback(() => {
      const newQuizItem = getEmptyQuizItem();
      quizRow?.push(newQuizItem);
      quizRow?.forEach((row, index) => (row.number = index + 1));
      quizRow && setQuizRow([...quizRow]);
    }, [quizRow]);

    const onDeleteQuizRow = useCallback(
      (quizRowIndex: number) => {
        setQuizRow((prevRow) => prevRow?.filter((quiz, index) => index !== quizRowIndex));
      },
      [quizRow]
    );

    const onChangeQuizAnswer = useCallback(
      (type: string, value: boolean, quizRowIndex: number) => {
        if (quiz.type === 'SingleChoice') {
          setQuizRow(
            quizRow?.map((row, index) =>
              quizRowIndex === index ? { ...row, [type]: value ? false : true } : { ...row, [type]: false }
            )
          );
        } else if (quiz.type === 'MultipleChoice') {
          setQuizRow(
            quizRow?.map((row, index) =>
              quizRowIndex === index ? { ...row, [type]: value ? false : true } : { ...row }
            )
          );
        }
      },
      [quizRow]
    );

    const onChangeQuizAnswerText = useCallback(
      (type: string, quizAnswerText: string, quizRowIndex: number) => {
        setQuizRow(
          quizRow?.map((row, index) => (quizRowIndex === index ? { ...row, [type]: quizAnswerText } : { ...row }))
        );
      },
      [quizRow]
    );

    const onChangeQuizAnswerImage = useCallback(
      async (type: string, e: any, quizRowIndex: number) => {
        await upload(e)?.then((thumbnailId) => {
          const filePath = `files/community/${thumbnailId}`;
          setQuizRow(
            quizRow?.map((row, index) => (quizRowIndex === index ? { ...row, [type]: filePath } : { ...row }))
          );
        });
      },
      [quizRow]
    );

    const colgroupChange = () => {
      if (quiz.answer && (quiz.type === 'SingleChoice' || quiz.type === 'MultipleChoice')) {
        return (
          <>
            {/*<col width="85px" />*/}
            {/*<col width="85px" />*/}
            {/*<col width="85px" />*/}
            {/*<col width="85px" />*/}
            {/*<col width="auto" />*/}
            {/*<col width="85px" />*/}

            <col width="85px" />
            <col />
            <col />
            <col />
            <col />
            <col />
          </>
        );
      } else if (!quiz.answer && (quiz.type === 'SingleChoice' || quiz.type === 'MultipleChoice')) {
        return (
          <>
            {/*<col width="85px" />*/}
            {/*<col width="85px" />*/}
            {/*<col width="85px" />*/}
            {/*<col width="auto" />*/}
            {/*<col width="85px" />*/}
            <col width="85px" />
            <col />
            <col />
            <col />
            <col />
          </>
        );
      } else {
        return (
          <>
            <col width="85px" />
            <col width="auto" />
          </>
        );
      }
    };

    return (
      <div className="table-wrapper">
        <Table celled>
          <colgroup>
            <col width="85px" />
            <col width="330px" />
            <col width="70px" />
            <col width="225px" />
            <col width="70px" />
            <col width="auto" />
          </colgroup>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header" style={{ textAlign: 'center' }}>
                문항
              </Table.Cell>
              <Table.Cell>
                <Form.Group style={{ display: 'flex', position: 'relative' }}>
                  <Form.Field
                    width={1}
                    control={Input}
                    value={quizIndex + 1}
                    onChange={(e: any) => console.log(e)}
                    style={{ margin: 0 }}
                  />
                  <Button type="button" onClick={() => onDeleteQuizTable(quizIndex)} style={{ margin: '0 0 0 2px' }}>
                    문항삭제
                  </Button>
                </Form.Group>
              </Table.Cell>
              <Table.Cell className="tb-header" style={{ textAlign: 'center' }}>
                유형
              </Table.Cell>
              <Table.Cell>
                <Form.Group style={{ display: 'flex', position: 'relative' }}>
                  <Select
                    options={quizOptions}
                    value={
                      quiz?.type === 'SingleChoice'
                        ? quizOptions[0].value
                        : quiz?.type === 'MultipleChoice'
                        ? quizOptions[1].value
                        : quiz?.type === 'ShortAnswer'
                        ? quizOptions[2].value
                        : quiz?.type === 'Essay'
                        ? quizOptions[3].value
                        : quizOptions[1].value
                    }
                    style={{ margin: 0, width: '150px' }}
                    className="ui small-border dropdown"
                    onChange={(e: any, data: any) => onChangeQuizType(data.value)}
                  />
                </Form.Group>
              </Table.Cell>
              <Table.Cell className="tb-header" style={{ textAlign: 'center' }}>
                답안
              </Table.Cell>
              <Table.Cell>
                <Form.Group style={{ display: 'flex', position: 'relative' }}>
                  {(quiz.type === 'SingleChoice' || quiz.type === 'MultipleChoice') && (
                    <Form.Field
                      control={Radio}
                      label="정답체크형"
                      checked={quiz.answer === true}
                      onChange={() => onChangeAnswerType(true)}
                      style={{ marginRight: '10px' }}
                    />
                  )}
                  <Form.Field
                    control={Radio}
                    label="의견제시형"
                    checked={quiz.answer === false}
                    onChange={() => onChangeAnswerType(false)}
                  />
                </Form.Group>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header" style={{ textAlign: 'center' }}>
                문제
              </Table.Cell>
              <Table.Cell colSpan={5} className="pop-editor">
                <HtmlEditor
                  quillRef={(el) => (questionRef.current = el)}
                  modules={QuillModel.modules}
                  formats={QuillModel.formats}
                  value={
                    quiz.type === 'MultipleChoice' && quiz.answer && quiz.text === ''
                      ? '사용자 편의를 위해 문제와 함께 정답 갯수를 기재해주세요. ex) 보기 중 00개를 선택해 주세요.'
                      : quiz.text || ''
                  }
                  height={85}
                  quizEditor={true}
                  onChange={onChangeQuizName}
                />
                {/* <textarea value={quiz.text} /> */}
                <Button
                  className="file-select-btn"
                  content="파일 선택"
                  labelPosition="left"
                  icon="file"
                  onClick={() => {
                    if (QuizNameFileInputRef && QuizNameFileInputRef.current) {
                      QuizNameFileInputRef.current.click();
                    }
                  }}
                />
                <input
                  id="file"
                  type="file"
                  ref={QuizNameFileInputRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeQuizNameFile(e)}
                  hidden
                />
                {quiz.img !== '' && <span style={{ display: 'inlineBlock', marginLeft: '10px' }}>{quiz.img}</span>}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Table celled>
          <colgroup>{colgroupChange()}</colgroup>
          <Table.Body>
            {quizRow &&
              (quiz.type === 'SingleChoice' || quiz.type === 'MultipleChoice') &&
              quizRow?.map((row, index) => (
                <QuizTableChoiceRowView
                  key={index}
                  quizRowIndex={index}
                  answerCheck={quiz.answer}
                  quizType={quiz.type}
                  answerItem={row?.answerItem}
                  img={row?.img}
                  text={row?.text}
                  number={index + 1}
                  length={quizRow.length}
                  quizIndex={quizIndex}
                  onAddQuizRow={onAddQuizRow}
                  onDeleteQuizRow={onDeleteQuizRow}
                  onChangeQuizAnswer={onChangeQuizAnswer}
                  onChangeQuizAnswerText={onChangeQuizAnswerText}
                  onChangeResultViewCheck={onChangeResultViewCheck}
                  onChangeResultSubText={onChangeResultSubText}
                  onChangeQuizAnswerImage={onChangeQuizAnswerImage}
                />
              ))}
            {quiz.answer && (quiz.type === 'SingleChoice' || quiz.type === 'MultipleChoice') && (
              <Table.Row>
                <Table.Cell className="tb-header" style={{ textAlign: 'center' }}>
                  오답
                  <br />
                  메시지
                </Table.Cell>
                <Table.Cell colSpan={9} className="pop-editor">
                  <HtmlEditor
                    quillRef={(el) => (alertRef.current = el)}
                    modules={QuillModel.modules}
                    formats={QuillModel.formats}
                    value={quiz?.alertMessage.failMessage}
                    height={85}
                    quizEditor={true}
                    onChange={onChangeAlertMessage}
                  />

                  <Button
                    className="file-select-btn"
                    content="파일 선택"
                    labelPosition="left"
                    icon="file"
                    onClick={() => {
                      if (AlertFileInputRef && AlertFileInputRef.current) {
                        AlertFileInputRef.current.click();
                      }
                    }}
                  />
                  <input
                    id="file"
                    type="file"
                    ref={AlertFileInputRef}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeQuizAlertFile(e)}
                    hidden
                  />
                  {quiz?.alertMessage?.failImg !== '' && (
                    <span style={{ display: 'inlineBlock', marginLeft: '10px' }}>{quiz?.alertMessage?.failImg}</span>
                  )}
                </Table.Cell>
              </Table.Row>
            )}
            {quiz.answer && (quiz.type === 'SingleChoice' || quiz.type === 'MultipleChoice') && (
              <Table.Row>
                <Table.Cell className="tb-header" style={{ textAlign: 'center' }}>
                  정답
                  <br />
                  메시지
                </Table.Cell>
                <Table.Cell colSpan={9} className="pop-editor">
                  <HtmlEditor
                    quillRef={(el) => (passAlertRef.current = el)}
                    modules={QuillModel.modules}
                    formats={QuillModel.formats}
                    value={quiz?.alertMessage.passMessage}
                    height={85}
                    quizEditor={true}
                    onChange={onChangePassAlertMessage}
                  />

                  <Button
                    className="file-select-btn"
                    content="파일 선택"
                    labelPosition="left"
                    icon="file"
                    onClick={() => {
                      if (PassAlertFileInputRef && PassAlertFileInputRef.current) {
                        PassAlertFileInputRef.current.click();
                      }
                    }}
                  />
                  <input
                    id="file"
                    type="file"
                    ref={PassAlertFileInputRef}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeQuizPassAlertFile(e)}
                    hidden
                  />
                  {quiz?.alertMessage?.passImg !== '' && (
                    <span style={{ display: 'inlineBlock', marginLeft: '10px' }}>{quiz?.alertMessage?.passImg}</span>
                  )}
                </Table.Cell>
              </Table.Row>
            )}
            {quiz.answer && (quiz.type === 'SingleChoice' || quiz.type === 'MultipleChoice') ? null : (
              <Table.Row>
                <Table.Cell className="tb-header" style={{ textAlign: 'center' }}>
                  결과보기 화면
                  <br />
                  메세지
                </Table.Cell>
                <Table.Cell colSpan={9}>
                  <div style={{ marginBottom: '10px' }}>
                    <Checkbox
                      label="학습자 응답 결과 보기"
                      checked={quiz?.resultView}
                      onChange={onChangeResultViewCheck}
                    />
                  </div>
                  <textarea
                    // placeholder="다른 참여자의 의견을 확인해 보세요."
                    readOnly={quiz.resultView ? false : true}
                    value={quiz.resultView ? quiz.subText : '다른 참여자의 의견을 확인해 보세요.'}
                    onChange={(e: any) => onChangeResultSubText(e.target.value)}
                    style={
                      quiz.resultView
                        ? {
                            height: '85px',
                            padding: '10px',
                            resize: 'vertical',
                            borderRadius: '3px',
                            transition: 'background .3s',
                          }
                        : {
                            height: '85px',
                            padding: '10px',
                            resize: 'vertical',
                            borderRadius: '3px',
                            transition: 'background .3s',
                            background: 'rgba(0,0,0,0.3)',
                            cursor: 'default',
                          }
                    }
                  />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    );
  }
);

const CreateQuizTableContentContainer: React.FC<Props> = ({ quizContentState, setQuizContentState }) => {
  const onChangeContentState = useCallback(
    async (type: string, value: string | number | boolean, quizIndex: number) => {
      if (type === 'resultView') {
        setQuizContentState(
          quizContentState?.map((quiz, index) =>
            index === quizIndex
              ? { ...quiz, [type]: value ? false : true, subText: '다른 참여자의 의견을 확인해 보세요.' }
              : { ...quiz }
          )
        );
        return;
      }

      if (type === 'alert' || type === 'passAlert') {
        setQuizContentState(
          quizContentState?.map((quiz, index) => (index === quizIndex ? { ...quiz, alertMessage: value } : { ...quiz }))
        );
        return;
      }

      setQuizContentState(
        quizContentState?.map((quiz, index) => (index === quizIndex ? { ...quiz, [type]: value } : { ...quiz }))
      );
    },
    [quizContentState]
  );

  const onChangeQuizRow = useCallback(
    (item: QuizItem[], quizIndex: number) => {
      setQuizContentState(
        quizContentState?.map((quiz, index) =>
          index === quizIndex ? { ...quiz, quizQuestionItems: item } : { ...quiz }
        )
      );
    },
    [quizContentState]
  );

  const onDeleteQuizTable = useCallback(
    (quizIndex: number) => {
      if (quizContentState?.length === 1) {
        return;
      }

      if (quizContentState) {
        const filteredTable = quizContentState?.filter((quiz, index) => index !== quizIndex);
        filteredTable.forEach((row, index) => {
          row.number = index + 1;
          return row;
        });
        setQuizContentState(filteredTable);
      }
    },
    [quizContentState]
  );

  const onAddQuizTable = useCallback(() => {
    const newQuizTable = getEmptyQuizQuestions();
    if (quizContentState) {
      quizContentState?.push(newQuizTable);
      quizContentState.forEach((row, index) => {
        row.number = index + 1;
        return row;
      });
      setQuizContentState([...quizContentState]);
    }
  }, [quizContentState]);

  return (
    <>
      {quizContentState?.map((quiz, index) => (
        <QuizTableLayout
          key={index}
          quiz={quiz}
          quizIndex={index}
          onDeleteQuizTable={onDeleteQuizTable}
          onChangeQuizRow={onChangeQuizRow}
          onChangeContentState={onChangeContentState}
        />
      ))}
      <Button type="button" onClick={onAddQuizTable} style={{ position: 'absolute', right: 0, bottom: 0 }}>
        문항 추가
      </Button>
    </>
  );
};

export default React.memo(CreateQuizTableContentContainer);
