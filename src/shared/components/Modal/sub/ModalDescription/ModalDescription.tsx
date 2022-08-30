import React from 'react';
import { autobind } from '@nara.platform/accent';

import { ModalDescription as SemanticModalDescription, ModalDescriptionProps } from 'semantic-ui-react';

interface Props extends ModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

@autobind
class ModalDescription extends React.Component<Props> {
  //
  static defaultProps = {
    className: '',
  };

  render() {
    //
    const { children, className, ...rest } = this.props;

    return (
      <SemanticModalDescription className={className} {...rest}>
        {children}
      </SemanticModalDescription>
    );
  }
}

export default ModalDescription;
