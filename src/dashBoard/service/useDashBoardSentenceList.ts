import { useCallback, useEffect, useRef, useState } from 'react';
import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import { findAllDashBoardSentence, updateExposure } from '../../_data/arrange/dashboardMessage/api/dashBoardApi';
import { DashBoardSentenceViewModel } from '../../_data/arrange/dashboardMessage/model/DashBoardSentenceModel';
import { getList, onList, setList, setSearched } from '../store/DashBoardSentenceStore';
import { getDashBoardSentenceRdo, setLimit, setOffset } from '../store/DashBoardSentenceRdoStore';

type Value = NaOffsetElementList<DashBoardSentenceViewModel>;

interface RequestValue {
  (): void;
}

interface ChangePage {
  (_: any, data: any): void;
}

interface ChangeLimit {
  (_: any, data: any): void;
}

interface Check {
  (id: string): void;
}

interface ChangeExposure {
  (id: string, value: boolean): void;
}

export function requestFindAllSearchTag(publisherId: string) {
  const dashBoardSentenceRdo = getDashBoardSentenceRdo();
  const { offset, limit } = dashBoardSentenceRdo;
  findAllDashBoardSentence(dashBoardSentenceRdo).then((searchTags: any) => {
    setList({ ...searchTags, offset, limit }, publisherId);
  });
}

export function useDashBoardSentenceList(): [Value, RequestValue, ChangePage, ChangeLimit, Check, ChangeExposure] {
  const serviceIdRef = useRef<number>(0);
  const [serviceId, setServiceId] = useState<string>('');
  const [value, setValue] = useState<Value>(getEmptyNaOffsetElementList());
  useEffect(() => {
    const serviceId = `useDashboardSentenseList-${serviceIdRef.current++}`;
    setServiceId(serviceId);
    function subscribeCallback(next: Value) {
      setValue(next);
    }
    return onList(serviceId, subscribeCallback);
  }, []);

  useEffect(() => {
    requestFindAllSearchTag(serviceId);
  }, [serviceId]);

  const requestValue = useCallback(() => {
    requestFindAllSearchTag(serviceId);
    setSearched(true, serviceId);
  }, [serviceId]);

  const changePage = useCallback(
    (_: any, data: any) => {
      const activePage: number = data.activePage;
      const { limit } = getDashBoardSentenceRdo();
      const offset = (activePage - 1) * limit;
      setOffset(offset, serviceId);
      requestFindAllSearchTag(serviceId);
      setSearched(true, serviceId);
    },
    [serviceId]
  );

  const changeLimit = useCallback(
    (_: any, data: any) => {
      const limit: number = data.value;
      setLimit(limit, serviceId);
      requestFindAllSearchTag(serviceId);
      setSearched(true, serviceId);
    },
    [serviceId]
  );

  const check = useCallback(
    (id) => {
      const next = {
        ...value,
        results: value.results.map((c: any) => {
          if (c.id === id) {
            if (c.checked === true) {
              return { ...c, checked: false };
            } else {
              return { ...c, checked: true };
            }
          } else {
            return c;
          }
        }),
      };
      setList(next, serviceId);
    },
    [value, serviceId]
  );

  const changeExposure = useCallback((id, value) => {
    const params = {
      nameValues: [
        {
          name: 'show',
          value: !value,
        },
      ],
    };
    const getListData = getList();
    getListData.results.map((item) => {
      if (item.id === id) {
        item.show = !value;
      }
    });
    setList({ ...getListData }, serviceId);
    updateExposure(id, params);
    //namevalue 로 노출여부값 api 호출 한다.
  }, []);

  return [value, requestValue, changePage, changeLimit, check, changeExposure];
}
