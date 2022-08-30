import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import SurveyTabView from '../view/SurveyTabView';
import { Button } from 'semantic-ui-react';

interface SurveyTabContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    communityId: string;
    postId: string;
    surveyFormId: string;
    surveyCaseId: string;
  }> {
  surveyCaseId: string;
  surveyFormId: string;
  routeToList: () => void;
}

const SurveyTabContainer: React.FC<SurveyTabContainerProps> = function SurveyTabContainer(props) {
  return (
    <>
      <Button onClick={props.routeToList}>List</Button>
      <SurveyTabView surveyFormId={props.surveyFormId} surveyCaseId={props.surveyCaseId} />
    </>
  );
};

export default withRouter(SurveyTabContainer);
