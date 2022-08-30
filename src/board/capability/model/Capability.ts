import CapabilityGroup, { getEmptyCapabilityGroup } from './CapabilityGroup';

export default interface Capability {
  id: string;
  name: string;
  capabilityGroup: CapabilityGroup;
}

export interface CapabilityName {
  title: string;
}
export function convertToNames(capabilityNames: string[]): CapabilityName[] {
  return capabilityNames.map((capabilityName) => {
    return {
      title: capabilityName,
    };
  });
}

export function getEmptyCapability(): Capability {
  return {
    id: '',
    name: '',
    capabilityGroup: getEmptyCapabilityGroup(),
  };
}
