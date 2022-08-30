import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Breadcrumb, Container, Header, Tab } from 'semantic-ui-react';

import { SelectType } from 'shared/model';

import CreateCommunityBasicInfoContainer from './CreateCommunityBasicInfoContainer';
import PostListContainer from '../../../post/ui/logic/PostListContainer';
import CreatePostBasicInfoContainer from '../../../post/ui/logic/CreatePostBasicInfoContainer';
import SurveyListContainer from 'community/survey/ui/logic/SurveyListContainer';
import SurveyTabContainer from 'community/survey/ui/logic/SurveyTabContainer';

interface CommunityDetailContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    communityId: string;
    postId: string;
    tab: string;
    view: string;
  }> {}

const CommunityDetailContainer: React.FC<CommunityDetailContainerProps> = function CommunityDetailContainer(props) {
  const history = useHistory();

  const [isPostList, setIsPostList] = useState<boolean>(true);
  const [postId, setPostId] = useState<string>('');
  const [isSurveyList, setIsSurveyList] = useState<boolean>(true);
  const [surveyCaseId, setSurveyCaseId] = useState<string>('');
  const [surveyFormId, setSurveyFormId] = useState<string>('');

  const beforeOpenedPanes = [
    {
      menuItem: '기본 정보 관리',
      render: () => (
        <Tab.Pane attached={false}>
          <CreateCommunityBasicInfoContainer />
        </Tab.Pane>
      ),
    },
  ];

  function changeTab(data: any) {
    if (data.activeIndex == 4) {
      history.push(
        `/cineroom/${props.match.params.cineroomId}/community-management/community/board/list/post-list/${props.match.params.communityId}`
      );
    } else if (data.activeIndex == 5) {
      history.push(
        `/cineroom/${props.match.params.cineroomId}/community-management/community/survey/survey-list/${props.match.params.communityId}`
      );
    }
    setActiveIndex(data.activeIndex);
  }

  const [activeIndex, setActiveIndex] = React.useState<string | number | undefined>(
    props.match.params.tab && props.match.params.tab == 'board'
      ? 4
      : props.match.params.tab == 'group'
      ? 1
      : props.match.params.tab == 'survey'
      ? 5
      : 0
  );

  function getOpenedPanes() {
    return [
      {
        menuItem: '기본 정보 관리',
        render: () => (
          <Tab.Pane attached={false}>
            <CreateCommunityBasicInfoContainer />
          </Tab.Pane>
        ),
      },
      // {
      //   menuItem: '멤버 관리',
      //   render: () => (
      //     <Tab.Pane attached={false}>
      //       <CreateCommunityMemberContainer />
      //     </Tab.Pane>
      //   ),
      // },
      // {
      //   menuItem: '메뉴 관리',
      //   render: () => (
      //     <Tab.Pane attached={false}>
      //       <CreateCommunityMenuContainer communityId={props.match.params.communityId} />
      //     </Tab.Pane>
      //   ),
      // },
      // {
      //   menuItem: 'Home Management',
      //   render: () => (
      //     <Tab.Pane attached={false}>
      //       <CreateCommunityHomeContainer />
      //     </Tab.Pane>
      //   ),
      // },
      {
        menuItem: '게시물 관리',
        render: () => (
          // return props.match.params.tab && props.match.params.tab == 'board' && props.match.params.view != 'list' ? (
          //   <Tab.Pane attached={false}>
          //     <CreatePostBasicInfoContainer />
          //   </Tab.Pane>
          // ) : (
          //   <Tab.Pane attached={false}>
          //     <PostListContainer communityId={props.match.params.communityId} />
          //   </Tab.Pane>
          // );

          <Tab.Pane attached={false}>
            {isPostList ? (
              <PostListContainer
                postId={postId}
                communityId={props.match.params.communityId}
                routToDetail={(postId: string) => {
                  setIsPostList(false);
                  setPostId(postId);
                }}
              />
            ) : (
              <CreatePostBasicInfoContainer postId={postId} routeToList={() => setIsPostList(true)} />
            )}
          </Tab.Pane>
        ),
      },
      {
        menuItem: '설문 관리',
        render: () => (
          // console.log('props.match.params : ', props.match.params);
          // return props.match.params.tab &&
          //   props.match.params.tab == 'survey' &&
          //   props.match.params.view != 'survey-list' ? (
          //   <Tab.Pane attached={false}>
          //     <CreateSurveyBasicInfoContainer />
          //   </Tab.Pane>
          // ) : (
          //   <Tab.Pane attached={false}>
          //     <SurveyListContainer communityId={props.match.params.communityId} />
          //   </Tab.Pane>
          // );

          <Tab.Pane attached={false}>
            {isSurveyList ? (
              <SurveyListContainer
                communityId={props.match.params.communityId}
                routToDetail={(surveyCaseId: string, surveyFormId: string) => {
                  setIsSurveyList(false);
                  setSurveyCaseId(surveyCaseId);
                  setSurveyFormId(surveyFormId);
                }}
              />
            ) : (
              <SurveyTabContainer
                surveyCaseId={surveyCaseId}
                surveyFormId={surveyFormId}
                routeToList={() => setIsSurveyList(true)}
              />
            )}
          </Tab.Pane>
        ),
      },
    ];
  }

  return (
    <Container fluid>
      <div>
        <Breadcrumb icon="right angle" sections={SelectType.communitySections} />
        <Header as="h2">Community 관리</Header>
      </div>
      {props.match.params.communityId ? (
        <Tab
          panes={getOpenedPanes()}
          menu={{ secondary: true, pointing: true }}
          activeIndex={activeIndex}
          className="styled-tab"
          onTabChange={(e: any, data: any) => {
            changeTab(data);
          }}
        />
      ) : (
        <Tab panes={beforeOpenedPanes} menu={{ secondary: true, pointing: true }} className="styled-tab" />
      )}
    </Container>
  );
};

export default withRouter(CommunityDetailContainer);
