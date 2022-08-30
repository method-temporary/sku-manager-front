import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Modal, Table } from 'semantic-ui-react';

import { useFindAssessmentResultDetail } from '../../capability.hook';
import CapabilityModalStore from './capabilityModal.store';

import { getPolyglotToAnyString } from '../../../shared/components/Polyglot';

const CapabilityModal = observer(() => {
  //
  const [data, setData] = useState<any>({});
  const { testVisible, setTestVisible, testAssessmentResultId } = CapabilityModalStore.instance;

  const { mutateAsync: findAssessmentResultDetail } = useFindAssessmentResultDetail();

  useEffect(() => {
    if (testAssessmentResultId) {
      findAssessmentResultDetail(testAssessmentResultId).then(r => setData(r));
    }
  }, [testAssessmentResultId]);

  return (
    <Modal
      size={'small'}
      open={testVisible}
      onClose={setTestVisible}
    >
      <Modal.Header>상세 진단 점수</Modal.Header>
      <Modal.Content>
        <Table celled>
          <colgroup>
            <col width={'50%'} />
            <col width={'50%'} />
          </colgroup>
          <Table.Body>
            <Table.Row>
              <Table.Cell className={'tb-header center'}>진단명</Table.Cell>
              <Table.Cell className={'tb-header center'}>점수</Table.Cell>
            </Table.Row>
            {
              data && data.examResultDetails && data.examResultDetails.map((detail: any) => (
                <Table.Row key={detail.examPaperId}>
                  <Table.Cell className={'tb-header center'}>
                    {getPolyglotToAnyString(detail.name)}
                  </Table.Cell>
                  <Table.Cell className={'center'}>
                    {detail.obtainedScore}
                  </Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button className={'w150 d'} onClick={setTestVisible}>
          확인
        </Button>
      </Modal.Actions>
    </Modal>
  );
});

export default CapabilityModal;
