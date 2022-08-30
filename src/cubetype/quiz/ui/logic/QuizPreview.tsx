import QuizTableList from 'cubetype/quiz/model/QuizTableList';
import React, { useCallback, useState } from 'react';
import { Button, Table, Radio, Grid, Input, Checkbox, TextArea } from 'semantic-ui-react';
import QuizPreviewContentView from '../view/QuizPreviewContentView';

interface Props {
  previewData: QuizTableList | undefined;
  onClose: () => void;
}

const QuizPreview: React.FC<Props> = ({ onClose, previewData }) => {
  const [quizIndex, setQuizIndex] = useState<number>(0);

  const onChangeNextQuizIndex = useCallback(() => {
    if (previewData) {
      const quizMaxIndex = previewData.quizQuestions!.length - 1;
      if (quizIndex < quizMaxIndex) {
        setQuizIndex(quizIndex + 1);
      }
    }
  }, [quizIndex]);

  const onChangePrevQuizIndex = useCallback(() => {
    if (quizIndex <= 0) {
      setQuizIndex(0);
    } else {
      setQuizIndex(quizIndex - 1);
    }
  }, [quizIndex]);

  return (
    <div className="quiz-preview">
      <div
        className="quiz-preview-contents"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <div
          className="preview-title"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            height: '50px',
            borderBottom: '1px solid #dce2ef',
          }}
        >
          <strong style={{ display: 'block', lineHeight: '50px' }}>미리보기</strong>
        </div>
        <div className="preview-content" style={{ flex: 1, padding: '5px 20px' }}>
          <QuizPreviewContentView data={previewData?.quizQuestions} currentIndex={quizIndex} />
        </div>
        <div
          className="preview-action"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 20px',
            borderTop: '1px solid #dce2ef',
          }}
        >
          {previewData && previewData?.quizQuestions?.length > 1 && (
            <div className="action-button">
              <Button onClick={onChangePrevQuizIndex}>이전</Button>
              <Button onClick={onChangeNextQuizIndex}>다음</Button>
            </div>
          )}
          <Button onClick={onClose} style={{ marginLeft: 'auto' }}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPreview;
