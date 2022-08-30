import { useState, useCallback, useEffect } from 'react';
import Page from '../model/Page';
import PageStore from '../mobx/PageStore';
import { autorun } from 'mobx';

export function useSelectedPage(): [
  Page | undefined,
  (next: Page) => void,
] {
  const pageStore = PageStore.instance;
  const [value, setValue] = useState<Page | undefined>(pageStore.selected);

  useEffect(() => {
    return autorun(() => {
      setValue(pageStore.selected);
    });
  }, [pageStore]);

  const select = useCallback((next: Page) => {
    pageStore.select(next);
  }, []);

  return [value, select];
}
