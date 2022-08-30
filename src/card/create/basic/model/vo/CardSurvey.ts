export interface CardSurvey {
  //
  surveyId: string;
  surveyCaseId: string;
  surveyTitle: string;
  surveyDesignerName: string;
}

export function getInitCardSurvey(): CardSurvey {
  //
  return {
    surveyId: '',
    surveyCaseId: '',
    surveyTitle: '',
    surveyDesignerName: '',
  };
}
