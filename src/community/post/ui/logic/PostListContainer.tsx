import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { usePostList } from '../../service/usePostList';
import PostListView from '../view/PostListView';
import { useMenuList } from '../../../menu/service/useMenuList';
import { Loader } from 'shared/components';

interface PostListContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    postId: string;
    communityId: string;
  }> {
  postId: string;
  communityId: string;
  routToDetail: (postId: string) => void;
}

const PostListContainer: React.FC<PostListContainerProps> = function PostListContainer(props) {
  const [value] = useMenuList();

  const history = useHistory();

  function routeToPostCreate() {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/board/post-create/${props.match.params.communityId}`
    );
  }

  function routeToPostDetail(postId: string) {
    // history.push(
    //   `/cineroom/${props.match.params.cineroomId}/community-management/community/board/post-detail/${props.match.params.communityId}/${postId}`
    // );
    props.routToDetail(postId);
  }

  const [
    postList,
    changePostQueryProps,
    searchQuery,
    postQuery,
    clearPostQuery,
    selectMenu,
    sharedService,
    excelSearchQuery,
  ] = usePostList();

  changePostQueryProps('communityId', props.communityId);

  return (
    <Loader>
      <PostListView
        searchQuery={searchQuery}
        postQueryModel={postQuery}
        routeToPostCreate={routeToPostCreate}
        changePostQueryProps={changePostQueryProps}
        clearPostQuery={clearPostQuery}
        selectMenu={selectMenu(value)}
        postList={postList}
        routeToPostDetail={routeToPostDetail}
        sharedService={sharedService}
        excelSearchQuery={excelSearchQuery}
      />
    </Loader>
  );
};

export default withRouter(PostListContainer);
