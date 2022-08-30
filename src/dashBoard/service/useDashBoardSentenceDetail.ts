import { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';

import { NameValueList, reactAlert } from '@nara.platform/accent';

import { Language } from 'shared/components/Polyglot';
import { NaOffsetElementDetail, getEmptyNaOffsetElementDetail } from 'shared/model';

import {
  findDashBoardSentenceDetail,
  modifyDashBoard,
  saveDashBoardSentence,
} from '_data/arrange/dashboardMessage/api/dashBoardApi';
import { DashBoardSentenceDetailModel } from '_data/arrange/dashboardMessage/model';

import { getDetail, onDetail, setDetail } from 'dashBoard/store/DashBoardSentenceDetailStore';

type Value = NaOffsetElementDetail<DashBoardSentenceDetailModel>;

export function requestFindDetail(dashBoardId: string, publisherId: string) {
  findDashBoardSentenceDetail(dashBoardId).then((detailData: any) => {
    const target = new DashBoardSentenceDetailModel(detailData);
    setDetail(target, publisherId);
  });
}

export function useDashBoardSentenceDetail(dashBoardId?: string): {
  results: Value;
  changeDetailProps: (name: string, value: any) => void;
  changeSentenceList: (type: any, value?: any, index?: number, lang?: Language) => void;
  saveDashboardSentence: (type: string) => any;
  updateDashBoardSentence: (id: string, type: string) => void;
} {
  const serviceIdRef = useRef<number>(0);
  const [serviceId, setServiceId] = useState<string>('');
  const [detailValue, setDetailValue] = useState<Value>(getEmptyNaOffsetElementDetail());

  useEffect(() => {
    const serviceId = `useDashboardSentenseDetail-${serviceIdRef.current++}`;
    setServiceId(serviceId);
    function subscribeCallback(next: Value) {
      setDetailValue(next);
    }
    return onDetail(`useDashboardSentenseDetail-${serviceId}`, subscribeCallback);
  }, []);

  useEffect(() => {
    if (dashBoardId) {
      requestFindDetail(dashBoardId, serviceId);
    } else {
      setDetail(getEmptyNaOffsetElementDetail(), serviceId);
    }
  }, [dashBoardId, serviceId]);

  const changeDetailProps = useCallback(
    (value: any, name: string) => {
      const getDetailData = getDetail();
      switch (name) {
        case 'name':
          getDetailData.name = value;
          break;
        case 'show':
          getDetailData.show = value;
          break;
        case 'startDate':
          getDetailData.startDate = value;
          break;
        case 'endDate':
          getDetailData.endDate = value;
          break;
        case 'exposureDateOption':
          getDetailData.exposureDateOption = value;
          break;
        // case 'langSupports':
        //   getDetailData.langSupports = value;
        //   break;
        // case 'defaultLanguage':
        //   getDetailData.defaultLanguage = value;
      }
      setDetail({ ...getDetailData }, serviceId);
    },
    [serviceId]
  );

  const changeSentenceList = useCallback(
    (type: any, value?: any, index?: number, lang?: Language) => {
      const getDetailData = getDetail();
      switch (type) {
        case 'add':
          //추가
          if (lang === Language.Ko) {
            getDetailData.koreanTexts.push('');
          }
          if (lang === Language.En) {
            getDetailData.englishTexts.push('');
          }
          if (lang === Language.Zh) {
            getDetailData.chineseTexts.push('');
          }
          break;
        case 'delete':
          //삭제
          if (lang === Language.Ko) {
            getDetailData.koreanTexts.splice(getDetailData.koreanTexts.indexOf(value), 1);
          }
          if (lang === Language.En) {
            getDetailData.englishTexts.splice(getDetailData.englishTexts.indexOf(value), 1);
          }
          if (lang === Language.Zh) {
            getDetailData.chineseTexts.splice(getDetailData.chineseTexts.indexOf(value), 1);
          }
          break;
        case 'allDelete':
          if (lang === Language.Ko) {
            getDetailData.koreanTexts = [];
          }
          if (lang === Language.En) {
            getDetailData.englishTexts = [];
          }
          if (lang === Language.Zh) {
            getDetailData.chineseTexts = [];
          }
          break;
        case 'txt':
          //문구 변경
          if (lang === Language.Ko) {
            getDetailData.koreanTexts[index!] = value;
          }
          if (lang === Language.En) {
            getDetailData.englishTexts[index!] = value;
          }
          if (lang === Language.Zh) {
            getDetailData.chineseTexts[index!] = value;
          }
          break;
        case 'orderDown':
          //순서 변경
          const orederIndex = value.split('_');
          let downTempValue = '';
          if (lang === Language.Ko) {
            if (Number(orederIndex[1]) + 1 !== getDetailData.koreanTexts.length) {
              downTempValue = getDetailData.koreanTexts[Number(orederIndex[1]) + 1];
              getDetailData.koreanTexts[Number(orederIndex[1]) + 1] = getDetailData.koreanTexts[Number(orederIndex[1])];
              getDetailData.koreanTexts[Number(orederIndex[1])] = downTempValue;
            }
          }
          if (lang === Language.En) {
            if (Number(orederIndex[1]) + 1 !== getDetailData.englishTexts.length) {
              downTempValue = getDetailData.englishTexts[Number(orederIndex[1]) + 1];
              getDetailData.englishTexts[Number(orederIndex[1]) + 1] =
                getDetailData.englishTexts[Number(orederIndex[1])];
              getDetailData.englishTexts[Number(orederIndex[1])] = downTempValue;
            }
          }
          if (lang === Language.Zh) {
            if (Number(orederIndex[1]) + 1 !== getDetailData.chineseTexts.length) {
              downTempValue = getDetailData.chineseTexts[Number(orederIndex[1]) + 1];
              getDetailData.chineseTexts[Number(orederIndex[1]) + 1] =
                getDetailData.chineseTexts[Number(orederIndex[1])];
              getDetailData.chineseTexts[Number(orederIndex[1])] = downTempValue;
            }
          }

          break;
        case 'orderUp':
          //순서 변경
          const orderIndex2 = value.split('_');
          let upTempValue = '';
          if (lang === Language.Ko) {
            if (Number(orderIndex2[1]) !== 0) {
              upTempValue = getDetailData.koreanTexts[Number(orderIndex2[1]) - 1];
              getDetailData.koreanTexts[Number(orderIndex2[1]) - 1] = getDetailData.koreanTexts[Number(orderIndex2[1])];
              getDetailData.koreanTexts[Number(orderIndex2[1])] = upTempValue;
            }
          }
          if (lang === Language.En) {
            if (Number(orderIndex2[1]) !== 0) {
              upTempValue = getDetailData.englishTexts[Number(orderIndex2[1]) - 1];
              getDetailData.englishTexts[Number(orderIndex2[1]) - 1] =
                getDetailData.englishTexts[Number(orderIndex2[1])];
              getDetailData.englishTexts[Number(orderIndex2[1])] = upTempValue;
            }
          }
          if (lang === Language.Zh) {
            if (Number(orderIndex2[1]) !== 0) {
              upTempValue = getDetailData.chineseTexts[Number(orderIndex2[1]) - 1];
              getDetailData.chineseTexts[Number(orderIndex2[1]) - 1] =
                getDetailData.chineseTexts[Number(orderIndex2[1])];
              getDetailData.chineseTexts[Number(orderIndex2[1])] = upTempValue;
            }
          }

          break;
      }
      setDetail({ ...getDetailData }, serviceId);
    },
    [serviceId]
  );

  const saveDashboardSentence = useCallback(
    (type: string) => {
      const getDetailData = getDetail();

      //TODO: LangStrings validationCheck

      // if (getDetailData.name === '' || getDetailData.name === undefined) {
      //   reactAlert({ title: '안내', message: '문구 Set 명을 입력해주세요.' });
      //   return false;
      // }

      if (type === 'save') {
        const errorFlag: boolean[] = [];
        getDetailData.koreanTexts.map((item: any) => {
          if (item === '') {
            errorFlag.push(false);
          }
        });

        getDetailData.englishTexts.map((item: any) => {
          if (item === '') {
            errorFlag.push(false);
          }
        });

        getDetailData.chineseTexts.map((item: any) => {
          if (item === '') {
            errorFlag.push(false);
          }
        });

        if (errorFlag.indexOf(false) !== -1) {
          reactAlert({
            title: '안내',
            message:
              '리스트에 추가한 문구 명을 모두 작성해주시기 바랍니다.<br> 문구 입력 칸이 비어있는 경우에 리스트를 저장할 수 없습니다.',
          });
          return false;
        }
      }

      // if (patronInfo.getPatronName()) {
      //   getDetailData.registrantName.setValue(
      //     getDefaultLanguage(getDetailData.langSupports),
      //     patronInfo.getPatronName() || ''
      //   );
      // }

      getDetailData.registeredTime = moment().startOf('day').valueOf();
      getDetailData.modifiedTime = moment().startOf('day').valueOf();
      if (type === 'tempSave') {
        getDetailData.state = 'temp';
      } else if (type === 'save') {
        getDetailData.state = 'regular';
      }
      const params = {
        creatorName: getDetailData.registrantName,
        endDate: getDetailData.exposureDateOption ? '' : getDetailData.endDate,
        name: getDetailData.name,
        show: getDetailData.show,
        startDate: getDetailData.exposureDateOption ? '' : getDetailData.startDate,
        exposureDateOption: getDetailData.exposureDateOption,
        state: getDetailData.state,
        koreanTexts: getDetailData.koreanTexts,
        englishTexts: getDetailData.englishTexts,
        chineseTexts: getDetailData.chineseTexts,
      };
      return saveDashBoardSentence(params);
    },
    [serviceId]
  );

  const updateDashBoardSentence = useCallback(
    (dashBoardId: string, type: string) => {
      const getDetailData = getDetail();
      // let text = '';
      // getDetailData.texts.map((item, index) => {
      //   text += '"' + item + '"';
      //   if (getDetailData.texts.length !== index + 1) {
      //     text += ',';
      //   }
      // });
      const dashBoardNameValues: NameValueList = {
        nameValues: [
          // {
          //   name: 'modifierName',
          //   value: patronInfo.getPatronName() || '',
          // },
          {
            name: 'name',
            value: getDetailData.name,
          },
          {
            name: 'exposureDateOption',
            value: String(getDetailData.exposureDateOption),
          },
          {
            name: 'show',
            value: String(getDetailData.show),
          },
          {
            name: 'startDate',
            value: String(getDetailData.startDate),
          },
          {
            name: 'endDate',
            value: String(getDetailData.endDate),
          },
          {
            name: 'koreanTexts',
            value: JSON.stringify(getDetailData.koreanTexts),
          },
          {
            name: 'englishTexts',
            value: JSON.stringify(getDetailData.englishTexts),
          },
          {
            name: 'chineseTexts',
            value: JSON.stringify(getDetailData.chineseTexts),
          },
          {
            name: 'state',
            value: type,
          },
        ],
      };
      modifyDashBoard(dashBoardId, dashBoardNameValues);
    },
    [serviceId]
  );

  return {
    results: detailValue,
    changeDetailProps,
    changeSentenceList,
    saveDashboardSentence,
    updateDashBoardSentence,
  };
}
