import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import CreateCommunityMenuView from '../view/CreateCommunityMenuView';
import { useMenuList } from '../../service/useMenuList';
import { useSelectedMenu } from '../../service/useSelectedMenu';
import { useEffect } from 'react';
import MenuStore from 'community/menu/mobx/MenuStore';

interface CreateCommunityMenuContainerProps

  extends RouteComponentProps<{
    communityId: string;
  }> {
  communityId: string;
}

const CreateCommunityMenuContainer: React.FC<CreateCommunityMenuContainerProps>
  = function CreateCommunityMenuInfoContainer(props) {
    const [
      menus,
      appendMenu,
      appendSubMenu,
      removeMenu,
      save,
      loading,
    ] = useMenuList();
    const [
      selectedMenu,
      select,
      changeName,
      changeType,
      changeAccessTypeToCommunityAllMember,
      changeAccessTypeToCommunityGroup,
      changeGroupId,
      changeUrl,
      changeHtml,
      changeDiscussionTopic,
      changeSurveyInformation,
      stopEditing,
      ,
      selectedMenuSurvey,
      changeDiscussionFileBoxId,
      changeDiscussionContent,
      changeDiscussionRelatedUrlList,
      setDiscussionRelatedUrlList,
      changeDiscussionPrivateComment,
      minusDiscussionRelatedUrlList,
      menuDiscussionCdo
    ] = useSelectedMenu();

    useEffect(() => {
      MenuStore.instance.initSelected()
    }, []);


    return (
      <CreateCommunityMenuView
        menus={menus}
        appendMenu={appendMenu}
        appendSubMenu={appendSubMenu}
        removeMenu={removeMenu}
        selectedMenu={selectedMenu}
        selectedMenuSurvey={selectedMenuSurvey}
        select={select}
        changeName={changeName}
        changeType={changeType}
        changeAccessTypeToCommunityAllMember={
          changeAccessTypeToCommunityAllMember
        }
        changeAccessTypeToCommunityGroup={changeAccessTypeToCommunityGroup}
        changeGroupId={changeGroupId}
        changeUrl={changeUrl}
        changeHtml={changeHtml}
        changeDiscussionTopic={changeDiscussionTopic}
        changeSurveyInformation={changeSurveyInformation}
        stopEditing={stopEditing}
        save={save}
        loading={loading}
        changeDiscussionFileBoxId={changeDiscussionFileBoxId}
        changeDiscussionContent={changeDiscussionContent}
        changeDiscussionRelatedUrlList={changeDiscussionRelatedUrlList}
        setDiscussionRelatedUrlList={setDiscussionRelatedUrlList}
        changeDiscussionPrivateComment={changeDiscussionPrivateComment}
        minusDiscussionRelatedUrlList={minusDiscussionRelatedUrlList}
        menuDiscussionCdo={menuDiscussionCdo}
      />
    );
  };

export default withRouter(CreateCommunityMenuContainer);
