import React from 'react';
import { useFocus } from 'exam/hooks/useFocus';
import classNames from 'classnames';

interface EssayViewProps {
  answer?: string;
}

export function EssayView({ answer }: EssayViewProps) {
  const { focus, onClick, onBlur } = useFocus(false);

  return (
    <div className={classNames('ui right-top-count input margin-bottom10', { focus, write: answer, error: false })}>
      <span className="count">
        <span className="now">{answer?.length || 0}</span>/<span className="max">1000</span>
      </span>
      <textarea
        style={{
          height: '300px',
        }}
        value={answer}
        onClick={onClick}
        onBlur={onBlur}
        placeholder="답변을 입력해주세요. (최대 1000자 입력 가능)"
        readOnly
      />
      <span className="validation">You can enter up to 1000 characters.</span>
    </div>
  );
}
