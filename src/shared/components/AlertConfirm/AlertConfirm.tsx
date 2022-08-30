import React, { Component, ReactElement } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Button, Header, Image, TextArea } from 'semantic-ui-react';
import Modal from '../Modal';

interface AlertProps {
  title: string;
  message: string;
  warning?: boolean;
  closeLabel?: string;
  onClose?: () => void;
  addInfo?: string;
}

interface State {
  showAddInfo: boolean;
}

export class Alert extends Component<AlertProps, State> {
  //
  state: State = {
    showAddInfo: false,
  };

  buttonRef: any = React.createRef();

  componentDidMount(): void {
    this.buttonRef.focus();
  }

  render() {
    //
    const { warning, title, message, closeLabel, onClose, addInfo } = this.props;

    return (
      <Modal size="tiny" open>
        <Modal.Header>알림</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header as="h3" icon textAlign="center">
              {warning ? (
                <Image src={`${process.env.PUBLIC_URL}/images/modal/alert.png`} className="message-icon" />
              ) : (
                <Image src={`${process.env.PUBLIC_URL}/images/modal/confirm.png`} className="message-icon" />
              )}
              <Header.Content className="title">{title}</Header.Content>
            </Header>
            <p className="center pre-wrap">{message}</p>
            {addInfo && (
              <span
                className="span_a"
                onClick={() => {
                  const nextVal = this.state.showAddInfo;

                  this.setState({ showAddInfo: !nextVal });
                }}
              >
                {this.state.showAddInfo ? '닫기' : '자세히 보기'}
              </span>
            )}
            {this.state.showAddInfo && <TextArea value={addInfo} />}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions className="actions1">
          {warning ? (
            <Button primary onClick={onClose} ref={(buttonRef) => (this.buttonRef = buttonRef)}>
              {closeLabel || '확인'}
            </Button>
          ) : (
            <Button secondary onClick={onClose} ref={(buttonRef) => (this.buttonRef = buttonRef)}>
              {closeLabel || '확인'}
            </Button>
          )}
        </Modal.Actions>
      </Modal>
    );
  }
}

interface ConfirmProps {
  title: string;
  message: string;
  warning?: boolean;
  okLabel?: string;
  cancelLabel?: string;
  onOk?: () => void;
  onCancel?: () => void;
  addButton?: ReactElement;
  onClose?: () => void;
}

class Confirm extends Component<ConfirmProps> {
  //
  renderAddButton() {
    //
    const { addButton, onClose } = this.props;

    if (addButton) {
      const { onClick } = addButton.props;

      const onClickFn = () => {
        if (typeof onClick === 'function') {
          onClick();
        }

        if (onClose) {
          onClose();
        }
      };

      return React.createElement(Button, { ...addButton.props, onClick: onClickFn });
    }

    return '';
  }

  render() {
    //
    const { title, message, warning, okLabel, cancelLabel, onOk, onCancel } = this.props;

    return (
      <Modal size="tiny" open>
        <Modal.Header>확인</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Modal.Header>
              {warning ? (
                <Image src={`${process.env.PUBLIC_URL}/images/modal/alert.png`} className="message-icon" />
              ) : (
                <Image src={`${process.env.PUBLIC_URL}/images/modal/confirm.png`} className="message-icon" />
              )}
              <Header.Content className="title">{title}</Header.Content>
            </Modal.Header>
            <p className="center pre-wrap">{message}</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions className="actions1">
          <Button secondary onClick={onCancel}>
            {cancelLabel || '취소'}
          </Button>
          <Button primary onClick={onOk}>
            {okLabel || '확인'}
          </Button>
          {this.renderAddButton()}
        </Modal.Actions>
      </Modal>
    );
  }
}

enum Type {
  ALERT = 'alert',
  CONFIRM = 'confirm',
}

export interface Props extends AlertProps, ConfirmProps {
  type: Type;
  closeLabel?: string;
  okLabel?: string;
  cancelLabel?: string;
  trigger?: boolean;
  addButton?: ReactElement;
}

export function alert(options: AlertProps) {
  //
  const { title, message, warning, closeLabel, onClose: close, addInfo } = options;

  confirmAlert({
    title,
    message,
    customUI: ({ title, message, onClose }) =>
      onGetCustomUI({
        message,
        title,
        warning,
        closeLabel,
        addInfo,
        type: Type.ALERT,
        onClose: () => {
          Promise.resolve()
            .then(() => {
              if (close && typeof close === 'function') close();
            })
            .then(onClose);
        },
      }),
  });
}

export function confirm(options: ConfirmProps, trigger: boolean = true) {
  //
  const { title, message, warning, okLabel, cancelLabel, onOk, onCancel: cancel, addButton } = options;

  confirmAlert({
    title,
    message,
    customUI: ({ title, message, onClose }) =>
      onGetCustomUI({
        title,
        message,
        warning,
        okLabel,
        cancelLabel,
        type: Type.CONFIRM,
        addButton,
        onClose: () => {
          if (trigger) onClose();
        },
        onOk: () => {
          if (onOk && typeof onOk === 'function') onOk();
          if (trigger) onClose();
        },
        onCancel: () => {
          if (cancel && typeof cancel === 'function') cancel();
          onClose();
        },
      }),
  });
}

let onGetCustomUI = getCustomUI;

export function setCustomUI(customUI: any) {
  onGetCustomUI = customUI;
}

function getCustomUI(options: Props) {
  //
  const {
    title,
    message,
    type,
    warning,
    closeLabel,
    onClose,
    okLabel,
    cancelLabel,
    onOk,
    onCancel,
    addButton,
    addInfo,
  } = options;

  if (type === Type.ALERT) {
    return (
      <Alert
        title={title}
        message={message}
        warning={warning}
        closeLabel={closeLabel}
        onClose={onClose}
        addInfo={addInfo}
      />
    );
  } else if (type === Type.CONFIRM) {
    const okFunction = typeof onOk === 'function' ? onOk : () => {};

    return (
      <Confirm
        title={title}
        message={message}
        warning={warning}
        okLabel={okLabel}
        cancelLabel={cancelLabel}
        onOk={okFunction}
        onCancel={onCancel}
        addButton={addButton}
        onClose={onClose}
      />
    );
  }
  return null;
}
