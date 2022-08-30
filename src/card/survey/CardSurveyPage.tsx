import React, { useEffect } from 'react';
import CardCreateStore from 'card/create/CardCreate.store';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { SubActions } from 'shared/components';
import { onDownLoadSurveyExcel } from 'survey/Survey.util';
import { SurveyNotFoundPage } from './SurveyNotFoundPage';
import { CardSurveyTab } from './CardSurveyTab';
import CardDetailStore from '../detail/CardDetail.store';
import { SurveyFormService } from '../../survey';
import { observer } from 'mobx-react';

export const CardSurveyPage = observer(() => {
  const { surveyId, surveyCaseId, name } = CardCreateStore.instance;
  const { cardSurveyFrom } = CardDetailStore.instance;
  const { setSurveyForm, surveyForm } = SurveyFormService.instance;

  useEffect(() => {
    if (surveyForm.questions.length === 0) {
      setSurveyForm(cardSurveyFrom);
    }
  }, [surveyForm]);

  if (!surveyId || !surveyCaseId) {
    return <SurveyNotFoundPage />;
  }

  return (
    <>
      <p className="tab-text">{getPolyglotToAnyString(name)}</p>
      <br />
      <SubActions.ExcelButton download onClick={async () => onDownLoadSurveyExcel(surveyId, surveyCaseId, name)} />
      <CardSurveyTab />
    </>
  );
});
