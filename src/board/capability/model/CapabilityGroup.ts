export default interface CapabilityGroup {
  id: string;
  name: string;
}

export function getEmptyCapabilityGroup(): CapabilityGroup {
  return {
    id: '',
    name: '',
  };
}
