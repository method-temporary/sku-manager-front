export class StudentCdo {
  //
  cardId: string = '';
  cubeId: string = '';
  round: number = 0;
  approverDenizenId: string = '';

  constructor(studentCdo?: StudentCdo) {
    if (studentCdo) {
      Object.assign(this, { ...studentCdo });
    }
  }
}
