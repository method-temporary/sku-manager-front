import { LearningState } from '../../model/LearningState';
import { MemberService } from '../../../../approval';
import { StudentProfileModel } from '../../../../card/student/model/vo/StudentProfileModel';
import { CubeStudentService } from '../../../../cube/cube';
import { StudentModel } from '../../../../student/model/StudentModel';

export async function setStudentInfo(
  students: StudentModel[],
  cubeStudentService: CubeStudentService,
  memberService: MemberService
) {
  //
  const { setStudentProfile } = cubeStudentService;

  const ids = students.map((student) => student.patronKey.keyString);

  const members = await memberService.findMemberByIds(ids);

  const map: Map<string, StudentProfileModel> = new Map<string, StudentProfileModel>();

  members.forEach((member) => {
    map.set(
      member.patronKey.keyString,
      new StudentProfileModel({
        id: member.patronKey.keyString,
        company: member.companyName,
        department: member.departmentName,
        email: member.email,
      })
    );
  });

  setStudentProfile(map);

  return map;
}

export function displayLearningState(state: LearningState) {
  //
  if (state === LearningState.Passed) {
    return '이수';
  }

  if (state === LearningState.Missed) {
    return '미이수';
  }

  // if (state === LearningState.Waiting || state === LearningState.Progress) {
  if (state === LearningState.Progress) {
    return '결과처리대기';
  }

  if (state === LearningState.NoShow) {
    return '불참';
  }

  return '';
}

export function removeInList(index: number, oldList: any[]) {
  //
  return oldList.slice(0, index).concat(oldList.slice(index + 1));
}
