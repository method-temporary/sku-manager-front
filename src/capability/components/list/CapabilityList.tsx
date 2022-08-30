import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { Button, Form, Table } from 'semantic-ui-react';

import { useFindAssessmentResults } from '../../capability.hook';
import CapabilityStore from '../../capability.store';
import CapabilityModalStore from '../modal/capabilityModal.store';

import CapabilityListTableHeader from './CapabilityListTableHeader';
import TableListEmpty from './TableListEmpty';
import { getPolyglotToAnyString } from '../../../shared/components/Polyglot';
import CapabilityModal from '../modal/CapabilityModal';
import CapabilityResetModal from '../modal/CapabilityResetModal';
import CapabilityPagination from '../CapabilityPagination';

const CapabilityList = observer(() => {
  //
  const { qdo } = CapabilityStore.instance;
  const { setTestVisible, setResetVisible, setTestAssessmentResultId, setResetAssessmentResultId } =
    CapabilityModalStore.instance;
  const { data } = useFindAssessmentResults(qdo);

  const handleTestVisible = (assessmentResultId: string) => {
    setTestVisible();
    setTestAssessmentResultId(assessmentResultId);
  };

  const handleResetVisible = (assessmentResultId: string) => {
    setResetVisible();
    setResetAssessmentResultId(assessmentResultId);
  };

  return (
    <>
      <Form>
        <Table celled>
          <CapabilityListTableHeader />

          <Table.Body>
            {data && data.results && data.results.length ? (
              data.results.map(({ assessmentResult, userIdentity }: any, index: number) => {
                const totalCount = data.totalCount;
                return (
                  <Table.Row key={assessmentResult.id} active={false}>
                    <Table.Cell textAlign={'center'}>{totalCount - qdo.offset - index}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{getPolyglotToAnyString(userIdentity.companyName)}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{getPolyglotToAnyString(userIdentity.departmentName)}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{getPolyglotToAnyString(userIdentity.name)}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{userIdentity.email}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{assessmentResult.level}</Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button onClick={() => handleTestVisible(assessmentResult.id)}>확인</Button>
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      {moment(assessmentResult.completedTime).format('YYYY.MM.DD HH:mm:ss')}
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button onClick={() => handleResetVisible(assessmentResult.id)}>확인</Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <TableListEmpty colspan={9} />
            )}
          </Table.Body>
        </Table>
      </Form>
      <CapabilityPagination />
      <CapabilityModal />

      <CapabilityResetModal />
    </>
  );
});

export default CapabilityList;
