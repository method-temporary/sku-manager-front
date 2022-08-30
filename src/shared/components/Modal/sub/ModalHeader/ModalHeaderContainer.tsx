import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { ModalHeaderProps, ModalHeader as SemanticModalHeader } from 'semantic-ui-react';
import Trigger from '../../../Trigger';

interface Props extends ModalHeaderProps {
  children: React.ReactNode;
  close?: () => void;
  className?: string;
  onClose?: () => void;
}

@reactAutobind
class ModalHeaderContainer extends ReactComponent<Props> {
  //
  static defaultProps = {
    children: null,
    className: '',
    close: () => {},
  };

  static contextType = Trigger.Context;

  context!: React.ContextType<typeof Trigger.Context>;

  render() {
    //
    const { children, close: injectedClose, onClose, ...otherProps } = this.props;
    const { onClose: onCloseByTrigger } = this.context;

    return (
      <SemanticModalHeader {...otherProps} onClose={onClose || onCloseByTrigger}>
        {children}
      </SemanticModalHeader>
    );
  }
}

export default ModalHeaderContainer;
