import { NameValueList } from '@nara.platform/accent';
import { axiosApi as axios } from 'shared/axios/Axios';
import { WorkBook } from 'xlsx';
import { StudentCdoModel } from '../../model/StudentCdoModel';
import { StudentModel } from '../../model/StudentModel';
import { StudentRdoModel } from '../../model/StudentRdoModel';
import { StudentCountRdoModel } from '../../model/StudentCountRdoModel';
import { StudentReportUdoModel } from '../../model/StudentReportUdoModel';
import StudentByCubeRdo from '../../model/StudentByCubeRdo';
import { HomeworkCommentUdo } from 'student/model/vo/HomeworkCommentUdo';
import { StudentLearningStateUdo } from '../../../card/student/model/vo/StudentLearningStateUdo';
import { OffsetElementList } from 'shared/model';
import { StudentCardRdoModel } from '../../model/StudentCardRdoModel';
import { AxiosPromise } from 'axios';
import StudentCountRdo from 'student/model/vo/StudentCountRdo';
import StudentCount from 'student/model/vo/StudentCount';
import qs from 'qs';
import { StudentSendEmail } from '../../../card/student/model/vo/StudentSendEmail';
import { StudentByExcelCdo } from '../../model/vo/StudentByExcelCdo';
import { StudentWithUserIdentity } from '../../model/StudentWithUserIdentity';
import StudentEmailCdoModel from 'student/model/StudentEmailCdoModel';
import StudentDeleteResultModel from 'student/model/StudentDeleteResultModel';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

export default class StudentApi {
  //
  URL = '/api/lecture/students';
  ADMIN_URL = '/api/lecture/students/admin';

  static instance: StudentApi;

  registerStudent(studentCdo: StudentCdoModel) {
    //
    return axios.postLoader<string>(this.URL, studentCdo).then((response) => (response && response.data) || null);
  }

  registerStudentByEmail(studentEmailCdo: StudentEmailCdoModel) {
    //
    return axios
      .postLoader<boolean>(this.ADMIN_URL + '/relatedStudents', studentEmailCdo)
      .then((response) => (response && response.data) || false);
  }

  findStudent(studentId: string) {
    //
    return axios.get<StudentModel>(this.URL + `/${studentId}`).then((response) => (response && response.data) || null);
  }

  findStudentCountByCourseLectureUsid(courseLectureUsid: string) {
    //
    return axios
      .get<StudentCountRdoModel>(this.URL + `/count/byCourseLectureId?courseLectureId=${courseLectureUsid}`)
      .then((response) => (response && response.data) || null);
  }

  findStudentCountByProgramLectureUsid(programLectureUsid: string) {
    //
    return axios
      .get<StudentCountRdoModel>(this.URL + `/count/byProgramLectureId?programLectureId=${programLectureUsid}`)
      .then((response) => (response && response.data) || null);
  }

  findAllStudentsForExcel(studentRdo: StudentRdoModel) {
    //return axios.get<StudentModel[]>(this.URL + `/findAll`, { params: studentRdo })
    return axios
      .get<StudentModel[]>(this.URL + `/findAllForExcel`, {
        params: studentRdo,
      })
      .then((response) => (response && response.data) || null);
  }

  modifyStudent(studentId: string, nameValues: NameValueList) {
    //
    return axios.putLoader<void>(this.URL + `${studentId}`, { params: nameValues });
  }

  modifyStudentForExam(studentId: string, examId: string, fromGrader: boolean = false): AxiosPromise<void> {
    // return axios.put<void>(this.URL + `/examProcess/${studentId}/${examId}`, { fromGrader });
    return axios.putLoader<void>(this.URL + `/examProcess/${studentId}/${examId}?fromGrader=${fromGrader}`);
  }

  modifyStudentForHomework(fileBoxId: string, students: StudentModel[]) {
    //
    return axios.putLoader<void>(this.URL + `/homework/${fileBoxId}`, students);
  }

  modifyStudentForHomeworkComment(student: StudentReportUdoModel) {
    //
    return axios.putLoader<void>(this.URL + `/homeworkComment/`, student);
  }

  // Master 추가 Function
  modifyStudentHomeworkComment(homeworkCommentUdo: HomeworkCommentUdo): Promise<void> {
    // axios.put<void>(`${this.URL}/homeworkComment`, homeworkCommentUdo);
    return axios
      .putLoader(`${this.ADMIN_URL}/gradeHomework`, homeworkCommentUdo)
      .then((response) => (response && response.data) || null);
  }

