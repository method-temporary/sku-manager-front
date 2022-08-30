import { useState, useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { Moment } from 'moment';

import { NaOffsetElementList } from 'shared/model';
import { SharedService } from 'shared/present';
import { responseToNaOffsetElementList } from 'shared/helper';

import Survey from '../model/Survey';
import Member from '../model/Member';
import SurveyMemberStore from '../mobx/SurveyMemberStore';
import { SurveyMemberQueryModel } from '../model/SurveyMemberQueryModel';
import { findAllSurveyAnswerSheetsByQuery } from '../api/SurveyAnswerSheetsApi';

export default interface SurveyTemp {
  id?: number;
}

export function useSurveyManagement(): [
  NaOffsetElementList<Survey>,
  (name: string, value: string | number | Moment | undefined) => void,
  () => void,
  SurveyMemberQueryModel,
  () => void,
  SharedService,
  (surveyMemberQueryModel: SurveyMemberQueryModel) => void
] {
  const surveyMemberStore = SurveyMemberStore.instance;
  const sharedService = SharedService.instance;

  const [valule, setValue] = useState<NaOffsetElementList<Member>>(surveyMemberStore.surveyList);

  const [query, setQuery] = useState<SurveyMemberQueryModel>(surveyMemberStore.selectedSurveyQuery);

  useEffect(() => {
    searchQuery();
    return autorun(() => {
      setValue({ ...surveyMemberStore.surveyList });
      setQuery({ ...surveyMemberStore.selectedSurveyQuery });
    });
  }, [surveyMemberStore]);

  const clearSurveyQuery = useCallback(() => {
    surveyMemberStore.clearSurveyQuery();
  }, []);

  const changeSurveyQueryProps = useCallback((name: string, value: string | Moment | number | undefined) => {
    if (value === '전체') value = '';

    surveyMemberStore.setSurveyQuery(surveyMemberStore.selectedSurveyQuery, name, value);

    if (name === 'limit') {
      changeSurveyQueryProps('pageIndex', 0);
      changeSurveyQueryProps('page', 0);
      changeSurveyQueryProps('offset', 0);
      searchQuery();
    }
  }, []);

  const searchQuery = useCallback(() => {
    requestFindAllSurveyAnswerSheetsByQuery(surveyMemberStore.selectedSurveyQuery);
  }, []);

  // 신규 추가
  const requestFindAllSurveyAnswerSheetsByQuery = useCallback((surveyMemberQueryModel: SurveyMemberQueryModel) => {
    if (sharedService) {
      if (surveyMemberQueryModel.page) {
        changeSurveyQueryProps('offset', (surveyMemberQueryModel.page - 1) * surveyMemberQueryModel.limit);
        changeSurveyQueryProps('pageIndex', (surveyMemberQueryModel.page - 1) * surveyMemberQueryModel.limit);
        sharedService.setPage('surveyManagement', surveyMemberQueryModel.page);
      } else {
        sharedService.setPageMap('surveyManagement', 0, surveyMemberQueryModel.limit);
      }
    }

    findAllSurveyAnswerSheetsByQuery(SurveyMemberQueryModel.asSurveyMemberRdo(surveyMemberQueryModel)).then(
      (response) => {
        const next = responseToNaOffsetElementList<Member>(response);

        next.limit = surveyMemberQueryModel.limit;
        next.offset = surveyMemberQueryModel.offset;
        sharedService.setCount('surveyManagement', next.totalCount);
        surveyMemberStore.setSurveyList(next);
      }
    );
  }, []);

  return [
    valule,
    changeSurveyQueryProps,
    searchQuery,
    query,
    clearSurveyQuery,
    sharedService,
    requestFindAllSurveyAnswerSheetsByQuery,
  ];
}
