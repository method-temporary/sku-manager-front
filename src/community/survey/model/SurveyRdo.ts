export default interface SurveyRdo {
  limit: number;
  offset: number;

  name?: string;
  surveyInformation?: string;
  surveyCaseId?: string;

  surveyId?: string;
  communityId?: string;
}
