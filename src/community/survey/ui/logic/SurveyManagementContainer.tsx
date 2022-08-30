import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import SurveyManagementView from '../view/SurveyManagementView';
import { useSurveyList } from 'community/survey/service/useSurveyList';
import { useSurveyManagement } from 'community/survey/service/useSurveyManagement';

interface SurveyManagementContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    communityId: string;
    postId: string;
  }> {
  surveyFormId: string;
  surveyCaseId: string;
}
const SurveyManagementContainer: React.FC<SurveyManagementContainerProps> = function SurveyManagementContainer(
  props
) {
  const history = useHistory();
  function routeToPostList() {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/board/list/post-list/${props.match.params.communityId}`
    );
  }

  const [
    surveyList,
    changeSurveyMemberQueryProps,
    searchQuery,
    surveyMemberQuery,
    clearSurveyMemberQuery,
    sharedService,
  ] = useSurveyManagement();

  // console.log('props.surveyCaseId) : ', props.surveyCaseId);

  changeSurveyMemberQueryProps('communityId', props.match.params.communityId);
  changeSurveyMemberQueryProps('surveyCaseId', props.surveyCaseId);

  return (
    <SurveyManagementView
      searchQuery={searchQuery}
      surveyMemberQueryModel={surveyMemberQuery}
      changeSurveyMemberQueryProps={changeSurveyMemberQueryProps}
      clearSurveyMemberQuery={clearSurveyMemberQuery}
      surveyList={surveyList}
      sharedService={sharedService}
      surveyFormId={props.surveyFormId}
      surveyCaseId={props.surveyCaseId}
    />
  );
};

export default withRouter(SurveyManagementContainer);
