export class UserExcelUploadModel {
  //
  gender?: string = '';
  birthDate?: string = '';
  email: string = '';
  userGroupSequences: Sequences = getInitSequence();

  constructor(skProfileExcelUploadModel?: UserExcelUploadModel) {
    //
    if (skProfileExcelUploadModel) {
      Object.assign(this, { ...skProfileExcelUploadModel });
    }
  }
}

interface Sequences {
  sequences: number[];
}

function getInitSequence(): Sequences {
  //
  return {
    sequences: [],
  };
}
