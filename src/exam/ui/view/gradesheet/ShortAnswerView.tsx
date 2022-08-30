import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useFocus } from 'exam/hooks/useFocus';
import classNames from 'classnames';

interface ShortAnswerViewProps {
  answer: string;
}

export function ShortAnswerView({ answer }: ShortAnswerViewProps) {
  const { focus, onClick, onBlur } = useFocus(false);

  return (
    <div className={classNames('ui right-top-count input', { focus, write: answer, error: false })}>
      <span className="count">
        <span className="now">{(answer && answer.length) || 0}</span> / <span className="max">100</span>
      </span>
      <input
        type="text"
        value={answer}
        onClick={onClick}
        onBlur={onBlur}
        placeholder="답변을 입력해주세요. (최대 100자 입력 가능)"
        readOnly
      />
      <Icon className="clear link" />
      <span className="validation">You can enter up to 100 characters.</span>
    </div>
  );
}
