import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useCreateBoardBasicInfo } from '../../service/useCreateBoardBasicInfo';
import CreateBoardBasicInfoView from '../view/CreateBoardBasicInfoView';
import { useFieldList } from '../../../field/service/useFieldList';
import { useBoardList } from '../../service/useBoardList';
import PostModel from '../../model/PostModel';

interface CreateBoardBasicInfoContainerProps
  extends RouteComponentProps<{ cineroomId: string; boardId: string }> {}
const CreateBoardBasicInfoContainer: React.FC<CreateBoardBasicInfoContainerProps> = function CreateBoardBasicInfoContainer(
  props
) {
  const history = useHistory();
  function routeToBoardList() {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/community-list`
    );
  }
  const [fieldList] = useFieldList();
  const [
    boardList,
    requestBoardList,
    limit,
    changeLimit,
    changeBoardQueryProps,
    searchQuery,
    boardQuery,
    clearBoardQuery,
    selectField,
  ] = useBoardList();
  const [
    post,
    onChangeBoardName,
    onChangeBoardDescription,
    uploadFile,
    saveBoard,
    changeBoardCdoProps,
    boardCdo,
    findPost,
  ] = useCreateBoardBasicInfo();

  if (post === undefined) {
    return null;
  } else if (post.title === '') {
    findPost(props.match.params.boardId);
  }
  const postModel = new PostModel();

  return (
    <CreateBoardBasicInfoView
      title={post?.title || ''}
      contents={post?.title || ''}
      writer={post?.title || ''}
      onChangeBoardName={onChangeBoardName}
      onChangeBoardDescription={onChangeBoardDescription}
      uploadFile={uploadFile}
      selectField={selectField(fieldList)}
      routeToBoardList={routeToBoardList}
      saveBoard={saveBoard}
      changeBoardCdoProps={changeBoardCdoProps}
      boardCdo={boardCdo}
      // match={props.match}
      //boardCdoType={boardCdo?.type || ''}
      confirmWinOpen={false}
      post={post}
      handleDelete={() => {}}
      routeToModifyFaq={routeToBoardList}
      routeToPostList={routeToBoardList}
    />
  );
};

export default withRouter(CreateBoardBasicInfoContainer);
