import { StudentModel } from 'student/model/StudentModel';
import { StudentProfileModel } from '../../model/vo/StudentProfileModel';
import { LearningState } from '../../../../lecture/student/model/LearningState';
import { MemberService } from '../../../../approval';
import { ExtraWorkState } from 'student/model/vo/ExtraWorkState';
import { StudentService } from '../../../../student';

export async function setStudentInfo(
  students: StudentModel[],
  studentService: StudentService,
  memberService: MemberService,
  excel?: boolean
) {
  //
  const { changeStudentsProp, changeStudentsAllProp } = studentService;

  const ids = students.map((student) => student.patronKey.keyString);

  const members = await memberService.findMemberByIds(ids);

  const map: Map<string, StudentProfileModel> = new Map<string, StudentProfileModel>();

  await members?.forEach((member) => {
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

  await students?.forEach((student, index) => {
    const profile = map.get(student.patronKey.keyString);

    if (excel) {
      changeStudentsAllProp(index, 'department', profile ? profile.department : '');
      changeStudentsAllProp(index, 'company', profile ? profile.company : '');
      changeStudentsAllProp(index, 'email', profile ? profile.email : '');
    } else {
      changeStudentsProp(index, 'department', profile ? profile.department : '');
      changeStudentsProp(index, 'company', profile ? profile.company : '');
      changeStudentsProp(index, 'email', profile ? profile.email : '');
    }
  });

  return map;
}

export function displayResultLearningState(state: LearningState) {
  //
  if (
    state === LearningState.Progress
    // state === LearningState.Progress ||
    // state === LearningState.Waiting ||
    // state === LearningState.Failed ||
    // state === LearningState.TestWaiting ||
    // state === LearningState.HomeworkWaiting ||
    // state === LearningState.TestPassed
  ) {
    return '결과처리대기';
  }

  if (state === LearningState.Passed) {
    return '이수';
  }

  if (state === LearningState.Missed) {
    return '미이수';
  }

  if (state === LearningState.NoShow) {
    return '불참';
  }

  return '';
}

export function displayExtraWorkState(state: ExtraWorkState) {
  //
  if (state === ExtraWorkState.Submit) {
    return '제출';
  }

  if (state === ExtraWorkState.Pass) {
    return '통과';
  }

  if (state === ExtraWorkState.Fail) {
    return '실패';
  }

  return '';
}
