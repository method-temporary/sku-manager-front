import React from 'react';

interface TestSubInfoViewProps {
  questionCount: number;
  totalScore: number;
  choiceScore: number;
  answerScore: number;
}

export function TestSubInfoView({ questionCount, totalScore, choiceScore, answerScore }: TestSubInfoViewProps) {
  return (
    <div>
      <span>
        총 문항 수<strong>{questionCount} 문항</strong>
      </span>
      <span>
        총점
        <strong>{totalScore}점</strong>
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
