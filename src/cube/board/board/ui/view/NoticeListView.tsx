import * as React from 'react';
import { observer } from 'mobx-react';
import { Breadcrumb, Button, Grid, Header, Table, Icon } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { Loader } from 'shared/components';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { SearchBox, SearchBoxFieldView } from 'shared/ui';

import { PostModel } from '../../../post/model/PostModel';
import { PostQueryModel } from '../../../post/model/PostQueryModel';
import { PostContentsModel } from '../../../post/model/PostContentsModel';

interface Props {
  postQuery: PostQueryModel;
  onChangePostQueryProps: (name: string, value: any) => void;
  onClearPostQueryProps: () => void;
  result: PostModel[];
  totalCount: number;
  routeToCreatePost: () => void;
  handleClickPostRow: (postId: string) => void;
  onSearchPostsBySearchBox: (page?: number) => void;
  pageIndex: number;
  state: string;
}

@observer
@reactAutobind
class NoticeListView extends React.Component<Props> {
  //
  getViewType(contents: PostContentsModel) {
    //
    let usePc = false;
    let useMo = false;

    contents.contents.forEach((content) => {
      if (content.exposureType === 'PC') {
        usePc = true;
      } else {
        useMo = true;
      }
    });

    return `${usePc ? 'PC' : ''} ${usePc && useMo ? '/' : ''} ${useMo ? 'Mobile' : ''}`;
  }

  render() {
    const {
      postQuery,
      onChangePostQueryProps,
      onClearPostQueryProps,
      result,
      totalCount,
      routeToCreatePost,
      handleClickPostRow,
      onSearchPostsBySearchBox,
      pageIndex,
      state,
    } = this.props;
    return (
      <>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.pathForNotice} />
          <Header as="h2">공지사항 관리</Header>
        </div>
        <SearchBox
          onSearch={onSearchPostsBySearchBox}
          onChangeQueryProps={onChangePostQueryProps}
          onClearQueryProps={onClearPostQueryProps}
          queryModel={postQuery}
          searchWordOption={SelectType.searchPartForFaq}
          collegeAndChannel={false}
          defaultPeriod={2}
        >
          <SearchBoxFieldView
            fieldTitle="구분"
            fieldOption={SelectType.noticeType}
            onChangeQueryProps={onChangePostQueryProps}
            targetValue={(postQuery && postQuery.pinned) || 'All'}
            queryFieldName="pinned"
          />
          {/*<label>게시상태</label>*/}
          {/*<Form.Field*/}
          {/*  control={Select}*/}
          {/*  placeholder="Select"*/}
          {/*  options={SelectType.openStateType}*/}
          {/*  onChange={(e: any, data: any) => onChangePostQueryProps('openState', data.value)}*/}
          {/*/>*/}
        </SearchBox>
        <Grid className="list-info">
          <Grid.Row>
            <Grid.Column width={8}>
              {(state === 'default' && (
                <span>
                  전체 <strong>{totalCount}</strong>개 공지사항 등록
                </span>
              )) ||
                (state === 'search' && (
                  <span>
                    총 <strong>{totalCount}</strong>개의 공지사항 검색 결과
                  </span>
                ))}
            </Grid.Column>
            <Grid.Column width={8}>
              <div className="right">
                <Button onClick={routeToCreatePost} type="button">
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
              <col width="10%" />
              <col width="38%" />
              <col width="15%" />
              <col width="12%" />
              <col width="10%" />
            </colgroup>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">구분</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">노출</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">제목</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">작성자</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">상태</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(result &&
                result.length &&
                result.map((post, index) => (
                  <Table.Row key={index}>
                    <Table.Cell textAlign="center">{totalCount - (index + pageIndex)}</Table.Cell>
                    {(post && post.pinned && <Table.Cell textAlign="center">주요</Table.Cell>) ||
                      (post && !post.pinned && <Table.Cell textAlign="center">일반</Table.Cell>) ||
                      ''}
                    <Table.Cell textAlign="center">{this.getViewType(post.contents)}</Table.Cell>
                    <Table.Cell textAlign="left" onClick={() => handleClickPostRow(post.postId && post.postId)}>
                      {getPolyglotToAnyString(post.title, getDefaultLanguage(post.langSupports))}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{post.createdTime}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {post.writer && getPolyglotToAnyString(post.writer.name, getDefaultLanguage(post.langSupports))}
                    </Table.Cell>
                    {(post.openState && post.openState === 'Created' && (
                      <Table.Cell textAlign="center">작성</Table.Cell>
                    )) ||
                      (post.openState && post.openState === 'Opened' && (
                        <Table.Cell textAlign="center">게시</Table.Cell>
                      )) ||
                      (post.openState && post.openState === 'Closed' && (
                        <Table.Cell textAlign="center">게시취소</Table.Cell>
                      ))}
                  </Table.Row>
                ))) || (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={8}>
                    <div className="no-cont-wrap no-contents-icon">
                      <Icon className="no-contents80" />
                      <div className="sr-only">No Contents</div>
                      <div className="text">No search result was found.</div>
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

export default NoticeListView;
