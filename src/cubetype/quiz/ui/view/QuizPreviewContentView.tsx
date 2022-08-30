import QuizQuestions from 'cubetype/quiz/model/QuizQuestions';
import React from 'react';
import { Checkbox, Radio, Form, TextArea } from 'semantic-ui-react';

const QuizPreviewContentView = ({
  data,
  currentIndex,
}: {
  data: QuizQuestions[] | undefined;
  currentIndex: number;
}) => {
  return (
    <div className="quiz-preview-result">
      <ul style={{ height: '285px', overflow: 'auto' }}>
        <li className="result-title">
          <div>
            <span style={{ display: 'inline-block' }}>
              {data && data[currentIndex].img !== '' && (
                <img style={{ maxWidth: '100%' }} src={`/${data[currentIndex]?.img}`} />
              )}
            </span>
            <span>{`(${currentIndex + 1} / ${data?.length})`}</span>
            <div
              dangerouslySetInnerHTML={
                data && {
                  __html: data[currentIndex]?.text,
                }
              }
            />
          </div>
        </li>
        {data &&
          data[currentIndex] &&
          (data[currentIndex].type === 'SingleChoice' || data[currentIndex].type === 'MultipleChoice') &&
          data[currentIndex].quizQuestionItems?.map((row, index) => {
            return (
              <li className="quiz-row" key={index} style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                {data[currentIndex].type === 'MultipleChoice' ? (
                  <Checkbox checked={row?.answerItem} style={{ marginTop: '15px' }} readOnly />
                ) : data[currentIndex].type === 'SingleChoice' ? (
                  <Radio checked={row?.answerItem} style={{ marginRight: '15px' }} readOnly />
                ) : null}
                <span
                  dangerouslySetInnerHTML={{
                    __html: row?.text,
                  }}
                />
                {row.img !== '' && (
                  <span style={{ display: 'inline-block', maxWidth: '50px', marginLeft: 'auto' }}>
                    <img src={`/${row.img}`} style={{ maxWidth: '100%' }} />
                  </span>
                )}
              </li>
            );
          })}
        {data && (data[currentIndex].type === 'ShortAnswer' || data[currentIndex].type === 'Essay') && (
          <Form.Field
            width={1}
            control="Input"
            placeholder={data[currentIndex].type === 'ShortAnswer' ? '단답형 사용자 입력란' : '서술형 사용자 입력란'}
            value=""
            style={{ height: '100px', fontSize: '14px', textAlign: 'center' }}
            disabled
          />
        )}
      </ul>
    </div>
  );
};

export default QuizPreviewContentView;
