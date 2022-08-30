import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

interface Props {
  number?: number;
  text?: string;
  children?: React.ReactNode;
}

@observer
@reactAutobind
class CountView extends React.Component<Props> {
  //
  static defaultProps = {
    number: 0,
    text: '',
  };

  render() {
    //
    const { children, number, text } = this.props;

    if (children) {
      return <span>전체 {children}</span>;
    } else {
      return (
        <span>
          전체 <strong>{number}</strong> {text}
        </span>
      );
    }
  }
}

export default CountView;
