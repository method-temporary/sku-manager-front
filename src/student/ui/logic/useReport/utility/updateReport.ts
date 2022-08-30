import StudentApi from 'student/present/apiclient/StudentApi';
import { getReportViewModel } from 'student/store/ReportStore';
import { HomeworkCommentUdo } from 'student/model/vo/HomeworkCommentUdo';
import { ExtraWorkState } from '../../../../model/vo/ExtraWorkState';

export async function updateReport() {
  const studentApi = StudentApi.instance;
  const reportViewModel = getReportViewModel();

  if (reportViewModel === undefined) {
    return;
  }

  const homeworkCommentUdo: HomeworkCommentUdo = {
    studentId: reportViewModel.studentId,
    homeworkOperatorComment: reportViewModel.homeworkOperatorComment,
    homeworkOperatorFileBoxId: reportViewModel.homeworkOperatorFileBoxId,
    homeworkScore: reportViewModel.homeworkScore,
    homeworkPassed: reportViewModel.homeworkState === ExtraWorkState.Pass,
  };

  await studentApi.modifyStudentHomeworkComment(homeworkCommentUdo);
}
