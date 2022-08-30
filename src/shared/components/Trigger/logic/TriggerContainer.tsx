import React from 'react';
import { autobind } from '@nara.platform/accent';

import TriggerContextModel from '../model/TriggerContextModel';
import TriggerContext from '../sub/TriggerContext/TriggerContext';

interface Props {
  element: React.ReactNode;
  as?: any;
  toggle?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onOpen?: (event: React.SyntheticEvent, ...params: any[]) => void;
  onClose?: (event: React.SyntheticEvent, ...params: any[]) => void;
  modSuper?: boolean;
}

interface State {
  open: boolean;
}

@autobind
class TriggerContainer extends React.Component<Props, State> {
  //
  static defaultProps = {
    as: 'span',
    toggle: false,
    onClick: () => {},
    onOpen: () => {},
    onClose: () => {},
  };

  state: State = {
    open: false,
  };

  getContext(): TriggerContextModel {
    //
    const { open } = this.state;

    return {
      open,
      onOpen: this.onOpen,
      onClose: this.onClose,
    };
  }

  onClick(event: React.MouseEvent) {
    //
    event.stopPropagation();

    const { toggle, onClick, modSuper } = this.props;
    const { open } = this.state;

    if (!modSuper) {
      onClick!(event);

      if (toggle && open) {
        this.onClose(event);
      } else if (!open) {
        this.onOpen(event);
      }
    }
  }

  onOpen(event: React.SyntheticEvent) {
    //
    this.props.onOpen!(event);
    this.setState({ open: true });
  }

  onClose(event: React.SyntheticEvent) {
    //
    this.props.onClose!(event);
    this.setState({ open: false });
  }

  renderChildren(value: TriggerContextModel) {
    //
    const { children } = this.props;

    let targetChildren: React.ReactNode = children;

    if (typeof children === 'function') {
      targetChildren = children(value);
    }

    return targetChildren;
  }

  render() {
    //
    const { element, as: As } = this.props;

    return (
      <TriggerContext.Provider value={this.getContext()}>
        <As className="trigger" onClick={this.onClick}>
          {element}
        </As>

        <TriggerContext.Consumer>{this.renderChildren}</TriggerContext.Consumer>
      </TriggerContext.Provider>
    );
  }
}

export default TriggerContainer;
