import { useEffect } from 'react';
import { getContentsProviders, setContentsProviders } from 'shared/store';
import ContentsProviderApi from 'college/present/apiclient/ContentsProviderApi';

export function useRequestContentsProviders() {
  useEffect(() => {
    requestContentsProviders();
  }, []);
}

async function requestContentsProviders() {
  const contentsProviderApi = ContentsProviderApi.instance;
  const contentsProviders = await contentsProviderApi.findAllContentsProviders();
  if (contentsProviders === undefined) {
    return;
  }
  setContentsProviders(contentsProviders);
}

export function getContentsProviderById(id: string) {
  const contentsProviders = getContentsProviders();
  if (contentsProviders === undefined) {
    return undefined;
  }
  const contentsProvider = contentsProviders.find((c) => c.id === id);
  return contentsProvider;
}
