import React, { Fragment } from 'react';
import { Button, Form, Modal, TextArea, TextAreaProps } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

interface Props {
  onShow: () => boolean;
  handleOk: () => void;
  onChangeStudentRequestProps: (name: string, value: any) => void;
}

interface States {
  openModal: boolean;
}

@observer
@reactAutobind
class SendEmailModal extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = { openModal: false };
  }

  show() {
    const { onShow } = this.props;
    //
    if (onShow()) {
      this.setState({ openModal: true });
    }
  }

  close() {
    //
    this.setState({ openModal: false });
  }

  onHandleOk() {
    const { handleOk } = this.props;
    this.close();
    handleOk();
  }

  render() {
    const { onChangeStudentRequestProps } = this.props;
    const { openModal } = this.state;
    return (
      <>
        <React.Fragment>
          <Button onClick={this.show} type="button">
            메일보내기
          </Button>
          <Modal size="small" open={openModal} onClose={this.close}>
            <Modal.Header>메일보내기</Modal.Header>
            <Modal.Content>
              <Form>
                <TextArea
                  placeholder="메일 내용을 입력해주세요."
                  onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) =>
                    onChangeStudentRequestProps('mailContents', `${data.value}`)
                  }
                  rows={5}
                />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.close} type="button">
                Cancel
              </Button>
              <Button primary onClick={this.onHandleOk} type="button">
                OK
              </Button>
            </Modal.Actions>
          </Modal>
        </React.Fragment>
      </>
    );
  }
}

export default SendEmailModal;
