import React from 'react';
import { Container, Grid, Pagination, Select, Table, Icon, Form } from 'semantic-ui-react';
import moment from 'moment';
import XLSX from 'xlsx';

import { SharedService } from 'shared/present';
import { NaOffsetElementList, SelectType } from 'shared/model';
import { SubActions } from 'shared/components';
import { SearchBox } from 'shared/ui';

import Post from '../../model/Post';
import { PostQueryModel } from '../../model/PostQueryModel';
import { getPostExcelModel, PostExcelModel } from 'community/post/model/PostExcelModel';

interface PostListViewProps {
  searchQuery: () => void;
  postQueryModel: PostQueryModel;
  routeToPostCreate: () => void;
  changePostQueryProps: (name: string, value: any) => void;
  clearPostQuery: () => void;
  selectMenu: any[];
  postList: NaOffsetElementList<Post>;
  routeToPostDetail: (postId: string) => void;
  sharedService: SharedService;
  excelSearchQuery: () => Promise<null | NaOffsetElementList<Post>>;
}

const PostListView: React.FC<PostListViewProps> = function PostListView({
  searchQuery,
  postQueryModel,
  routeToPostCreate,
  changePostQueryProps,
  clearPostQuery,
  selectMenu,
  postList,
  routeToPostDetail,
  sharedService,
  excelSearchQuery,
}) {
  const fieldSet = postList.results.filter((result, index) => {
    return result.menuType != 'DISCUSSION';
  });
  const totalCount = postList.totalCount;
  const pageIndex = postQueryModel.pageIndex;

  const { pageMap } = sharedService || ({} as SharedService);

  async function onClickExcelDown() {
    const fileName = `커뮤니티 관리 - 게시물 관리.xlsx`;
    excelSearchQuery().then((result) => {
      const wbList: PostExcelModel[] = [];
      result?.results &&
        result?.results.forEach((obj) => {
          wbList.push(getPostExcelModel(obj));
        });
      const sheet = XLSX.utils.json_to_sheet(wbList);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, '게시물 관리');
      XLSX.writeFile(wb, fileName, { compression: true });
    });
    return fileName;
  }

  return (
    <Container fluid>
      <SearchBox
        onSearch={searchQuery}
        onChangeQueryProps={changePostQueryProps}
        onClearQueryProps={clearPostQuery}
        queryModel={postQueryModel}
        searchWordOption={SelectType.searchWordForPost}
        collegeAndChannel={false}
        defaultPeriod={2}
      >
        <Grid.Column width={8}>
          <Form.Group inline>
            <label>메뉴</label>
            <Form.Field
              control={Select}
              placeholder="Select"
              options={selectMenu}
              value={postQueryModel.menuId || '전체' || 'NOTICE'}
              onChange={(e: any, data: any) => changePostQueryProps('menuId', data.value)}
            />
          </Form.Group>
        </Grid.Column>
      </SearchBox>
      <Grid className="list-info">
        <Grid.Row>
          <Grid.Column width={8}>
            <span>
              전체 <strong>{postList.totalCount}</strong>개 게시물 등록
            </span>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="right">
              <SubActions.ExcelButton download onClick={onClickExcelDown} />
              <Select
                className="ui small-border dropdown m0"
                defaultValue={SelectType.limit[0].value}
                control={Select}
                options={SelectType.limit}
                onChange={(e: any, data: any) => changePostQueryProps('limit', data.value)}
              />
              {/* <Button type="button" onClick={routeToPostCreate}>
                <Icon name="plus" />
                Create
              </Button> */}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="20%" />
          <col />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">메뉴</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">게시물명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Email</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">작성자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록일</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {postList && postList.results.length ? (
            fieldSet.map((post, index) => {
              let menuTypeChk = true;
              return (
                <Table.Row
                  key={index}
                  onClick={() => {
                    post.menuType === null ||
                    post.menuType === 'BASIC' ||
                    post.menuType === 'DISCUSSION' ||
                    post.menuType === 'ANONYMOUS' ||
                    post.menuType === 'NOTICE' ||
                    post.menuType === 'STORE' ||
                    post.menuType === 'SURVEY'
                      ? routeToPostDetail(post.postId || '')
                      : (menuTypeChk = false);
                  }}
                >
                  <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                  <Table.Cell textAlign="center">{post.menuName === null ? '공지사항' : post.menuName}</Table.Cell>
                  <Table.Cell textAlign="center">{post.title}</Table.Cell>
                  <Table.Cell textAlign="center">{post.creatorEmail || '-'}</Table.Cell>
                  <Table.Cell textAlign="center">{post.nickName === '' ? post.creatorName : post.nickName}</Table.Cell>
                  <Table.Cell textAlign="center">{moment(post.createdTime).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
                </Table.Row>
              );
            })
          ) : (
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
                    activePage={pageMap.get('post') ? pageMap.get('post').page : 1}
                    totalPages={pageMap.get('post') ? pageMap.get('post').totalPages : 1}
                    onPageChange={(e, data) => {
                      changePostQueryProps('page', data.activePage);
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

export default PostListView;
