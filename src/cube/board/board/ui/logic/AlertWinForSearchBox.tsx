import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Button, Modal, Header, Icon } from 'semantic-ui-react';

interface Props {
  handleClose: () => void;
  open: boolean;
}

@observer
@reactAutobind
class AlertWinForSearchBox extends React.Component<Props> {
  //
  render() {
    const { handleClose, open } = this.props;
    return (
      <>
        {/*<Button onClick={this.show('tiny')}>Alert</Button>*/}

        {/*필수 정보를 입력하지 않고 [저장]버튼을 선택할 경우*/}
        {/*입력하지 않은 필수 정보가 어려 개일 경우 모든 미입력 정보에 대한 명칭을 제공한다.*/}
        <Modal size="tiny" open={open} onClose={handleClose}>
          <Modal.Header>알림</Modal.Header>
          <Modal.Content>
            <Header as="h3" icon textAlign="center">
              <Icon name="exclamation triangle" size="tiny" color="red" />
              <Header.Content>필수 정보 입력 안내</Header.Content>
            </Header>
            <p className="center">검색어를 입력해주세요.</p>
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

export default AlertWinForSearchBox;
