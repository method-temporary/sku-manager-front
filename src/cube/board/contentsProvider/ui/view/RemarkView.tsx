import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import classNames from 'classnames';

interface Props {
  answer: string;
  onSetAnswer: (answer: string) => void;
}

interface State {
  focus: boolean;
  error: boolean;
}

@reactAutobind
@observer
class RemarkView extends React.Component<Props, State> {
  //
  state = {
    focus: false,
    error: false,
  };

  render() {
    const { focus, error } = this.state;
    const { answer } = this.props;

    return (
      <div
        className={classNames('ui right-top-count input', {
          focus,
          write: answer,
          error,
        })}
      >
        {/* .error // */}
        <span className="count">
          <span className="now">{answer.length}</span>/<span className="max">1000</span>
        </span>
        <textarea
          placeholder="해당 교육기간 관련 특이사항을 입력해주시기 바랍니다.(계약 범위 등)"
          onClick={() => this.setState({ focus: true })}
          onBlur={() => this.setState({ focus: false })}
          value={answer}
        />
        <span className="validation">You can enter up to 1000 characters.</span>
      </div>
    );
  }
}

export default RemarkView;
