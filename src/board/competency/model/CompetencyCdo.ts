import Creator from './Creator';

export default interface CompetencyCdo {
  competencyId: string;
  competencyGroup: string;
  competencyName: string;
  skill?: string;
  synonym?: string;
  creator: Creator;
}

export function getEmptyCompetencyCdo(): CompetencyCdo {
  const cineroomId = localStorage.getItem('nara.cineroomId');
  const cineroomWorkspaces: any[] = JSON.parse(
    localStorage.getItem('nara.workspaces')!
  ).cineroomWorkspaces;
  const audienceKey = cineroomWorkspaces.find((c) => c.id === cineroomId)
    .tenantId;
  const name = localStorage.getItem('nara.displayName')!;
  const email = localStorage.getItem('nara.email')!;
  return {
    competencyId: '',
    competencyGroup: '',
    competencyName: '',
    creator: {
      name,
      email,
    },
  };
}

export function addCreatorCompetencyCdos(
  competencyCdos: CompetencyCdo[]
): CompetencyCdo[] {
  const name = localStorage.getItem('nara.displayName')!;
  const email = localStorage.getItem('nara.email')!;

  return competencyCdos.map(
    ({ competencyGroup, competencyName, skill, synonym }) => {
      return {
        competencyId: '',
        competencyGroup,
        competencyName,
        skill,
        synonym,
        creator: {
          name,
          email,
        },
      };
    }
  );
}
