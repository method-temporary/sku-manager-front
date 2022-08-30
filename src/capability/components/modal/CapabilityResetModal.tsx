import React from 'react';
import { observer } from 'mobx-react';
import { Button, Modal } from 'semantic-ui-react';

import { useCapabilityReset } from '../../capability.hook';
import CapabilityModalStore from './capabilityModal.store';
import CapabilityStore from '../../capability.store';

const CapabilityResetModal = observer(() => {
  //
  const { qdo } = CapabilityStore.instance;
  const { resetVisible, setResetVisible, resetAssessmentResultId } = CapabilityModalStore.instance;

  const { mutateAsync: reset } = useCapabilityReset(qdo);

  const onOk = () => {
    if (resetAssessmentResultId) {
      reset(resetAssessmentResultId);
    }
    setResetVisible();
  };

  return (
    <Modal
      size={'mini'}
      open={resetVisible}
      onClose={setResetVisible}
    >
      <Modal.Header>초기화</Modal.Header>
      <Modal.Content>
        초기화 하시겠습니까?
      </Modal.Content>
      <Modal.Actions>
        <Button className={'w150 d'} onClick={setResetVisible}>
          취소
        </Button>
        <Button primary className={'w150 d'} onClick={onOk}>
          확인
        </Button>
      </Modal.Actions>
    </Modal>
  );
});

export default CapabilityResetModal;
