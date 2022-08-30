import React, { useState } from 'react';
import { useSearchTagList } from '../../service/useSearchTagList';
import { useSearchTagSearched } from '../../service/useSearchTagSearched';
import SearchTagListView from '../view/SearchTagListView';

const SearchTagListViewContainer: React.FC = function SearchTagListContainer() {
  const [searched] = useSearchTagSearched();
  const [
    { results, empty, offset, limit, totalCount },
    ,
    requestExcel,
    changePage,
    changeLimit,
    deleteSearchTags,
    check,
  ] = useSearchTagList();

  return (
    <SearchTagListView
      searched={searched}
      results={results}
      empty={empty}
      offset={offset}
      limit={limit}
      totalCount={totalCount}
      check={check}
      requestExcel={()=> requestExcel()}
      changePage={changePage}
      changeLimit={changeLimit}
      deleteSearchTags={deleteSearchTags}
    />
  );
};

export default SearchTagListViewContainer;
