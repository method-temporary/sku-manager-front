import * as React from 'react';
import { observer } from 'mobx-react';
import { Moment } from 'moment';
import { Breadcrumb, Button, Grid, Header, Icon, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { Loader } from 'shared/components';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { SearchBox, SearchBoxFieldView } from 'shared/ui';

import { PostModel } from '../../../../cube/board/post/model/PostModel';
import { PostQueryModel } from '../../../../cube/board/post/model/PostQueryModel';

interface Props {
  postQuery: PostQueryModel;
  onChangePostQueryProps: (name: string, value: string | Moment | number) => void;
  result: PostModel[];
  totalCount: number;
  routeToCreatePost: () => void;
  addCategoryList: () => void;
  findPostsBySearch: () => void;
  onClearPostQuery: () => void;
  handleClickPostRow: (postId: string) => void;
  onSearchPostsBySearchBox: (page?: number) => void;
  pageIndex: number;
  state: string;
  changeDateToString: (date: Date) => string;
  getPinnedName: (pinned: boolean) => string;
}

@observer
@reactAutobind
class FaqListView extends React.Component<Props> {
  //
  render() {
    const {
      postQuery,
      onChangePostQueryProps,
      result,
      totalCount,
      routeToCreatePost,
      addCategoryList,
      handleClickPostRow,
      onClearPostQuery,
      onSearchPostsBySearchBox,
      pageIndex,
      state,
      changeDateToString,
      getPinnedName,
    } = this.props;
    const categoryList: any = addCategoryList();
    return (
      <>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.pathForFaq} />
          <Header as="h2">FAQ 관리</Header>
        </div>
        <SearchBox
          onSearch={onSearchPostsBySearchBox}
          onChangeQueryProps={onChangePostQueryProps}
          onClearQueryProps={onClearPostQuery}
          queryModel={postQuery}
          searchWordOption={SelectType.searchPartForFaq}
          collegeAndChannel={false}
          defaultPeriod={2}
        >
          <SearchBoxFieldView
            fieldTitle="카테고리"
            fieldOption={categoryList}
            onChangeQueryProps={onChangePostQueryProps}
            targetValue={(postQuery && postQuery.categoryName) || 'All'}
            queryFieldName="categoryName"
          />
        </SearchBox>
        <Grid className="list-info">
          <Grid.Row>
            <Grid.Column width={8}>
              {(state === 'default' && (
                <span>
                  전체 <strong>{totalCount}</strong>개 FAQ 등록
                </span>
              )) ||
                (state === 'search' && (
                  <span>
                    총 <strong>{totalCount}</strong>개 FAQ 검색결과
                  </span>
                ))}
            </Grid.Column>
            <Grid.Column width={8}>
              <div className="right">
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
              <col width="8%" />
              <col width="5%" />
              <col width="52%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">카테고리</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">구분</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">제목</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">작성자</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(result &&
                result.length &&
                result.map((post, index) => (
                  <Table.Row key={index}>
                    <Table.Cell textAlign="center">{totalCount - (index + pageIndex)}</Table.Cell>
                    <Table.Cell textAlign="center">{getPolyglotToAnyString(post.category.name)}</Table.Cell>
                    <Table.Cell textAlign="center">{getPinnedName(post.pinned)}</Table.Cell>
                    <Table.Cell textAlign="left" onClick={() => handleClickPostRow(post.postId && post.postId)}>
                      {getPolyglotToAnyString(post.title, getDefaultLanguage(post.langSupports))}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {changeDateToString(new Date(post.registeredTime))}&nbsp;
                      {post.registeredTime && new Date(post.registeredTime).toLocaleTimeString('en-GB').substring(0, 5)}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {post.writer && getPolyglotToAnyString(post.writer.name, getDefaultLanguage(post.langSupports))}
                    </Table.Cell>
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

export default FaqListView;
