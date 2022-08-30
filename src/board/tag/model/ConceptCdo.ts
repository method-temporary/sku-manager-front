
export default interface ConceptCdo {
  conceptId: string;
  conceptName: string;
  termName?: string;
  synonymTag?: string;
  creatorName: string;
}

export function getEmptyConceptCdo(): ConceptCdo {
  const cineroomId = localStorage.getItem('nara.cineroomId');
  const cineroomWorkspaces: any[] = JSON.parse(
    localStorage.getItem('nara.workspaces')!
  ).cineroomWorkspaces;
  const audienceKey = cineroomWorkspaces.find((c) => c.id === cineroomId)
    .tenantId;
  const creatorName = localStorage.getItem('nara.displayName')!;
  return {
    conceptId: '',
    conceptName: '',
    creatorName,
  };
}

export function addCreatorConceptCdos(
  conceptCdos: ConceptCdo[]
): ConceptCdo[] {
  const creatorName = localStorage.getItem('nara.displayName')!;

  return conceptCdos.map(
    ({ conceptName, termName, synonymTag }) => {
      return {
        conceptId: '',
        conceptName,
        termName,
        synonymTag,
        creatorName,
      };
    }
  );
}
