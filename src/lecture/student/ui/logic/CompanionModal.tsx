import React, { Fragment } from 'react';
import { Button, Form, Modal, TextArea, TextAreaProps } from 'semantic-ui-react';
import { StudentRequestCdoModel } from '../../model/StudentRequestCdoModel';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleOk: () => void;
  studentRequestCdo?: StudentRequestCdoModel;
  onChangeStudentRequestProps: (name: string, value: any) => void;
}

class CompanionModal extends React.Component<Props> {
  //
  render() {
    const { open, handleClose, handleOk, onChangeStudentRequestProps } = this.props;
    return (
      <>
        <Fragment>
          <Modal size="small" open={open} onClose={handleClose}>
            <Modal.Header>반려 사유</Modal.Header>
            <Modal.Content>
              <Form>
                <TextArea
                  placeholder="반려 사유를 입력해주세요.&#13;&#10;(입력된 반려 사유는 E-mail을 통해 전달되며, 등록된 내용은 수정하실 수 없습니다.)"
                  // value={studentRequestCdo && studentRequestCdo.remark || ''}
                  onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) =>
                    onChangeStudentRequestProps('remark', `${data.value}`)
                  }
                  rows={5}
                />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={handleClose} type="button">
                Cancel
              </Button>
              <Button primary onClick={handleOk} type="button">
                OK
              </Button>
            </Modal.Actions>
          </Modal>
        </Fragment>
      </>
    );
  }
}

export default CompanionModal;
