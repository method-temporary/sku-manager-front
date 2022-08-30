import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useCreatePostBasicInfo } from '../../service/useCreatePostBasicInfo';
import CreatePostBasicInfoView from '../view/CreatePostBasicInfoView';
import { usePostList } from '../../service/usePostList';
import { useMenuList } from '../../../menu/service/useMenuList';
import { useEffect } from 'react';

interface CreatePostBasicInfoContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    communityId: string;
    postId: string;
  }> {
  postId: string;
  routeToList: () => void;
}

const CreatePostBasicInfoContainer: React.FC<CreatePostBasicInfoContainerProps> = function CreatePostBasicInfoContainer(
  props
) {
  const history = useHistory();
  function routeToPostList() {
    // history.push(
    //   `/cineroom/${props.match.params.cineroomId}/community-management/community/board/list/post-list/${props.match.params.communityId}`
    // );
    props.routeToList();
  }

  useEffect(() => {
    //
    findPostById(props.match.params.communityId, props.postId);
    changePostCdoProps('postId', props.match.params.postId);
  }, [props.postId]);

  const [value] = useMenuList();
  const [
    post,
    uploadFile,
    savePost,
    changePostCdoProps,
    postCdo,
    findPostById,
    deletePost,
    selectMenu,
  ] = useCreatePostBasicInfo();

  changePostCdoProps('communityId', props.match.params.communityId);

  if (post === undefined || postCdo === undefined) {
    return null;
  } else if (props.match.params.postId && postCdo.title === '') {
    //console.log('props.match:', props.match);
    findPostById(props.match.params.communityId, props.match.params.postId);
    changePostCdoProps('postId', props.match.params.postId);
  }

  return (
    <CreatePostBasicInfoView
      uploadFile={uploadFile}
      selectMenu={selectMenu(value)}
      routeToPostList={routeToPostList}
      savePost={savePost}
      changePostCdoProps={changePostCdoProps}
      postCdo={postCdo}
      deletePost={deletePost}
    />
  );
};

export default withRouter(CreatePostBasicInfoContainer);
