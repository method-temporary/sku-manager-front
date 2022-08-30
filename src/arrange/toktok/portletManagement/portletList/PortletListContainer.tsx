import React from 'react';
import { onChangeLimit, onClickCreate, onClickItem } from './portletList.events';
import { initPortletList } from './portletList.models';
import { useRequestPortletList } from './portletList.services';
import { usePortletList, usePortletListLimit } from './portletList.stores';
import { PortletListHeaderView } from './PortletListHeaderView';
import { PortletListView } from './PortletListView';

export function PortletListContainer() {
  useRequestPortletList();
  const portletList = usePortletList() || initPortletList();
  const limit = usePortletListLimit() || 20;

  return (
    <>
      <PortletListHeaderView
        totalCount={portletList.totalCount}
        limit={limit}
        onChangeLimit={onChangeLimit}
        onClickCreate={onClickCreate}
      />
      <PortletListView
        items={portletList.items}
        onClickItem={onClickItem}
      />
    </>
  );
}