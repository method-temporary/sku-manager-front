import React from 'react';
import { autobind } from '@nara.platform/accent';

import { ModalContentProps, ModalContent as SemanticModalContent } from 'semantic-ui-react';

interface Props extends ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

@autobind
class ModalContent extends React.Component<Props> {
  //
  static defaultProps = {
    className: '',
  };

  render() {
    //
    const { children, className, ...rest } = this.props;

    return (
      <SemanticModalContent className={className} {...rest}>
        {children}
      </SemanticModalContent>
    );
  }
}

export default ModalContent;
