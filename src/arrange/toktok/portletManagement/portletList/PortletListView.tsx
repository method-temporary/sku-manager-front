import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { PortletListItem } from './portletList.models';
import { getPortletNo } from './portletList.services';

interface PortletListViewProps {
  items: PortletListItem[];
  onClickItem: (id: string) => void;
}

export function PortletListView({ items, onClickItem }: PortletListViewProps) {
  return (
    <Table celled selectable className="table-fixed">
      <colgroup>
        <col width="5%" />
        <col width="30%" />
        <col width="30%" />
        <col width="15%" />
        <col width="10%" />
        <col width="10%" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">제목</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">멤버사 적용 범위</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">노출기간</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {(items.length > 0 &&
          items.map((item: PortletListItem, index) => {
            return (
              <Table.Row key={item.id} onClick={() => onClickItem(item.id)}>
                <Table.Cell textAlign="center">{getPortletNo(index)}</Table.Cell>
                <Table.Cell>
                  <span className="ellipsis">{item.title}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="ellipsis">{item.cineroomNames}</span>
                </Table.Cell>
                <Table.Cell textAlign="center">{`${item.displayStartDate} ~ ${item.displayEndDate}`}</Table.Cell>
                <Table.Cell textAlign="center">{item.registrantName}</Table.Cell>
                <Table.Cell textAlign="center">{item.registeredTime}</Table.Cell>
              </Table.Row>
            );
          })) || (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={6}>
              <div className="no-cont-wrap no-contents-icon">
                <Icon className="no-contents80" />
                <div className="sr-only">콘텐츠 없음</div>
                <div className="text">검색 결과가 없습니다.</div>
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}
