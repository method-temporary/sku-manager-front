export interface CapabilityQdo {
  assessmentId: string;
  companyName: string;
  departmentName: string;
  name: string;
  email: string;
  offset: number;
  limit: number;
}

export const initializeCapabilityQdo = (): CapabilityQdo => {
  return {
    assessmentId: '',
    companyName: '',
    departmentName: '',
    name: '',
    email: '',
    offset: 0,
    limit: 20,
  };
};
