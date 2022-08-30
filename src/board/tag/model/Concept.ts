

export default interface Concept {
  id: string;
  name: string;
}

export interface ConceptName {
  title: string;
}
export function convertToNames(conceptNames: string[]): ConceptName[] {
  return conceptNames.map((conceptName) => {
    return {
      title: conceptName,
    };
  });
}

export function getEmptyConcept(): Concept {
  return {
    id: '',
    name: ''
  };
}
