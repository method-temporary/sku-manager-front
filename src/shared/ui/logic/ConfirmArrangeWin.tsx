import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Button, Header, Modal, Image } from 'semantic-ui-react';

interface Props {
  message: any;
  open: boolean;
  handleClose: () => void;
  handleTempSave?: (mode?: string) => void;
  id?: number;
  title: string;
  handleOk: (mode?: string) => void;
  isSaveAndApprove?: boolean;
  state?: string;
}

@observer
@reactAutobind
class ConfirmArrangeWin extends React.Component<Props> {
  //
  render() {
    const { handleClose, open, message, title, handleOk, handleTempSave, id, isSaveAndApprove, state } = this.props;
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
              취소
            </Button>
            {
              <>
                {(handleTempSave && !isSaveAndApprove && (
                  <Button primary onClick={() => handleTempSave('modify')} type="button">
                    임시저장
                  </Button>
                )) ||
                  (handleOk && isSaveAndApprove && (
                    <Button primary onClick={() => handleOk()} type="button">
                      저장
                    </Button>
                  )) ||
                  ''}
              </>
            }
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default ConfirmArrangeWin;
