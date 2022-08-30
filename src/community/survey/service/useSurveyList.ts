import { useState, useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { Moment } from 'moment';
import { NaOffsetElementList } from 'shared/model';
import { SharedService } from 'shared/present';
import { responseToNaOffsetElementList } from 'shared/helper';
import Survey from '../model/Survey';
import { SurveyQueryModel } from '../model/SurveyQueryModel';
import SurveyStore from '../mobx/SurveyStore';
import { findAllSurveyByQuery } from '../api/SurveyApi';

export default interface SurveyTemp {
  id?: number;
}

export function useSurveyList(): [
  NaOffsetElementList<Survey>,
  (name: string, value: string | number | Moment | undefined) => void,
  () => void,
  SurveyQueryModel,
  () => void,
  SharedService
] {
  const surveyStore = SurveyStore.instance;
  const sharedService = SharedService.instance;

  const [valule, setValue] = useState<NaOffsetElementList<Survey>>(surveyStore.surveyList);

  const [query, setQuery] = useState<SurveyQueryModel>(surveyStore.selectedSurveyQuery);

  useEffect(() => {
    searchQuery();
    return autorun(() => {
      setValue({ ...surveyStore.surveyList });
      setQuery({ ...surveyStore.selectedSurveyQuery });
    });
  }, [surveyStore]);

  const clearSurveyQuery = useCallback(() => {
    surveyStore.clearSurveyQuery();
  }, []);

  const requestFindAllSurveyByQuery = useCallback((surveyQueryModel: SurveyQueryModel) => {
    if (sharedService) {
      if (surveyQueryModel.page) {
        changeSurveyQueryProps('offset', (surveyQueryModel.page - 1) * surveyQueryModel.limit);
        changeSurveyQueryProps('pageIndex', (surveyQueryModel.page - 1) * surveyQueryModel.limit);
        sharedService.setPage('survey', surveyQueryModel.page);
      } else {
        sharedService.setPageMap('survey', 0, surveyQueryModel.limit);
      }
    }

    findAllSurveyByQuery(SurveyQueryModel.asSurveyRdo(surveyQueryModel)).then((response) => {
      const next = responseToNaOffsetElementList<Survey>(response);

      next.limit = surveyQueryModel.limit;
      next.offset = surveyQueryModel.offset;
      sharedService.setCount('survey', next.totalCount);
      surveyStore.setSurveyList(next);
    });
  }, []);

  const changeSurveyQueryProps = useCallback((name: string, value: string | Moment | number | undefined) => {
    if (value === '전체') value = '';

    surveyStore.setSurveyQuery(surveyStore.selectedSurveyQuery, name, value);

    if (name === 'limit') {
      changeSurveyQueryProps('pageIndex', 0);
      changeSurveyQueryProps('page', 0);
      changeSurveyQueryProps('offset', 0);
      searchQuery();
    }
  }, []);

  const searchQuery = useCallback(() => {
    requestFindAllSurveyByQuery(surveyStore.selectedSurveyQuery);
  }, []);

  return [valule, changeSurveyQueryProps, searchQuery, query, clearSurveyQuery, sharedService];
}
