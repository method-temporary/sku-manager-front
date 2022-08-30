import React, { Component } from 'react';
import { Button, Modal, Image } from 'semantic-ui-react';

interface Props {
  trigger?: React.ReactNode;
}

interface States {
  open: boolean;
}

class BadgeCategoryGuideModal extends Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  show(open: boolean) {
    //
    this.setState({ open });
  }

  handleCancel() {
    //
    this.show(false);
  }

  render() {
    const { trigger } = this.props;
    const { open } = this.state;

    return (
      <Modal
        key="BadgeCategoryGuideModal"
        open={open}
        onOpen={() => this.show(true)}
        onClose={() => this.show(false)}
        trigger={trigger}
        className="base w1000 inner-scroll"
      >
        <Modal.Header className="res">Badge 분야 등록 Guide</Modal.Header>
        <Modal.Content>
          <Image src={`${process.env.PUBLIC_URL}/images/badgeGuide.png`} />
        </Modal.Content>
        <Modal.Actions className="actions">
          <Button className="w190 pop d" onClick={() => this.handleCancel()}>
            닫기
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default BadgeCategoryGuideModal;
