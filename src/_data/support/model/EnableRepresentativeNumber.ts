export interface EnableRepresentativeNumber {
  representativeNumber: {
    id: string;
    name: string;
    phone: string;
    enabled: boolean;
    registrant: string;
    registeredTime: number;
    modifier: string;
    modifiedTime: number;
  };
  simpleUserIdentity: any;
}
