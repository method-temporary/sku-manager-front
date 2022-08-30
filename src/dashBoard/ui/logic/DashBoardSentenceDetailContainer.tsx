import React, { useCallback } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { reactAlert } from '@nara.platform/accent';
import { Language } from 'shared/components/Polyglot';

import { useDashBoardSentenceDetail } from 'dashBoard/service/useDashBoardSentenceDetail';
import DashBoardSentenceDetailView from '../view/DashBoardSentenceDetailView';

interface Params {
  id: string;
}

const DashBoardSentenceDetailContainer: React.FC = function SearchTagListContainer() {
  const history = useHistory();
  const location = useLocation();
  const params = useParams<Params>();
  const { id } = params;
  const { results, changeDetailProps, changeSentenceList, updateDashBoardSentence } = useDashBoardSentenceDetail(id);

  const handleSave = useCallback(
    (type?: any) => {
      //TODO: LangStrings validationCheck
      if (results && results.name === '') {
        reactAlert({ title: '안내', message: '문구 Set 명을 입력해주세요.' });
      } else {
        if (results.koreanTexts || results.englishTexts || results.chineseTexts) {
          const errorFlag: boolean[] = [];
          results.koreanTexts.map((item: any) => {
            if (item === '') {
              errorFlag.push(false);
            }
          });
          results.englishTexts.map((item: any) => {
            if (item === '') {
              errorFlag.push(false);
            }
          });
          results.chineseTexts.map((item: any) => {
            if (item === '') {
              errorFlag.push(false);
            }
          });
          if (
            errorFlag.indexOf(false) !== -1 ||
            (results.koreanTexts.length === 0 && results.englishTexts.length === 0 && results.chineseTexts.length === 0)
          ) {
            reactAlert({
              title: '안내',
              message:
                '리스트에 추가한 문구 명을 모두 작성해주시기 바랍니다.<br> 문구 입력 칸이 비어있는 경우에 리스트를 저장할 수 없습니다.',
            });
            return;
          }
        }
        updateDashBoardSentence(id, type);
        history.goBack();
      }
    },
    [results]
  );

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
      detailData={results}
      handleDataChange={handleDataChange}
      handleDateChange={handleDateChange}
      handleExposureChange={handleExposureChange}
      exposureDateOptionChange={exposureDateOptionChange}
      routeToList={routeToList}
      handleTempSave={() => handleSave('temp')}
      handleSave={() => handleSave('regular')}
      handleTxtListChange={handleTxtListChange}
      changeSentenceList={changeSentenceList}
    />
  );
};

export default DashBoardSentenceDetailContainer;
