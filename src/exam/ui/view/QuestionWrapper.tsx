import React, { useCallback, useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { QuestionAnswer } from '../../viewmodel/TestSheetViewModel';
import { QuestionType } from 'exam/model/QuestionType';
import { Image } from 'shared/components';
import './previewModal.css';

interface QuestionWrapperProps {
  sequence: number;
  question: string;
  questionType: QuestionType;
  point: string;
  mandatory: boolean;
  groupName: string;
  imagePath: string;
  questionAnswer: QuestionAnswer;
  isCorrect?: boolean;
  children: React.ReactChild;
}

export function QuestionWrapper({
  sequence,
  question,
  questionType,
  point,
  mandatory,
  groupName,
  imagePath,
  questionAnswer,
  children,
  isCorrect,
}: QuestionWrapperProps) {
  const [open, setOpen] = useState<boolean>(false);

  const onClickOpen = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const correctStyle = isCorrect !== undefined && getCorrectStyle(questionType, isCorrect);
  const mandatoryText = (mandatory && '[필수]') || '';
  const groupNameText = (groupName && groupName) || '';
  const answerText = getAnswerText(questionType, questionAnswer.answer);

  return (
    <div className="problem-box" key={sequence}>
      <div className={`ol-title ${correctStyle}`} style={{ position: 'relative' }}>
        <p className="problem-title">
          <span>{sequence}</span>
          <span
            style={{
              flex: 'auto',
              textAlign: 'left',
            }}
          >
            {`${question} (${point}점) ${mandatoryText}`}
          </span>
          <br />
          <span style={{ padding: 0 }}>{groupNameText}</span>
        </p>
      </div>
      {imagePath && <Image className="img-list max-width-100" src={imagePath} alt="question-img" />}
      <div className="ol-answer">{children}</div>
      <hr
        style={{
          margin: '1.875rem 0',
          border: '0',
          borderBottom: '1px solid #d6deed',
        }}
      />
      {questionType !== 'Essay' && (
        <div className="view_answer">
          <Accordion>
            <Accordion.Title
              active={open}
              index={0}
              onClick={onClickOpen}
              style={{
                height: '44px',
                padding: '12.5px 0',
                fontSize: '.875rem',
                fontWeight: '900',
                color: '#0e73db',
              }}
            >
              <span>
                {open ? '해설 닫기' : '해설 보기'}
                <Icon className="i_down" />
              </span>
            </Accordion.Title>
            <Accordion.Content active={open}>
              <div style={{ display: 'flex' }}>
                <strong>정답</strong>
                <p
                  style={{
                    textAlign: 'left',
                    width: 'calc(100% - 46px)',
                    color: '#282e3b',
                    padding: '0 1.58rem',
                  }}
                >
                  {answerText}
                </p>
              </div>
              {questionAnswer.explanation && (
                <div style={{ display: 'flex' }}>
                  <strong>해설</strong>
                  <p
                    style={{
                      textAlign: 'left',
                      width: 'calc(100% - 46px)',
                      color: '#282e3b',
                      padding: '0 1.58rem',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {questionAnswer.explanation}
                  </p>
                </div>
              )}
            </Accordion.Content>
          </Accordion>
          <hr
            style={{
              margin: '1.875rem 0',
              border: '0',
              borderBottom: '1px solid #d6deed',
            }}
          />
        </div>
      )}
    </div>
  );
}

const getCorrectStyle = (questionType: QuestionType, isCorrect: boolean): string => {
  if (questionType === 'Essay') {
    return '';
  }
  return isCorrect ? 'exact-answer' : 'wrong-answer';
};

const getAnswerText = (questionType: QuestionType, answer: string): string => {
  if (questionType === 'MultiChoice') {
    const joinedAnswer = answer.split(',').join('번, ');
    return joinedAnswer.concat('번');
  }

  if (questionType === 'SingleChoice') {
    return `${answer}번`;
  }

  return answer;
};
