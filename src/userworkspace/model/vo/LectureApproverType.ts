export enum LectureApproverType {
  DEFAULT = '',
  //
  TeamLeader = 'TeamLeader',
  HrManager = 'HrManager',
}

export function getLectureApproverTypeValue(type: LectureApproverType): string {
  //
  let value = '';
  if (type === LectureApproverType.HrManager) {
    value = 'HR 담당자';
  } else if (type === LectureApproverType.TeamLeader) {
    value = '팀 리더';
  }
  return value;
}
