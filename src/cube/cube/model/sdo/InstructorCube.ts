import moment from 'moment';

import { CubeType, PolyglotModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { EnumUtil, CubeTypeView } from 'shared/ui';

import { LectureXlsxModel } from '../../../../instructor/lecture/model/LectureXlsxModel';

export class InstructorCube {
  //
  cubeId: string = '';
  name: PolyglotModel = new PolyglotModel();
  type: CubeType = CubeType.ALL;
  collegeId: string = '';
  channelId: string = '';
  organizerId: string = '';
  otherOrganizerName: string = '';
  passedStudentCount: number = 0;
  studentCount: number = 0;
  starCount: number = 0;
  time: number = 0;
  lectureTime: number = 0;
  instructorLearningTime: number = 0;

  constructor(instructorCube?: InstructorCube) {
    if (instructorCube) {
      Object.assign(this, { ...instructorCube });
    }
  }

  static asXLSX(
    instructorCube: InstructorCube,
    index: number,
    collegeName: string = '',
    channelName: string = ''
  ): LectureXlsxModel {
    //

    const channel = collegeName + ' -> ' + channelName || '-';
    return {
      No: String(index + 1),
      과정명: getPolyglotToAnyString(instructorCube.name) || '-',
      교육형태: EnumUtil.getEnumValue(CubeTypeView, instructorCube.type).get(instructorCube.type) || '-',
      Channel: channel,
      교육기관: instructorCube && instructorCube.otherOrganizerName,
      학습인원: instructorCube.studentCount,
      이수인원: instructorCube.passedStudentCount,
      강의시간: instructorCube.lectureTime,
      인정학습시간: instructorCube.instructorLearningTime,
      등록일자: moment(instructorCube.time).format('YYYY.MM.DD HH:mm:ss') || '-',
    };
  }
}
