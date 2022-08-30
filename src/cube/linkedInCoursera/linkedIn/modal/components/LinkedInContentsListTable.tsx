import { observer } from 'mobx-react';
import React from 'react';
import { Form, Icon, Radio, Table } from 'semantic-ui-react';
import LinkedInCourseListModalStore from '../LinkedInCourseListModal.store';
import { CpContent } from '../../../../../_data/contentProvider/cpContent/model/CpContent';
import dayjs from 'dayjs';

interface Props {
  cpContents: CpContent | undefined;
  selectedContentId: string;
  onClickRadio: (contentId: string) => void;
}

export const LinkedInContentListTable = observer((props: Props) => {
  //
  const { selectedContentId, cpContents } = props;
  const { onClickRadio } = props;
  const { cpContentsParams } = LinkedInCourseListModalStore.instance;

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
        {(cpContents && (
          <Table.Row key={cpContents.usid}>
            <Table.Cell>
              <Form.Field
                control={Radio}
                value="1"
                checked={cpContents.usid === selectedContentId}
                onChange={() => onClickRadio(cpContents.usid)}
              />
            </Table.Cell>
            {/*<Table.Cell>{cpContents.contentProviderId}</Table.Cell>*/}
            {/*<Table.Cell>{cpContents.usid}</Table.Cell>*/}
            <Table.Cell>{cpContents.title}</Table.Cell>
            <Table.Cell>{cpContents.linkMediaUrl}</Table.Cell>
            <Table.Cell>{dayjs(cpContents.modifiedTime).format('YY.MM.DD')}</Table.Cell>
            <Table.Cell>{dayjs(cpContents.registeredTime).format('YY.MM.DD')}</Table.Cell>
            <Table.Cell>{cpContents.status}</Table.Cell>
            <Table.Cell>{cpContents.type}</Table.Cell>
          </Table.Row>
        )) || (
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
