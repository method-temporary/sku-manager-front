import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

interface Props {
  open: boolean;
  handleOk: () => void;
}

@observer
@reactAutobind
class StateModal extends React.Component<Props> {
  //
  render() {
    const { open, handleOk } = this.props;
    return (
      <>
        {/*<Button onClick={this.show('tiny')} basic primary>대기</Button>*/}

        <Modal size="tiny" open={open}>
          <Modal.Header>알림</Modal.Header>
          <Modal.Content>
            <Header as="h3" icon textAlign="center">
              <Icon name="exclamation circle" size="tiny" color="blue" />
              <Header.Content>대기 상태로 전환되었습니다.</Header.Content>
            </Header>
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={handleOk}>
              OK
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default StateModal;
