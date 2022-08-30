import React, { Component } from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { Modal, Button, Image, Header } from 'semantic-ui-react';

interface Props {
  title: string;
  message: string;
  warning?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

@reactAutobind
class DialogContainer extends Component<Props> {
  //
  static defaultProps = {
    warning: false,
  };

  render() {
    //
    const { title, message, warning, onOk, onCancel, onClose } = this.props;
    const image = warning ? 'alert.png' : 'confirm.png';

    return (
      <Modal open size="tiny">
        <Modal.Header>안내</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Image src={`${process.env.PUBLIC_URL}/images/modal/${image}`} className="message-icon" />
            <Header.Content className="title">{title}</Header.Content>
            <div dangerouslySetInnerHTML={{ __html: message }} />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions className="actions1">
          {onCancel && (
            <Button secondary onClick={onCancel}>
              취소
            </Button>
          )}
          {onOk && (
            <Button primary onClick={onOk}>
              확인
            </Button>
          )}
          {onClose && (
            <Button secondary onClick={onClose}>
              확인
            </Button>
          )}
        </Modal.Actions>
      </Modal>
    );
  }
}

export default DialogContainer;
