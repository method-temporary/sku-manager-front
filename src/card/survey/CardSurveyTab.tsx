import React from 'react';
import { useParams } from 'react-router-dom';
import { Tab } from 'semantic-ui-react';
import { ReviewPage } from 'feedback/review/ui/page/ReviewPage';
import { ServiceType } from 'student';
import { SurveyFormService, SurveyFormSummary, SurveyManagementContainer } from 'survey';
import { QuestionItemType } from 'survey/form/model/QuestionItemType';
import CardCreateStore from 'card/create/CardCreate.store';
import CardDetailStore from '../detail/CardDetail.store';
import { observer } from 'mobx-react';

interface Params {
  cardId: string;
}

export const CardSurveyTab = observer(() => {
  const { cardId } = useParams<Params>();
  const { surveyForm } = SurveyFormService.instance;
  const { surveyId, surveyCaseId } = CardCreateStore.instance;

  return (
    <Tab.Pane attached={false}>
      {surveyForm.questions.some((question) => question.questionItemType === QuestionItemType.Review) ? (
        <Tab
          panes={[
            {
              menuItem: '통계',
              render: () => (
                <Tab.Pane>
                  <SurveyFormSummary surveyFormId={surveyId} surveyCaseId={surveyCaseId} round={1} />
                </Tab.Pane>
              ),
            },
            {
              menuItem: '상세',
              render: () => (
                <Tab.Pane>
                  <SurveyManagementContainer
                    id={cardId}
                    surveyFormId={surveyId}
                    surveyCaseId={surveyCaseId}
                    serviceType={ServiceType.Card}
                  />
                </Tab.Pane>
              ),
            },
            {
              menuItem: 'Review',
              render: () => (
                <>
                  <Tab.Pane attached={false}>
                    <ReviewPage surveyCaseId={surveyCaseId} />
                  </Tab.Pane>
                </>
              ),
            },
          ]}
        />
      ) : (
        <Tab
          panes={[
            {
              menuItem: '통계',
              render: () => (
                <Tab.Pane>
                  <SurveyFormSummary surveyFormId={surveyId} surveyCaseId={surveyCaseId} round={1} />
                </Tab.Pane>
              ),
            },
            {
              menuItem: '상세',
              render: () => (
                <Tab.Pane>
                  <SurveyManagementContainer
                    id={cardId}
                    surveyFormId={surveyId}
                    surveyCaseId={surveyCaseId}
                    serviceType={ServiceType.Card}
                  />
                </Tab.Pane>
              ),
            },
          ]}
        />
      )}
    </Tab.Pane>
  );
});
