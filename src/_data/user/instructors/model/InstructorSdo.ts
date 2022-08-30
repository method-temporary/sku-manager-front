export interface InstructorSdo {
  //
  startDate: number | undefined;
  endDate: number | undefined;

  collegeId: string | undefined;
  internal: boolean | undefined;
  resting: boolean | undefined;

  email: string | undefined;
  name: string | undefined;
  position: string | undefined;

  instructorIds: string[] | undefined;

  offset: number | undefined;
  limit: number | undefined;
}

export function getInitInstructorSdo() {
  //
  return {
    startDate: undefined,
    endDate: undefined,
    collegeId: undefined,
    internal: undefined,
    resting: undefined,
    email: undefined,
    name: undefined,
    position: undefined,
    instructorIds: undefined,
    offset: undefined,
    limit: undefined,
  };
}
