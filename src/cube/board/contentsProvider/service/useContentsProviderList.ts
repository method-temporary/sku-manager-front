import { useCallback, useEffect, useState } from 'react';
import { autorun } from 'mobx';
import { Moment } from 'moment';
import { ContentsProviderQueryModel } from '../model/ContentsProviderQueryModel';
import ContentsProviderStore from '../mobx/ContentsProviderStore';
import { findAllContentsProviderByQuery } from '../api/ContentsProviderApi';
import { SharedService } from 'shared/present';
import { OffsetElementList } from 'shared/model';
import ContentsProviderWithCubeCountRom from '../model/ContentsProviderWithCubeCountRom';

export default interface ContentsProviderTemp {
  id?: number;
}

export function useContentsProviderList(): [
  OffsetElementList<ContentsProviderWithCubeCountRom>,
  (name: string, value: string | number | Moment | undefined) => void,
  () => void,
  ContentsProviderQueryModel,
  () => void,
  SharedService
] {
  const contentsProviderStore = ContentsProviderStore.instance;
  const sharedService = SharedService.instance;

  const [valule, setValue] = useState<OffsetElementList<ContentsProviderWithCubeCountRom>>(
    contentsProviderStore.contentsProviderList
  );

  const [query, setQuery] = useState<ContentsProviderQueryModel>(contentsProviderStore.selectedContentsProviderQuery);

  useEffect(() => {
    searchQuery();
    return autorun(() => {
      setValue({ ...contentsProviderStore.contentsProviderList });
      setQuery({ ...contentsProviderStore.selectedContentsProviderQuery });
    });
  }, [contentsProviderStore]);

  const clearContentsProviderQuery = useCallback(() => {
    contentsProviderStore.clearContentsProviderQuery();
  }, []);

  const requestFindAllContentsProviderByQuery = useCallback(
    (contentsProviderQueryModel: ContentsProviderQueryModel) => {
      const pageModel = sharedService.getPageModel('contentsProvider');

      findAllContentsProviderByQuery(
        ContentsProviderQueryModel.asContentsProviderRdo(contentsProviderQueryModel, pageModel)
      ).then((response) => {
        sharedService.setCount('contentsProvider', response.data.totalCount);
        contentsProviderStore.setContentsProviderList(response.data);
      });
    },
    []
  );

  const changeContentsProviderQueryProps = useCallback((name: string, value: string | Moment | number | undefined) => {
    if (value === 'All') value = '';

    contentsProviderStore.setContentsProviderQuery(contentsProviderStore.selectedContentsProviderQuery, name, value);

    if (name === 'limit') {
      changeContentsProviderQueryProps('pageIndex', 0);
      changeContentsProviderQueryProps('page', 0);
      changeContentsProviderQueryProps('offset', 0);
      searchQuery();
    }
  }, []);

  const searchQuery = useCallback(() => {
    contentsProviderStore.clearContentsProviderCdo();
    requestFindAllContentsProviderByQuery(contentsProviderStore.selectedContentsProviderQuery);
  }, []);

  return [valule, changeContentsProviderQueryProps, searchQuery, query, clearContentsProviderQuery, sharedService];
}
