export interface ReportViewModel {
  studentId: string;
  homework: Homework;
  homeworkOperatorComment: string;
  homeworkOperatorFileBoxId: string;
  homeworkScore: number;
}

export interface Homework {
  reportName: string;
  reportQuestion: string;
  homeworkContent: string;
  homeworkFileBoxId: string;
}