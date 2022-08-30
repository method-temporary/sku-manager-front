import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Button, Modal, Header, Image } from 'semantic-ui-react';

interface Props {
  handleClose: () => void;
  open: boolean;
}

@observer
@reactAutobind
class ModalForCategoryService extends React.Component<Props> {
  //
  render() {
    const { handleClose, open } = this.props;
    return (
      <>
        <Modal size="tiny" open={open} onClose={handleClose}>
          <Modal.Header>알림</Modal.Header>
          <Modal.Content>
            <Header as="h3" icon textAlign="center">
              <Image src={`${process.env.PUBLIC_URL}/images/modal/confirm.png`} className="message-icon" />
              {/*<Icon name="exclamation triangle" size="tiny" color="red" />*/}
              {/*<Header.Content>필수 정보 입력 안내</Header.Content>*/}
            </Header>
            <p className="center">
              해당 카테고리에 콘텐츠가 존재합니다.
              <br /> 관리자에게 문의하세요.
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={handleClose} type="button">
              OK
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default ModalForCategoryService;
