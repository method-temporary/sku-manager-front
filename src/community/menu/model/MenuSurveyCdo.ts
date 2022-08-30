import { SurveyFormModel } from 'survey/form/model/SurveyFormModel';

export default interface MenuSurveyCdo {
  id: string;
  title: string;
  creatorName: string;
}

export function getEmptyMenuSurveyCdo(): MenuSurveyCdo {
  return { id: '', title: '', creatorName: '' };
}

export function fromViewModelToSurveyCdo(
  survey: SurveyFormModel
): MenuSurveyCdo {
  const { id, formDesigner, titles } = survey;

  return {
    id,
    title:
      (titles &&
        titles.langStringMap &&
        ((titles.langStringMap as unknown) as Record<string, string>)[
          titles.defaultLanguage
        ]) ||
      '',
    creatorName:
      (formDesigner.names &&
        formDesigner.names.langStringMap &&
        ((formDesigner.names.langStringMap as unknown) as Record<
          string,
          string
        >)[formDesigner.names.defaultLanguage]) ||
      '',
  };
}
