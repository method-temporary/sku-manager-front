import React, { useState } from 'react';

// import { useConceptSearched } from '../../service/useConceptSearched';
import ConceptListView from '../view/ConceptListView';
import { useList } from 'board/tag/store/ConceptListStore';
import { useSearchBox } from 'board/tag/store/SearchBoxStore';
import { selectField } from 'board/tag/service/requestTag';

const ConceptListViewContainer: React.FC = function ConceptListContainer() {
  const conceptList = useList();
  const searchBox = useSearchBox();

  return (
    <>
      {conceptList !== undefined && searchBox !== undefined && (
        <ConceptListView
          conceptList={conceptList}
          searchBox={searchBox}
        />
      )}
    </>
  );
};

export default ConceptListViewContainer;
