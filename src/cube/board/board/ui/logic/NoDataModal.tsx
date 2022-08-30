import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleOk: () => void;
}

@observer
@reactAutobind
class NoDataModal extends React.Component<Props> {
  //
  render() {
    const { open, handleClose, handleOk } = this.props;
    return (
      <>
        {/*<Button onClick={this.show('tiny')} icon basic><Icon name='minus'/></Button>*/}

        <Modal size="tiny" open={open} onClose={handleClose}>
          <Modal.Header>알림</Modal.Header>
          <Modal.Content>
            <Header as="h3" icon textAlign="center">
              <Icon name="exclamation triangle" size="tiny" color="red" />
              <Header.Content>검색된 결과가 없습니다.</Header.Content>
            </Header>
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={handleOk} type="button">
              OK
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default NoDataModal;
