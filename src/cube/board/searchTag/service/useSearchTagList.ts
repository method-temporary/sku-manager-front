import { useCallback, useEffect, useRef, useState } from 'react';
import XLSX from 'xlsx';
import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import {
  excelSearchTag,
  excelSearchTagByCreator,
  excelSearchTagByKeywords,
  excelSearchTagByTag,
  excelSearchTagByUpdater,
  findAllSearchTag,
  findAllSearchTagByCreator,
  findAllSearchTagByKeywords,
  findAllSearchTagByTag,
  findAllSearchTagByUpdater,
  removeSearchTag,
} from '../api/searchTagApi';
import SearchTag, { convertToExcel, SearchTagViewModel } from '../model/SearchTag';
import { onList, setList, setSearched } from '../store/SearchTagListStore';
import { getSearchTagRdo, setLimit, setOffset } from '../store/SerchTagRdoStore';
// Master 추가 Import
import { reactConfirm } from '@nara.platform/accent';

type Value = NaOffsetElementList<SearchTagViewModel>;

interface RequestValue {
  (): void;
}

interface RequestExcel {
  (): any;
}

interface ChangePage {
  (_: any, data: any): void;
}

interface ChangeLimit {
  (_: any, data: any): void;
}

interface DeleteValues {
  (): void;
}

interface Check {
  (id: string): void;
}

export function requestFindAllSearchTag(publisherId: string) {
  const searchTagRdo = getSearchTagRdo();
  const { offset, limit } = searchTagRdo;
  switch (searchTagRdo.searchType) {
    case 'TEXT':
      findAllSearchTag(searchTagRdo).then((searchTags) => setList({ ...searchTags, offset, limit }, publisherId));
      break;
    case 'TAG':
      findAllSearchTagByTag(searchTagRdo).then((searchTags) => setList({ ...searchTags, offset, limit }, publisherId));
      break;
    case 'KEYWORDS':
      findAllSearchTagByKeywords(searchTagRdo).then((searchTags) =>
        setList({ ...searchTags, offset, limit }, publisherId)
      );
      break;
    case 'CREATOR':
      findAllSearchTagByCreator(searchTagRdo).then((searchTags) =>
        setList({ ...searchTags, offset, limit }, publisherId)
      );
      break;
    case 'UPDATER':
      findAllSearchTagByUpdater(searchTagRdo).then((searchTags) =>
        setList({ ...searchTags, offset, limit }, publisherId)
      );
      break;

    default:
      break;
  }
}

export function requestExcelSearchTag(): Promise<NaOffsetElementList<SearchTag>> {
  const searchTagRdo = getSearchTagRdo();
  switch (searchTagRdo.searchType) {
    case 'TEXT':
      return excelSearchTag(searchTagRdo);
    case 'TAG':
      return excelSearchTagByTag(searchTagRdo);
    case 'KEYWORDS':
      return excelSearchTagByKeywords(searchTagRdo);
    case 'CREATOR':
      return excelSearchTagByCreator(searchTagRdo);
    case 'UPDATER':
      return excelSearchTagByUpdater(searchTagRdo);
    default:
      return Promise.resolve(getEmptyNaOffsetElementList<SearchTag>());
  }
}

export function useSearchTagList(): [Value, RequestValue, RequestExcel, ChangePage, ChangeLimit, DeleteValues, Check] {
  const serviceIdRef = useRef<number>(0);
  const [serviceId, setServiceId] = useState<string>('');
  const [value, setValue] = useState<Value>(getEmptyNaOffsetElementList());

  useEffect(() => {
    const serviceId = `useSearchTagList-${serviceIdRef.current++}`;
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

  const requestExcel = useCallback(async () => {
    const fileName = 'Tags.xlsx';
    await requestExcelSearchTag().then(({ results, empty }) => {
      if (!empty) {
        const excel = XLSX.utils.json_to_sheet(convertToExcel(results));
        const temp = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(temp, excel, 'Tag');
        XLSX.writeFile(temp, fileName, { compression: true });
      }
    });
    return fileName;
  }, [serviceId]);

  const changePage = useCallback(
    (_: any, data: any) => {
      const activePage: number = data.activePage;
      const { limit } = getSearchTagRdo();
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

  const deleteValues = useCallback(() => {
    if (!value.results.some((c) => c.checked)) {
      return;
    }
    reactConfirm({
      title: '삭제 안내',
      message: '선택한 항목을 삭제하시겠습니까?',
      onOk: () => {
        Promise.all(
          value.results
            .filter((c) => c.checked)
            .map((c) => {
              return removeSearchTag(c.id);
            })
        ).then(() => {
          requestFindAllSearchTag(serviceId);
        });
      },
    });
  }, [value, serviceId]);

  const check = useCallback(
    (id) => {
      const next = {
        ...value,
        results: value.results.map((c) => {
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

  return [value, requestValue, requestExcel, changePage, changeLimit, deleteValues, check];
}
