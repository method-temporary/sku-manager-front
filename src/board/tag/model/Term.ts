import { PolyglotModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import Concept from './Concept';
import moment from 'moment';
import Concepts from './view/ConceptView';
import Terms from './view/TermView';

export default interface Term {
  id: string;
  name: string;
  concept: Concept;
  synonymTag: string;
  registrantName: PolyglotModel;
  modifierName: PolyglotModel;
  registeredTime: number;
  modifiedTime: number;
}

export interface TermExcel {
  No: string;
  Concept: string;
  term: string;
  유사어: string;
  등록일: string;
  생성자: string;
  수정일: string;
  수정자: string;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

export function convertToExcel(term: Term[]): TermExcel[] {
  let no = 1;
  return term.map(({ id, name, concept, synonymTag, registrantName, modifierName, registeredTime, modifiedTime }) => {
    return {
      No: `${no++}`,
      Concept: concept.name,
      term: name,
      유사어: synonymTag,
      등록일: timeToDateString(registeredTime),
      생성자: getPolyglotToAnyString(registrantName),
      수정일: modifiedTime ? timeToDateString(modifiedTime) : '',
      수정자: modifierName && getPolyglotToAnyString(modifierName),
    };
  });
}

// export function convertToTermList(concepts: Concepts[]): Term[] {
//   const terms: Term[] = [];
//   let term: Term;
//   concepts.forEach((concepts) => {
//     term.concept.concept.id = concepts.id;
//     term.concept.concept.name = concepts.name;
//     concepts.capabilities.forEach((cp) => {
//       term.concept.id = cp.id;
//       term.concept.name = cp.name;
//       cp.terms.forEach((s) => {
//         term.id = s.id;
//         term.name = s.name;
//         term.synonymTag = s.synonymTag;
//       });
//     });
//     terms.push(term);
//   });

//   return terms;
// }

export function convertToTerm(concepts: Concepts, term: Terms): Term {
  // const concept: Concept;
  // const concept: Concept;

  const concept = {
    id: concepts.id,
    name: concepts.name,
  };

  return {
    id: term.id,
    name: term.name,
    concept,
    synonymTag: term.synonymTag,
    registrantName: new PolyglotModel(),
    modifierName: new PolyglotModel(),
    registeredTime: 0,
    modifiedTime: 0,
  };
}
