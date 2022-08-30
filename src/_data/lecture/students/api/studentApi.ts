import { axiosApi as axios, paramsSerializer } from 'shared/axios/Axios';
import { CardStudentQdo } from '../model/CardStudentQdo';
import { OffsetElementList } from '../../../../shared/model';
import { AxiosReturn } from '../../../../shared/present';
import StudentDeleteResultModel from '../../../../student/model/StudentDeleteResultModel';
import { StudentLearningStateUdo } from '../model/sdo/StudentLearningStateUdo';
import { StudentCountQdo } from '../model/sdo/StudentCountQdo';
import { StudentWithUserIdentity } from '../model/sdo/StudentWithUserIdentity';
import { CardRelatedStudentCdo } from '../model/sdo/CardRelatedStudentCdo';
import { StudentAcceptOrRejectUdo } from '../model/sdo/StudentAcceptOrRejectUdo';
import { CubeIdAndStudentCountRdo } from '../model/CubeIdAndStudentCountRdo';
import { PaidCourseQueryModel } from '../model/PaidCourseQueryModel';
import { PaidCourse } from '../model/PaidCourse';
import { StudentModifyRoundUdo } from 'card/student/model/StudentModifyRoundUdo';

const STUDENT_ADMIN_URL = '/api/lecture/students/admin';
const STUDENT_URL = '/api/lecture/students';

export function findCardStudentForAdmin(
  cardStudentQdo: CardStudentQdo
): Promise<OffsetElementList<StudentWithUserIdentity>> {
  //
  const url = `${STUDENT_ADMIN_URL}/findCardStudentByCardStudentRdo`;
  return axios
    .get(url, {
      params: cardStudentQdo,
      paramsSerializer,
    })
    .then(AxiosReturn);
}

export function findCardStudentForExcelDownload(
  cardStudentQdo: CardStudentQdo
): Promise<OffsetElementList<StudentWithUserIdentity>> {
  //
  const url = `${STUDENT_ADMIN_URL}/findCardStudentByCardStudentRdoForExcel`;
  return axios
    .get(url, {
      params: cardStudentQdo,
      paramsSerializer,
    })
    .then(AxiosReturn);
}

export function deleteCardStudent(ids: string[]): Promise<StudentDeleteResultModel[]> {
  //
  const url = `${STUDENT_ADMIN_URL}`;

  return axios
    .delete(url, {
      data: { ids },
    })
    .then((response) => (response && response.data.studentRemoveResults) || []);
}

export function modifyStudentsState(studentLearningStateUdo: StudentLearningStateUdo) {
  //
  const url = `${STUDENT_ADMIN_URL}`;

  return axios
    .put(`${url}/modifyStudentLearningState`, studentLearningStateUdo)
    .then((response) => response && response.data);
}

export function findStudentCount(studentCountQdo: StudentCountQdo) {
  //
  const url = `${STUDENT_URL}`;

  return axios
    .get(`${url}/count`, {
      params: studentCountQdo,
      paramsSerializer,
    })
    .then((response) => response && response.data);
}

export function registerRelatedStudents(cardRelatedStudentCdo: CardRelatedStudentCdo) {
  const url = `${STUDENT_ADMIN_URL}/relatedStudents`;
  return axios.postLoader<boolean>(url, cardRelatedStudentCdo).then((response) => (response && response.data) || false);
}

export function accept(studentAcceptOrReject: StudentAcceptOrRejectUdo) {
  const url = `${STUDENT_URL}/accept`;
  return axios.put(url, studentAcceptOrReject).then(AxiosReturn);
}

export function reject(studentAcceptOrReject: StudentAcceptOrRejectUdo) {
  const url = `${STUDENT_URL}/reject`;
  return axios.put(url, studentAcceptOrReject).then(AxiosReturn);
}

export function findStudentByCubeId(cubeIds: string[]): Promise<CubeIdAndStudentCountRdo[]> {
  return axios.post(`${STUDENT_ADMIN_URL}/studentCountByCubeIds`, cubeIds).then(AxiosReturn);
}

export function findStudentApprovalsForAdmin(
  params: PaidCourseQueryModel
): Promise<OffsetElementList<PaidCourse> | undefined> {
  const url = `${STUDENT_ADMIN_URL}/paidCourse`;

  return axios.get<OffsetElementList<PaidCourse>>(url, { params }).then(AxiosReturn);
}

export function modifyCardStudentRound(cardStudentChangeRoundParams: StudentModifyRoundUdo) {
  const url = `${STUDENT_ADMIN_URL}/modifyCardStudentRound`;
  return axios.put(url, cardStudentChangeRoundParams).then(AxiosReturn);
}
