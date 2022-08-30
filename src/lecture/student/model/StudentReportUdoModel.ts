import { observable, decorate } from 'mobx';
import { DramaEntity } from '@nara.platform/accent/src/snap/index';
import { StudentModel } from './StudentModel';

export class StudentReportUdoModel extends StudentModel implements DramaEntity {
  //
  homeworkContent: string = '';
  homeworkOperatorComment: string = '';
  homeworkScore: number = 0;
  homeworkOperatorFileBoxId: string = '';
}

decorate(StudentReportUdoModel, {
  homeworkContent: observable,
  homeworkOperatorComment: observable,
  homeworkScore: observable,
  homeworkOperatorFileBoxId: observable,
});
