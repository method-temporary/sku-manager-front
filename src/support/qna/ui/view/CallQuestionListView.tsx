import * as React from 'react';
import { observer } from 'mobx-react';
import { Breadcrumb, Grid, Header, Table, Icon, Button } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { Loader, SubActions } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { SearchBox, SearchBoxFieldView } from 'shared/ui';

import { PostModel } from '../../../../cube/board/post/model/PostModel';
import { PostQueryModel } from '../../../../cube/board/post/model/PostQueryModel';

interface Props {
  postQuery: PostQueryModel;
  onChangePostQueryProps: (name: string, value: any) => void;
  onClearPostQuery: () => void;
  result: PostModel[];
  totalCount: number;
  routeToCreatePost: () => void;
  categoryOptions: SelectTypeModel[];
  handleClickPostRow: (postId: string) => void;
  onSearchPostsBySearchBox: (page?: number) => void;
  pageIndex: number;
  state: string;
  companyOptions: SelectTypeModel[];
  findAllCallQuestionExcel: () => void;
}

@observer
@reactAutobind
class CallQuestionListView extends React.Component<Props> {
  //
  render() {
    const {
      postQuery,
      onChangePostQueryProps,
      onClearPostQuery,
      result,
      totalCount,
      categoryOptions,
      companyOptions,
      handleClickPostRow,
      onSearchPostsBySearchBox,
      pageIndex,
      state,
      findAllCallQuestionExcel,
      routeToCreatePost,
    } = this.props;
    return (
      <>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.pathForCallQna} />
          <Header as="h2">전화문의 관리</Header>
        </div>
        <SearchBox
          onSearch={onSearchPostsBySearchBox}
          onChangeQueryProps={onChangePostQueryProps}
          onClearQueryProps={onClearPostQuery}
          queryModel={postQuery}
          searchWordOption={SelectType.searchWordForBoard}
          collegeAndChannel={false}
          defaultPeriod={2}
        >
          <SearchBoxFieldView
            fieldTitle="카테고리"
            fieldOption={categoryOptions}
            onChangeQueryProps={onChangePostQueryProps}
            targetValue={(postQuery && postQuery.categoryName) || 'All'}
            queryFieldName="categoryName"
            placeholder="전체"
          />
          <SearchBoxFieldView
            fieldTitle="답변상태"
            fieldOption={SelectType.answerStatus}
            onChangeQueryProps={onChangePostQueryProps}
            targetValue={postQuery.answered === false ? false : postQuery.answered || 'All'}
            queryFieldName="answered"
          />
          <SearchBoxFieldView
            fieldTitle="소속사"
            fieldOption={companyOptions}
            onChangeQueryProps={onChangePostQueryProps}
            targetValue={postQuery.companyCode === false ? false : postQuery.companyCode || 'All'}
            queryFieldName="companyCode"
            placeholder="전체"
          />
        </SearchBox>
        <Grid className="list-info">
          <Grid.Row>
            <Grid.Column width={8}>
              {(state === 'default' && (
                <span>
                  전체 <strong>{totalCount}</strong>개 전화문의 등록
                </span>
              )) ||
                (state === 'search' && (
                  <span>
                    총 <strong>{totalCount}</strong>개 전화문의 검색 결과
                  </span>
                ))}
            </Grid.Column>
            <Grid.Column width={8}>
              <div className="right">
                <SubActions.ExcelButton download onClick={async () => findAllCallQuestionExcel()} />
                <Button onClick={routeToCreatePost}>
                  <Icon name="plus" />
                  Create
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Loader>
          <Table celled selectable>
            <colgroup>
              <col width="5%" />
              <col width="10%" />
              <col width="35%" />
              <col width="10%" />
              <col width="10%" />
              <col width="18%" />
            </colgroup>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">카테고리</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">제목</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">문의자</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Email</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">처리상태</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(result &&
                result.length &&
                result.map((post, index) => (
                  <Table.Row key={index}>
                    <Table.Cell textAlign="center">{totalCount - (index + pageIndex)}</Table.Cell>
                    <Table.Cell textAlign="center">{getPolyglotToAnyString(post.category.name)}</Table.Cell>
                    <Table.Cell textAlign="left" onClick={() => handleClickPostRow(post.postId)}>
                      {getPolyglotToAnyString(post.title)}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{post.createdTime}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {post.writer && getPolyglotToAnyString(post.writer.name)}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{getPolyglotToAnyString(post.writer.companyName)}</Table.Cell>
                    <Table.Cell textAlign="center">{post.writer.email}</Table.Cell>
                    {(post && post.answered && post.answeredAt !== 0 && (
                      <Table.Cell textAlign="center">
                        답변완료 | {post && moment(post.answeredAt).format('YYYY.MM.DD HH:mm:ss')}
                      </Table.Cell>
                    )) ||
                      (post.answered && (
                        <Table.Cell textAlign="center">
                          답변 대기
                          {/* | {post && moment(post.answeredAt).format('YYYY.MM.DD HH:mm:ss')} */}
                        </Table.Cell>
                      )) ||
                      (post && !post.answered && <Table.Cell textAlign="center">답변대기</Table.Cell>)}
                  </Table.Row>
                ))) || (
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
        </Loader>
      </>
    );
  }
}

export default CallQuestionListView;
