import { useCallback, useEffect, useRef, useState } from 'react';
import XLSX from 'xlsx';
import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import {
  findAllCompetency,
  findCompetency,
  findAllCompetencyExcel,
  existsCompetency,
  findCompetencyNames,
} from '../api/competencyApi';
import Competency from '../model/Competency';
import { onList, setList, setSearched, getList } from '../store/CompetencyListStore';

import { getSearchBox } from '../store/SearchBoxStore';
import { getEmptySearchBox, SearchBox } from '../model/SearchBox';
import CompetencyCdo from '../model/CompetencyCdo';

export function requestFindAllCompetency() {
  findAllCompetency(getSearchBox() || getEmptySearchBox()).then((competencys) => setList({ ...competencys }));
}

export function requestFindAllCompetencyModal(searchBox: SearchBox) {
  return findAllCompetency(searchBox);
}

export function requestFindCompetency(competencyId: string) {
  return findCompetency(competencyId);
}

export function requestFindCompetencyNames(competencyName: string) {
  return findCompetencyNames(competencyName);
}

export function requestExistsCompetency(competencyCdo: CompetencyCdo) {
  return existsCompetency(competencyCdo);
}

export function requestFindAllCompetencyExcel(): Promise<NaOffsetElementList<Competency>> {
  return findAllCompetencyExcel(getSearchBox() || getEmptySearchBox());
}
