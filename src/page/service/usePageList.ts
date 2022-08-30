import { useState, useCallback, useEffect } from 'react';
import Page from '../model/Page';
import { findAllPages } from '../api/PageApi';
import PageStore from '../mobx/PageStore';
import { autorun } from 'mobx';
import { NaOffsetElementList } from 'shared/model';

export function usePageList(
  commnunityId: number
): [NaOffsetElementList<Page>, (offset: number, limit: number) => void] {
  const pageStore = PageStore.instance;
  const [valule, setValue] = useState<NaOffsetElementList<Page>>(pageStore.pageList);

  useEffect(() => {
    return autorun(() => {
      setValue(pageStore.pageList);
    });
  }, [pageStore]);

  const requestPageList = useCallback(
    (offset: number = 0, limit: number = 0) => {
      findAllPages(limit, offset, commnunityId).then((response) => {
        // const next = responseToNaOffsetElementList<Page>(response);
        // pageStore.setPageList(next);
      });
    },
    [commnunityId]
  );

  return [valule, requestPageList];
}
