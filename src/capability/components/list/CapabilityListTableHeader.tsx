import React from 'react';
import { Table } from 'semantic-ui-react';

const CapabilityListTableHeader = () => {
  return (
    <>
      <colgroup>
        <col width="5%" />
        <col width="15%" />
        <col width="15%" />
        <col width="8%" />
        <col width="15%" />
        <col width="9%" />
        <col width="8%" />
        <col width="15%" />
        <col width="10%" />
      </colgroup>

      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">소속 조직(팀)</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">E-mail</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Level</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">시험점수</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">획득일자</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">초기화</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    </>
  );
};

export default CapabilityListTableHeader;
