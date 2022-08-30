import React from 'react';
import { ReactComponent, autobind } from '@nara.platform/accent';

import { ModalProps, Modal as SemanticModal } from 'semantic-ui-react';
import Trigger, { TriggerTypes } from '../../Trigger';

interface Props extends ModalProps {
  children: React.ReactNode;
  trigger?: React.ReactElement;
  triggerAs?: any;
  open?: boolean;
  className?: string;
  modSuper?: boolean;
}

interface State {
  open: boolean;
}

@autobind
class ModalContainer extends ReactComponent<Props, State> {
  //
  static defaultProps = {
    trigger: undefined,
    triggerAs: 'span',
    open: undefined,
    onClose: () => {},
  };

  renderChildren(closeCallback?: (event: React.SyntheticEvent, ...rest: any[]) => void) {
    //
    const { children } = this.props;
    let targetChildren = children;

    if (typeof children === 'function' && closeCallback) {
      targetChildren = children({ close: closeCallback });
    }

    return targetChildren;
  }

  render() {
    //
    const { trigger, triggerAs, open, onClose, className, children, modSuper, ...otherProps } = this.props;

    if (trigger) {
      return (
        <Trigger as={triggerAs} element={trigger} onClose={() => {}} modSuper={modSuper}>
          {(context: TriggerTypes.TriggerContextParams) => (
            <SemanticModal {...otherProps} open={open || context.open} onClose={context.onClose}>
              {this.renderChildren(context.onClose)}
            </SemanticModal>
          )}
        </Trigger>
      );
    } else {
      return (
        <SemanticModal {...otherProps} open={open || false} onClose={onClose}>
          {this.renderChildren()}
        </SemanticModal>
      );
    }
  }
}

export default ModalContainer;
