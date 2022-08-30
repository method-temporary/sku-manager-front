import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosPromise } from 'axios';
import { StudentCountRdoModel } from '../../model/StudentCountRdoModel';
import { StudentRequestCdoModel } from '../../model/StudentRequestCdoModel';
import { StudentTestCountRdoModel } from '../../model/StudentTestCountRdoModel';
import { LearningStateUdoModel } from '../../model/vo/LearningStateUdoModel';
import { StudentCdoModel } from '../../model/StudentCdoModel';
import { StudentModel } from '../../model/StudentModel';
import { ExcelReadCountRdoModel } from '../../model/vo/ExcelReadCountRdoModel';
import StudentSendEmailModel from '../../model/StudentSendEmailModel';
import { ProgramLectureModel } from '../../../lecture/programLecture/model/ProgramLectureModel';

export default class StudentFlowApi {
  //
  URL = `/api/lecture/students/flow`;

  static instance: StudentFlowApi;

  studentRequestOpen(studentRequestCdo: StudentRequestCdoModel) {
    //
    return axios.post<void>(this.URL + '/requestOpen', studentRequestCdo);
  }

  studentRequestReject(studentRequestCdo: StudentRequestCdoModel) {
    //
    return axios.post<void>(this.URL + '/requestReject', studentRequestCdo);
  }

  findStudentCount(rollBookId: string) {
    //
    return axios
      .get<StudentCountRdoModel>(this.URL + `/count/byRollBookId?rollBookId=${rollBookId}`)
      .then((response) => (response && response.data) || null);
  }

  findStudentTestCount(rollBookId: string) {
    //
    return axios
      .get<StudentTestCountRdoModel>(this.URL + `/count/test/byRollBookId?rollBookId=${rollBookId}`)
      .then((response) => (response && response.data) || null);
  }

  findCourseStudentTestCount(courseLectureUsid: string) {
    //
    return axios
      .get<StudentTestCountRdoModel>(this.URL + `/count/test/byCourseLectureId?courseLectureUsid=${courseLectureUsid}`)
      .then((response) => (response && response.data) || null);
  }

  findProgramStudentTestCount(programLectureUsid: string) {
    //
    return axios
      .get<StudentTestCountRdoModel>(
        this.URL + `/count/test/byProgramLectureId?programLectureUsid=${programLectureUsid}`
      )
      .then((response) => (response && response.data) || null);
  }

  excelRead(studentCdos: StudentCdoModel[]) {
    //
    return axios
      .post<ExcelReadCountRdoModel>(this.URL + `/upload`, studentCdos)
      .then((response) => (response && response.data) || null);
  }

  modifyStudents(examId: string, students: StudentModel[]) {
    //
    return axios.put<void>(this.URL + `/modifyStudents/${examId}`, students);
  }

  modifyStudentForExam(studentId: string, examId: string, fromGrader: boolean = false): AxiosPromise<void> {
    return axios.put<void>(this.URL + `/examProcess/${studentId}/${examId}`, { fromGrader });
  }

  modifyLearningState(learningStateUdo: LearningStateUdoModel) {
    //
    return axios.put<void>(this.URL + '/learningState', learningStateUdo);
  }

  collectLectureCardUsids(programLecture: ProgramLectureModel) {
    //
    return axios
      .put<string[]>(this.URL + `/findByIds`, programLecture)
      .then((response) => (response && response.data) || null);
  }

  sendEmail(studentSendEmail: StudentSendEmailModel) {
    //
    return axios.post<void>(this.URL + '/sendEmail', studentSendEmail);
  }
}

Object.defineProperty(StudentFlowApi, 'instance', {
  value: new StudentFlowApi(),
  writable: false,
  configurable: false,
});
