import React from 'react';
import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';

interface QuestionSelectionInfoViewProps {
  questionSelectionTypeText: QuestionSelectionTypeText;
  questionCount: number;
  totalPoint: number;
  successPoint: number;
  choiceScore: number;
  answerScore: number;
}

export function QuestionSelectionInfoView({
  questionSelectionTypeText,
  questionCount,
  totalPoint,
  successPoint,
  choiceScore,
  answerScore,
}: QuestionSelectionInfoViewProps) {
  return (
    <div>
      <span>
        출제방식
        <strong>{questionSelectionTypeText}</strong>
      </span>
      <span>
        출제 문항 수<strong>{`${questionCount} 문항`}</strong>
      </span>
      <span>
        합격점 (총점)
        <strong>{`${successPoint}점 ( ${totalPoint}점 )`}</strong>
      </span>
      <span>
        객관식
        <strong>{choiceScore}점</strong>
      </span>
      <span>
        주관식
        <strong>{answerScore}점</strong>
      </span>
    </div>
  );
}
