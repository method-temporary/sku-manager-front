import React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import { TestListItem, TestListViewModel } from 'exam/viewmodel/TestListViewModel';

interface TestListViewProps {
  totalCount: number;
  testList: TestListItem[];
  pageNo: number;
  limit: number;
  onClickCopyTest: (testItem: TestListItem) => void;
  onClickTestDetail: (testId: string, isFinalVerison: boolean) => void;
  workspaces: { key: string; value: string; text: string }[];
}

export function TestListView({
  totalCount,
  testList,
  pageNo,
  limit,
  onClickCopyTest,
  onClickTestDetail,
  workspaces,
}: TestListViewProps) {
  return (
    <Table celled selectable className="table-fixed">
      <colgroup>
        <col width="7%" />
        {/* <col width="5%" />
        <col width="9%" /> */}
        <col width="%" />
        {/* <col width="9%" />
        <col width="9%" /> */}
        <col width="12%" />
        <col width="12%" />
        <col width="12%" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
          {/* <Table.HeaderCell textAlign="center">Language</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">멤버사</Table.HeaderCell> */}
          <Table.HeaderCell textAlign="center">test 제목</Table.HeaderCell>
          {/* <Table.HeaderCell textAlign="center">출제 방식</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">최종본 여부</Table.HeaderCell> */}
          <Table.HeaderCell textAlign="center">등록자</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">시험지 복사</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {(testList &&
          testList.length > 0 &&
          testList.map((test: TestListItem, index) => {
            return (
              <Table.Row key={test.id}>
                <Table.Cell onClick={() => onClickTestDetail(test.id, test.isFinalVersion)} textAlign="center">
                  {getTestNo(totalCount, pageNo, limit, index)}
                </Table.Cell>
                {/* <Table.Cell onClick={() => onClickTestDetail(test.id, test.isFinalVersion)}>{test.language}</Table.Cell>
                <Table.Cell onClick={() => onClickTestDetail(test.id, test.isFinalVersion)} textAlign="center">
                  {workspaces.find(
                    (item) => item.value === test?.patronKey?.keyString.slice(test.patronKey.keyString.indexOf('@') + 1)
                  )?.text || ''}
                </Table.Cell> */}
                <Table.Cell onClick={() => onClickTestDetail(test.id, test.isFinalVersion)}>{test.title}</Table.Cell>
                {/* <Table.Cell onClick={() => onClickTestDetail(test.id, test.isFinalVersion)} textAlign="center">
                  {test.questionSelectionTypeText}
                </Table.Cell>
                <Table.Cell onClick={() => onClickTestDetail(test.id, test.isFinalVersion)} textAlign="center">
                  {(test.isFinalVersion && '최종본') || '수정가능본'}
                </Table.Cell> */}
                <Table.Cell onClick={() => onClickTestDetail(test.id, test.isFinalVersion)} textAlign="center">
                  {test.creatorName}
                </Table.Cell>
                <Table.Cell onClick={() => onClickTestDetail(test.id, test.isFinalVersion)} textAlign="center">
                  {test.createDate}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <Button onClick={() => onClickCopyTest(test)}>복사</Button>
                </Table.Cell>
              </Table.Row>
            );
          })) || (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={7}>
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
}

export function getTestNo(totalCount: number, pageNo: number, limit: number, index: number) {
  return totalCount - (pageNo - 1) * limit - index;
}
