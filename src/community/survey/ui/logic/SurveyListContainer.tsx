import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useSurveyList } from '../../service/useSurveyList';
import SurveyListView from '../view/SurveyListView';
import { useMenuList } from '../../../menu/service/useMenuList';

interface SurveyListContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    surveyFormId: string;
    communityId: string;
    surveyCaseId: string;
  }> {
  communityId: string;
  routToDetail: (surveyCaseId: string, surveyFormId: string) => void;
}

const SurveyListContainer: React.FC<SurveyListContainerProps> = function SurveyListContainer(props) {
  const [value] = useMenuList();

  const history = useHistory();

  function routeToSurveyDetail(surveyCaseId: string, surveyId: string, commentFeedbackId: string) {
    // history.push(
    //   `/cineroom/${props.match.params.cineroomId}/community-management/community/survey/survey-detail/${props.match.params.communityId}/${surveyCaseId}/${surveyId}/${commentFeedbackId}`
    // );
    props.routToDetail(surveyCaseId, surveyId);
  }

  const [
    surveyList,
    changeSurveyQueryProps,
    searchQuery,
    surveyQuery,
    clearSurveyQuery,
    sharedService,
  ] = useSurveyList();

  changeSurveyQueryProps('communityId', props.communityId);

  return (
    <SurveyListView
      searchQuery={searchQuery}
      surveyQueryModel={surveyQuery}
      changeSurveyQueryProps={changeSurveyQueryProps}
      clearSurveyQuery={clearSurveyQuery}
      surveyList={surveyList}
      routeToSurveyDetail={routeToSurveyDetail}
      sharedService={sharedService}
    />
  );
};

export default withRouter(SurveyListContainer);
