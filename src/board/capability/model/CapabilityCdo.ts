import Creator from './Creator';

export default interface CapabilityCdo {
  capabilityId: string;
  capabilityGroupId: string;
  capabilityName: string;
  skillName?: string;
  synonymTag?: string;
  creatorName: string;
}

export function getEmptyCapabilityCdo(): CapabilityCdo {
  const cineroomId = localStorage.getItem('nara.cineroomId');
  const cineroomWorkspaces: any[] = JSON.parse(
    localStorage.getItem('nara.workspaces')!
  ).cineroomWorkspaces;
  const audienceKey = cineroomWorkspaces.find((c) => c.id === cineroomId)
    .tenantId;
  const creatorName = localStorage.getItem('nara.displayName')!;
  return {
    capabilityId: '',
    capabilityGroupId: '',
    capabilityName: '',
    creatorName,
  };
}

export function addCreatorCapabilityCdos(
  capabilityCdos: CapabilityCdo[]
): CapabilityCdo[] {
  const creatorName = localStorage.getItem('nara.displayName')!;

  return capabilityCdos.map(
    ({ capabilityGroupId, capabilityName, skillName, synonymTag }) => {
      return {
        capabilityId: '',
        capabilityGroupId,
        capabilityName,
        skillName,
        synonymTag,
        creatorName,
      };
    }
  );
}
