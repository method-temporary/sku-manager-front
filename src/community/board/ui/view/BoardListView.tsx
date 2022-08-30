import React from 'react';
import { Container, Grid, Pagination, Select, Table, Icon, Form } from 'semantic-ui-react';
import moment from 'moment';

import { SelectType, NaOffsetElementList } from 'shared/model';
import { SharedService } from 'shared/present';
import { SearchBox } from 'shared/ui';

import Board from '../../model/Board';
import { BoardQueryModel } from '../../model/BoardQueryModel';

interface BoardListViewProps {
  searchQuery: () => void;
  boardQueryModel: BoardQueryModel;
  changeBoardQueryProps: (name: string, value: any) => void;
  field: string;
  clearBoardQuery: () => void;
  selectField: any[];
  boardList: NaOffsetElementList<Board>;
  routeToBoardDetail: (boardId: string, postId: string) => void;
  sharedService: SharedService;
}

const BoardListView: React.FC<BoardListViewProps> = function BoardListView({
  searchQuery,
  boardQueryModel,
  changeBoardQueryProps,
  field,
  clearBoardQuery,
  selectField,
  boardList,
  routeToBoardDetail,
  sharedService,
}) {
  const totalCount = boardList.totalCount;
  const pageIndex = boardQueryModel.pageIndex;

  const { pageMap } = sharedService || ({} as SharedService);
  return (
    <Container fluid>
      <SearchBox
        onSearch={searchQuery}
        onChangeQueryProps={changeBoardQueryProps}
        onClearQueryProps={clearBoardQuery}
        queryModel={boardQueryModel}
        searchWordOption={SelectType.searchWordForBoard}
        collegeAndChannel={false}
        defaultPeriod={2}
      >
        <Grid.Column width={8}>
          <Form.Group inline>
            <label>커뮤니티 메뉴</label>
            <Form.Field
              control={Select}
              placeholder="Select"
              options={selectField}
              value={field || '전체'}
              onChange={(e: any, data: any) => changeBoardQueryProps('field', data.value)}
            />
          </Form.Group>
        </Grid.Column>
      </SearchBox>
      <Grid className="list-info">
        <Grid.Row>
          <Grid.Column width={8}>
            <span>
              전체 <strong>{boardList.totalCount}</strong>개 게시물 등록
            </span>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="right">
              <Select
                className="ui small-border dropdown m0"
                defaultValue={SelectType.limit[0].value}
                control={Select}
                options={SelectType.limit}
                onChange={(e: any, data: any) => changeBoardQueryProps('limit', data.value)}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="18%" />
          <col width="52%" />
          <col width="5%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">메뉴명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">제목</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">작성자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록일</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(boardList &&
            boardList.results.map((board, index) => {
              return (
                <Table.Row key={index} onClick={() => routeToBoardDetail(board.boardId || '', board.id || '')}>
                  <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                  <Table.Cell textAlign="center">{board.boardId}</Table.Cell>
                  <Table.Cell textAlign="center">{board.title}</Table.Cell>
                  <Table.Cell textAlign="center">{board.writer}</Table.Cell>
                  <Table.Cell textAlign="center">{moment(board.time).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
                </Table.Row>
              );
            })) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={8}>
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
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            {totalCount === 0 ? null : (
              <>
                <div className="center">
                  <Pagination
                    activePage={pageMap.get('board') ? pageMap.get('board').page : 1}
                    totalPages={pageMap.get('board') ? pageMap.get('board').totalPages : 1}
                    onPageChange={(e, data) => {
                      changeBoardQueryProps('page', data.activePage);
                      searchQuery();
                    }}
                  />
                </div>
              </>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default BoardListView;
