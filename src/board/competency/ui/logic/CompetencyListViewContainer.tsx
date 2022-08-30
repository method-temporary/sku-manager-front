import React, { useState } from 'react';

// import { useCompetencySearched } from '../../service/useCompetencySearched';
import CompetencyListView from '../view/CompetencyListView';
import { useList } from 'board/competency/store/CompetencyListStore';
import { useSearchBox } from 'board/competency/store/SearchBoxStore';

const CompetencyListViewContainer: React.FC = function CompetencyListContainer() {
  const competencyList = useList();
  const searchBox = useSearchBox();

  return (
    <>
      {competencyList !== undefined && searchBox !== undefined && (
        <CompetencyListView
          competencyList={competencyList}
          searchBox={searchBox}
        />
      )}
    </>
  );
};

export default CompetencyListViewContainer;
