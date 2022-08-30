import { observer } from 'mobx-react';
import React from 'react';
import { Form, Icon, Radio, Table } from 'semantic-ui-react';
import { ContentProviderContent } from '../../../_data/cube/contentProviderAdmin/model/ContentProviderContent';
import dayjs from 'dayjs';

interface Props {
  contentProviderContents: ContentProviderContent[];
  selectedContentId: string;
  onClickRadio: (contentId: string) => void;
}

export const CourseListTable = observer((props: Props) => {
  //
  const { contentProviderContents, selectedContentId } = props;
  const { onClickRadio } = props;

  return (
    <Table celled className="selectable">
      <colgroup>
        <col width="5%" />
        <col width="20%" />
        <col width="35%" />
        <col width="10%" />
        <col width="10%" />
        <col width="10%" />
        <col width="10%" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>선택</Table.HeaderCell>
          {/*<Table.HeaderCell>contentProviderId</Table.HeaderCell>*/}
          {/*<Table.HeaderCell>id</Table.HeaderCell>*/}
          <Table.HeaderCell>title</Table.HeaderCell>
          <Table.HeaderCell>linkMediaUrl</Table.HeaderCell>
          <Table.HeaderCell>수정일</Table.HeaderCell>
          <Table.HeaderCell>등록일</Table.HeaderCell>
          <Table.HeaderCell>상태</Table.HeaderCell>
          <Table.HeaderCell>타입</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {(contentProviderContents &&
          contentProviderContents.length > 0 &&
          contentProviderContents.map((content) => {
            return (
              <Table.Row key={content.id}>
                <Table.Cell>
                  <Form.Field
                    control={Radio}
                    value="1"
                    checked={content.id === selectedContentId}
                    onChange={() => onClickRadio(content.id)}
                    disabled={content.status === 'RETIRED'}
                  />
                </Table.Cell>
                {/*<Table.Cell>{content.contentProviderId}</Table.Cell>*/}
                {/*<Table.Cell>{content.id}</Table.Cell>*/}
                <Table.Cell>{content.title}</Table.Cell>
                <Table.Cell>{content.linkMediaUrl}</Table.Cell>
                <Table.Cell>{dayjs(content.modifiedTime).format('YY.MM.DD')}</Table.Cell>
                <Table.Cell>{dayjs(content.registeredTime).format('YY.MM.DD')}</Table.Cell>
                <Table.Cell>{content.status}</Table.Cell>
                <Table.Cell>{content.type}</Table.Cell>
              </Table.Row>
            );
          })) || (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={9}>
              <div className="no-cont-wrap no-contents-icon">
                <Icon className="no-contents80" />
                <div className="sr-only">콘텐츠 없음</div>
                <div className="text">검색 결과를 찾을 수 없습니다.</div>
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
});
