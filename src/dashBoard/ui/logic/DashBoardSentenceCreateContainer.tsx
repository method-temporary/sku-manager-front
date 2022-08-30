import React, { useCallback } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { Language } from 'shared/components/Polyglot';

import { useDashBoardSentenceDetail } from 'dashBoard/service/useDashBoardSentenceDetail';

import DashBoardSentenceDetailView from '../view/DashBoardSentenceDetailView';

interface Params {
  id: string;
}

const DashBoardSentenceCreateContainer: React.FC = function SearchTagListContainer() {
  const history = useHistory();
  const location = useLocation();
  const params = useParams<Params>();

  const { id } = params;

  const { results, changeDetailProps, changeSentenceList, saveDashboardSentence } = useDashBoardSentenceDetail(id);

  const handleTempSave = useCallback(async () => {
    const result = await saveDashboardSentence('tempSave');
    if (result) {
      history.goBack();
    }
  }, []);

  const handleSave = useCallback(async () => {
    const result = await saveDashboardSentence('save');
    if (result) {
      history.goBack();
    }
  }, []);

  const routeToList = useCallback(() => {
    const parentPath = location.pathname.split('/dash-board')[0];
    const listPath = `${parentPath}/dash-board/dash-board-sentence`;
    history.push(listPath);
  }, [location, history]);

  //input 업데이트 핸들러
  const handleDataChange = useCallback((name: string, e: any) => {
    changeDetailProps(e.target.value, name);
  }, []);

  const handleExposureChange = useCallback((name: string, value: any) => {
    changeDetailProps(value, name);
  }, []);

  const exposureDateOptionChange = useCallback((value: any) => {
    changeDetailProps(value, 'exposureDateOption');
  }, []);

  const handleDateChange = useCallback((name: string, date: any) => {
    const targetDate = date;
    if (name === 'startDate' && results.endDate < date) {
      changeDetailProps(targetDate.getTime(), 'endDate');
    }
    changeDetailProps(targetDate.getTime(), name);
  }, []);

  const handleTxtListChange = useCallback((type: string, value: any, index?: number, lang?: Language) => {
    changeSentenceList(type, value, index, lang);
  }, []);

  return (
    <DashBoardSentenceDetailView
      type="add"
      detailData={results}
      handleDataChange={handleDataChange}
      handleDateChange={handleDateChange}
      handleExposureChange={handleExposureChange}
      exposureDateOptionChange={exposureDateOptionChange}
      routeToList={routeToList}
      handleTempSave={handleTempSave}
      handleSave={handleSave}
      handleTxtListChange={handleTxtListChange}
      changeSentenceList={changeSentenceList}
    />
  );
};

export default DashBoardSentenceCreateContainer;
