import { NaOffsetElementList, PolyglotModel } from 'shared/model';
import {
  findAllConcept,
  findConcept,
  findAllConceptExcel,
  existsConcept,
  findConceptNames,
  findConcepts,
  findConceptModal,
  findAllTerm,
} from '../api/tagApi';
import { setList } from '../store/ConceptListStore';

import { getSearchBox } from '../store/SearchBoxStore';
import { getEmptySearchBox } from '../model/SearchBox';
import ConceptCdo from '../model/ConceptCdo';
import Concept from '../model/Concept';
import Term from '../model/Term';
import { setConcept } from '../store/ConceptStore';

export function requestFindAllConcept() {
  findAllConcept(getSearchBox() || getEmptySearchBox()).then((offsetElementList) => {
    const results = offsetElementList.results?.map((term) => {
      return {
        id: term.id,
        name: term.name,
        concept: term.concept,
        synonymTag: term.synonymTag,
        registrantName: new PolyglotModel(term.registrantName),
        modifierName: new PolyglotModel(term.modifierName),
        registeredTime: term.registeredTime,
        modifiedTime: term.modifiedTime,
      } as Term;
    });

    offsetElementList.results = results;

    setList({ ...offsetElementList });
  });
}

export function requestfindConcepts(conceptId?: string) {
  if (conceptId === undefined) {
    conceptId = '';
  }

  return findConcepts(conceptId);
}

export function requestFindAllConceptModal() {
  findConceptModal(getSearchBox() || getEmptySearchBox()).then((capabilities) => setConcept(capabilities));
}

export function requestFindTerms() {
  return findAllTerm(getSearchBox() || getEmptySearchBox());
}

export function requestFindConcept(termId: string) {
  return findConcept(termId);
}

export function requestFindConceptNames(conceptName: string) {
  return findConceptNames(conceptName);
}

export function requestExistsConcept(conceptCdo: ConceptCdo) {
  return existsConcept(conceptCdo);
}

// export function requestExistsConcept(termCdo: TermCdo) {
//   return existsConcept(termCdo);
// }

export function requestFindAllConceptExcel(): Promise<NaOffsetElementList<Term>> {
  return findAllConceptExcel(getSearchBox() || getEmptySearchBox());
}

export function selectField(search?: boolean): any {
  const fieldSelect: any = [];
  if (search) {
    fieldSelect.push({ key: 'All', text: '전체', value: '전체' });
  }
  requestfindConcepts().then((concepts: Concept[]) => {
    setConcept(concepts);

    concepts &&
      concepts.map((concept, index) => {
        fieldSelect.push({
          key: index + 1,
          text: concept.name,
          value: concept.id,
        });
      });
  });
  return fieldSelect;
}
