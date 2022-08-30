import React from 'react';
import { autobind } from '@nara.platform/accent';

import { ModalActionsProps, ModalActions } from 'semantic-ui-react';

interface Props extends ModalActionsProps {
  children: React.ReactNode;
  className?: string;
}

@autobind
class ModalActionsContainer extends React.Component<Props> {
  //
  static defaultProps = {
    className: '',
  };

  render() {
    //
    const { className, children, ...otherProps } = this.props;

    return (
      <ModalActions className={className} {...otherProps}>
        {children}
      </ModalActions>
    );
  }
}

export default ModalActionsContainer;
