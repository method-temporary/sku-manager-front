import React, { useState } from 'react';

// import { useCapabilitySearched } from '../../service/useCapabilitySearched';
import CapabilityListView from '../view/CapabilityListView';
import { useList } from 'board/capability/store/CapabilityListStore';
import { useSearchBox } from 'board/capability/store/SearchBoxStore';
import { selectField } from 'board/capability/service/requestCapability';

const CapabilityListViewContainer: React.FC = function CapabilityListContainer() {
  const capabilityList = useList();
  const searchBox = useSearchBox();

  return (
    <>
      {capabilityList !== undefined && searchBox !== undefined && (
        <CapabilityListView
          capabilityList={capabilityList}
          searchBox={searchBox}
        />
      )}
    </>
  );
};

export default CapabilityListViewContainer;
