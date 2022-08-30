import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Button, Header, Modal, Image } from 'semantic-ui-react';

interface Props {
  message: any;
  open: boolean;
  handleClose: () => void;
  handleSaveAndApprove?: (mode?: string) => void;
  id?: string;
  title: string;
  handleOk: (mode?: string) => void;
  buttonYesName: string;
  buttonNoName: string;
  isSaveAndApprove?: boolean;
  state?: string;
}

@observer
@reactAutobind
class ConfirmWin extends React.Component<Props> {
  //
  render() {
    const {
      handleClose,
      open,
      message,
      title,
      handleOk,
      buttonYesName,
      buttonNoName,
      handleSaveAndApprove,
      id,
      isSaveAndApprove,
      state,
    } = this.props;
    return (
      <>
        <Modal size="tiny" open={open} onClose={handleClose}>
          <Modal.Header>확인</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Image src={`${process.env.PUBLIC_URL}/images/modal/confirm.png`} className="message-icon" />
              <Header.Content className="title">{title}</Header.Content>
              <p>{message}</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions className="actions1">
            <Button secondary onClick={handleClose} type="button">
              {buttonNoName}
            </Button>
            {id ? (
              <>
                <Button primary onClick={() => handleOk('modify')} type="button">
                  {buttonYesName}
                </Button>
                {handleSaveAndApprove && state === 'Created' ? (
                  <Button primary onClick={() => handleSaveAndApprove('modify')} type="button">
                    저장 및 승인요청
                  </Button>
                ) : null}
              </>
            ) : (
              <>
                <Button primary onClick={() => handleOk()} type="button">
                  {buttonYesName}
                </Button>
                {(handleSaveAndApprove && isSaveAndApprove && (
                  <Button primary onClick={() => handleSaveAndApprove()} type="button">
                    저장 및 승인요청
                  </Button>
                )) ||
                  ''}
              </>
            )}
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default ConfirmWin;
