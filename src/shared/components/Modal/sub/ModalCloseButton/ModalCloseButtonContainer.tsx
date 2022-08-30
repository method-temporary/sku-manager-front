import React from 'react';
import { autobind } from '@nara.platform/accent';

import { ButtonProps, Button } from 'semantic-ui-react';
import Trigger from '../../../Trigger';

interface Props extends ButtonProps {
  //
  onClickWithClose?: (event: React.MouseEvent<HTMLButtonElement>, close: () => void) => void;
  children?: React.ReactNode;
}

@autobind
class ModalCloseButtonContainer extends React.Component<Props> {
  //
  static defaultProps = {
    children: '취소',
    onClick: () => {},
  };

  static contextType = Trigger.Context;

  context!: React.ContextType<typeof Trigger.Context>;

  componentDidMount() {
    //
    const { open } = this.context;

    if (!open) {
      throw new Error('[Modal] Modal is not controlled by trigger. You cannot use Modal.CloseButton.');
    }
  }

  onClick(event: React.MouseEvent<HTMLButtonElement>, params: ButtonProps) {
    //
    const { onClose } = this.context;
    const { onClickWithClose, onClick } = this.props;

    if (typeof onClickWithClose === 'function') {
      onClickWithClose(event, onClose);
    } else {
      onClick!(event, params);
      onClose();
    }
  }

  render() {
    //
    const { children, onClickWithClose, ...otherProps } = this.props;

    return (
      <Button {...otherProps} onClick={this.onClick}>
        {children}
      </Button>
    );
  }
}

export default ModalCloseButtonContainer;
