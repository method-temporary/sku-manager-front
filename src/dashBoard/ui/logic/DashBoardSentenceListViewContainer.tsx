import React, { useCallback } from 'react';
import { useDashBoardSentenceList } from '../../service/useDashBoardSentenceList';
import { useDashBoardSentenceSearched } from '../../service/useDashBoardSentenceSearched';
import DashBoardSentenceListView from '../view/DashBoardSentenceListView';

const DashBoardSentenceListViewContainer: React.FC = function SearchTagListContainer() {
  const [searched] = useDashBoardSentenceSearched();
  const [
    { results, empty, offset, limit, totalCount },
    ,
    changePage,
    changeLimit,
    check,
    changeExposure,
  ] = useDashBoardSentenceList();

  const handleChangeExposure = useCallback((id: string, show: boolean) => {
    changeExposure(id, show);
  }, []);

  return (
    <DashBoardSentenceListView
      searched={searched}
      results={results}
      empty={empty}
      offset={offset}
      limit={limit}
      totalCount={totalCount}
      check={check}
      changePage={changePage}
      changeLimit={changeLimit}
      changeExposure={handleChangeExposure}
    />
  );
};

export default DashBoardSentenceListViewContainer;
