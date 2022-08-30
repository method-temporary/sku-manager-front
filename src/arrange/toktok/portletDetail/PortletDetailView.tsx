import React from 'react';
import { Table } from 'semantic-ui-react';
import { Image } from 'shared/components';
import { PortletDetail } from './portletDetail.models';

interface PortletDetailViewProps {
  portletDetail: PortletDetail;
}

export function PortletDetailView({ portletDetail }: PortletDetailViewProps) {
  return (
    <>
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={5} className="title-header">
              포틀렛 정보
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">성명</Table.Cell>
            <Table.Cell>
              <span>{portletDetail.title}</span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">멤버사 적용 범위</Table.Cell>
            <Table.Cell>{portletDetail.cineroomNames.join(', ')}</Table.Cell>
          </Table.Row>
          {portletDetail.contentItems.map((content) => (
            <>
              <Table.Row>
                <Table.Cell className="tb-header">이미지</Table.Cell>
                <Table.Cell>
                  <Image src={content.imageUrl} />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">내용/링크</Table.Cell>
                <Table.Cell>
                  <span>{content.description}</span>
                  <br />
                  <span>{content.linkUrl}</span>
                </Table.Cell>
              </Table.Row>
            </>
          ))}
          <Table.Row>
            <Table.Cell className="tb-header">노출 기간</Table.Cell>
            <Table.Cell>
              <span>{`${portletDetail.startDate} ~ ${portletDetail.endDate}`}</span>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
}
