import * as React from 'react';
import { Button, Modal, TextArea, Form, TextAreaProps } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import { CubeRequestCdoModel } from '../../model/sdo/CubeRequestCdoModel';

interface Props {
  // open: boolean
  // handleClose: () => void
  handleOk: () => void;
  changeSomethingProps: (name: string, value: string) => void;
  cubeRequestCdo?: CubeRequestCdoModel;
  remark?: string;
  buttonText?: string;
}

interface States {
  openModal: boolean;
}

@observer
@reactAutobind
class CompanionModal extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = { openModal: false };
  }

  show() {
    //
    this.setState({ openModal: true });
  }

  close() {
    //
    this.setState({ openModal: false });
  }

  handleOk() {
    //
    const { handleOk } = this.props;
    this.close();
    handleOk();
  }

  render() {
    const { changeSomethingProps, cubeRequestCdo, buttonText, remark } = this.props;
    const { openModal } = this.state;
    return (
      <React.Fragment>
        <Button onClick={this.show} type="button">
          {buttonText || '반려'}
        </Button>
        <Modal size="small" open={openModal} onClose={this.close}>
          <Modal.Header>반려 사유</Modal.Header>
          <Modal.Content>
            {/* 반려사유 입력 */}
            <Form>
              {remark ? (
                <TextArea
                  rows={5}
                  placeholder="반려 사유를 입력해주세요. (입력된 반려 사유는 E-mail을 통해 전달되며, 등록된 내용은 수정하실 수 없습니다.)"
                  value={remark || ''}
                  onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) =>
                    changeSomethingProps('remark', `${data.value}`)
                  }
                />
              ) : null}
              {cubeRequestCdo ? (
                <TextArea
                  rows={5}
                  placeholder="반려 사유를 입력해주세요. (입력된 반려 사유는 E-mail을 통해 전달되며, 등록된 내용은 수정하실 수 없습니다.)"
                  value={(cubeRequestCdo && cubeRequestCdo.remark) || ''}
                  onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) =>
                    changeSomethingProps('remark', `${data.value}`)
                  }
                />
              ) : null}
            </Form>
            {/* 반려사유 확인 */}
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.close} type="button">
              Cancel
            </Button>
            <Button onClick={this.handleOk} primary type="button">
              OK
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CompanionModal;