  removeStudent(studentIds: string[]) {
    //
    return axios.deleteLoader(this.URL + '?studentIds=' + studentIds);
  }

  excelWrite(studentRdo: StudentRdoModel) {
    //
    return axios.get<WorkBook>(this.URL + `/download`, { params: studentRdo });
  }

  // 2021-03-29 박종유 Card Student Api 추가
  findCardStudentsById(studentCardRdoModel: StudentCardRdoModel): Promise<OffsetElementList<StudentWithUserIdentity>> {
    //
    return (
      axios
        // .get(`${this.URL}/findCardStudentByCardStudentRdo`, {
        .getLoader(`${this.ADMIN_URL}/findCardStudentByCardStudentRdo`, {
          params: studentCardRdoModel,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'comma' });
          },
        })
        .then((response) => OffsetElementList.fromResponse(response.data))
    );
    // return axios
    //   .get(`${this.URL}/findByStudentByCardRdo?offset=0&limit=20&cardId=Card-l`)
    //   .then((response) => OffsetElementList.fromResponse(response.data));
  }

  // 2021-03-29 박종유 Card Student Api 추가
  findCardStudentsByIdForExcel(
    studentCardRdoModel: StudentCardRdoModel
  ): Promise<OffsetElementList<StudentWithUserIdentity>> {
    //
    const apiUrl = `${this.ADMIN_URL}/findCardStudentByCardStudentRdoForExcel`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: studentCardRdoModel,
      workType: 'Excel Download',
    });

    return axios
      .getLoader(apiUrl, {
        params: studentCardRdoModel,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
    // return axios
    //   .get(`${this.URL}/findByStudentByCardRdo?offset=0&limit=20&cardId=Card-l`)
    //   .then((response) => OffsetElementList.fromResponse(response.data));
  }

  modifyStudentsState(studentLearningStateUdo: StudentLearningStateUdo) {
    //
    return axios
      .putLoader(`${this.ADMIN_URL}/modifyStudentLearningState`, studentLearningStateUdo)
      .then((response) => response && response.data);
  }

  findStudentCount(studentCardRdoModel: StudentCardRdoModel) {
    //
    return axios
      .getLoader(`${this.URL}/count`, {
        params: studentCardRdoModel,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => response && response.data);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 2021-04-01 박종유 Cube Student Api 추가
  countStudent(studentCountRdo: StudentCountRdo): Promise<StudentCount> {
    //
    return axios
      .get(this.URL + `/count`, { params: studentCountRdo })
      .then((response) => (response && response.data) || null);
  }

  findStudentByCubeRdo(studentByCubeRdo: StudentByCubeRdo): Promise<OffsetElementList<StudentWithUserIdentity>> {
    //
    return axios
      .getLoader(this.ADMIN_URL + `/findCubeStudentByCubeStudentRdo`, {
        params: studentByCubeRdo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'comma' });
        },
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  modifyStudentLearningState(studentLearningStateUdo: StudentLearningStateUdo): Promise<void> {
    //
    return axios
      .putLoader(this.ADMIN_URL + `/modifyStudentLearningState`, studentLearningStateUdo)
      .then((response) => (response && response.data) || null);
  }

  sendEmailForAdmin(studentSendEmail: StudentSendEmail): Promise<void> {
    //
    return axios
      .post(this.ADMIN_URL + '/sendEmail', studentSendEmail)
      .then((response) => (response && response.data) || null);
  }

  accept(ids: string[]): Promise<void> {
    return axios.put(this.URL + `/accept?ids=${ids}`).then((response) => (response && response.data) || null);
  }

  reject(ids: string[], nameValueList: NameValueList): Promise<void> {
    return axios
      .put(this.URL + `/reject?ids=${ids}`, nameValueList)
      .then((response) => (response && response.data) || null);
  }

  uploadByExcel(studentExcelCdos: StudentByExcelCdo[]) {
    //
    return axios
      .postLoader(this.ADMIN_URL + '/excel/upload', studentExcelCdos)
      .then((response) => (response && response.data) || null);
  }

  deleteCardStudent(ids: string[]): Promise<StudentDeleteResultModel[]> {
    //
    return axios
      .delete(this.ADMIN_URL, {
        data: { ids },
      })
      .then((response) => (response && response.data.studentRemoveResults) || []);
  }
}

Object.defineProperty(StudentApi, 'instance', {
  value: new StudentApi(),
  writable: false,
  configurable: false,
});
