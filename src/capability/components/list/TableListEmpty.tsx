import React from 'react';
import { Icon, Table } from 'semantic-ui-react';

interface Props {
  colspan: number;
}

const TableListEmpty = (props: Props) => {
  //
  const { colspan } = props;

  return (
    <Table.Row>
      <Table.Cell textAlign="center" colSpan={colspan}>
        <div className="no-cont-wrap no-contents-icon">
          <Icon className="no-contents80" />
          <div className="sr-only">콘텐츠 없음</div>
          <div className="text">검색 결과를 찾을 수 없습니다.</div>
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

export default TableListEmpty;
