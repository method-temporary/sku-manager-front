import { decorate, observable } from 'mobx';
import moment from 'moment';

import { IdName } from 'shared/model';
import { EnumUtil, CubeTypeView } from 'shared/ui';

import { LectureXlsxModel } from './LectureXlsxModel';
import { CubeContentsModel } from '../../../personalcube/model/old/CubeContentsModel';
import Instructor, { getEmptyInstructor } from '../../instructor/model/Instructor';
import Lecture from './Lecture';
import { CategoryModel } from './CategoryModel';

export class LectureListViewModel implements Lecture {
  organizer: IdName = new IdName();
  studentCount: number = 0;
  passedStudentCount: number = 0;
  name: string = '';
  category: CategoryModel = new CategoryModel();
  contents: CubeContentsModel = new CubeContentsModel();
  instructor: Instructor = getEmptyInstructor();
  time: number = 0;

  constructor(lecture?: LectureListViewModel) {
    this.organizer = lecture?.organizer || new IdName();
    this.studentCount = lecture?.studentCount || 0;
    this.passedStudentCount = lecture?.passedStudentCount || 0;

    this.name = lecture?.name || '';
    this.category = lecture?.category || new CategoryModel();
    this.contents = lecture?.contents || new CubeContentsModel();
    this.instructor = lecture?.instructor || getEmptyInstructor();
    this.time = lecture?.time || 0;
  }

  static asXLSX(lecture: LectureListViewModel, index: number): LectureXlsxModel {
    //
    return {
      No: String(index + 1),
      과정명: lecture.name || '-',
      교육형태: EnumUtil.getEnumValue(CubeTypeView, lecture.contents.type).get(lecture.contents.type) || '-',
      Channel: lecture.category.college.name + ' -> ' + lecture.category.channel.name || '-',
      교육기관: lecture.organizer && lecture.organizer.name,
      학습인원: lecture.studentCount,
      이수인원: lecture.passedStudentCount,
      강의시간: lecture.instructor?.lectureTime,
      인정학습시간: lecture.instructor?.instructorLearningTime,
      등록일자: moment(lecture.time).format('YYYY.MM.DD HH:mm:ss') || '-',
    };
  }
}

decorate(LectureListViewModel, {
  organizer: observable,
  studentCount: observable,
  passedStudentCount: observable,
  name: observable,
  category: observable,
  contents: observable,
  instructor: observable,
  time: observable,
});
