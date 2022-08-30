import React, { useState, useCallback, memo } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleOk: (remark: string) => void;
}

function CommunityMemberRejectModal(props: Props) {
  const { open, handleClose, handleOk } = props;
  const [remark, setRemark] = useState<string>('');

  /* handlers */
  const onChangeRemark = useCallback((e: any) => {
    setRemark(e.target.value);
  }, []);

  /* render */
  return (
    <Modal open={open} onClose={handleClose} className="base w700">
      <Modal.Header>반려 사유 등록</Modal.Header>
      <Modal.Content className="admin_popup_reject">
        <Form>
          <Form.Field>
            <div className="ui right-top-count input admin-popup-textarea">
              <textarea placeholder={remarkPlaceholder} value={remark} onChange={onChangeRemark} />
            </div>
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions className="actions2">
        <Button className="pop2 d" onClick={handleClose}>
          취소
        </Button>
        <Button className="pop2 p" onClick={() => handleOk(remark)}>
          반려
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default memo(CommunityMemberRejectModal);

/* globals */
const remarkPlaceholder = `반려 사유를 입력해주세요. (입력된 반려 사유는 E-mail을 통해 전달되며, 등록된 내용은 수정하실 수 없습니다.)`;
