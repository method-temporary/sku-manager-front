import { gradeAnswerSheet } from 'exam/api/examApi';
import { AnswerSheetUdo } from 'exam/model/sdo/AnswerSheetUdo';
import { EssayScore as EssayScoreWithPoint } from 'exam/viewmodel/GradeSheetViewModel';
import { EssayScore } from 'exam/model/sdo/GradeSheetUdo';
import { getGradeSheetViewModel } from 'exam/store/GradeSheetStore';
import { getStudentLectureId } from 'lecture/student/store/StudentLectureIdStore';

export async function updateGradeSheetAndLearningState(): Promise<string | undefined> {
  const gradeSheetViewModel = getGradeSheetViewModel();
  const studentLectureId = getStudentLectureId();

  if (gradeSheetViewModel === undefined || studentLectureId === undefined) {
    return undefined;
  }

  const essayScores = getEssayScores(gradeSheetViewModel.essayScores);

  const answerSheetUdo: AnswerSheetUdo = {
    studentDenizenId: studentLectureId.studentDenizenId,
    lectureId: studentLectureId.lectureId,
    essayScores,
    graderComment: gradeSheetViewModel.graderComment,
  };

  return gradeAnswerSheet(answerSheetUdo);
}

function getEssayScores(essayScoresWithPoint: EssayScoreWithPoint[]): EssayScore[] {
  return essayScoresWithPoint.map((essayScoresWithPoint) => {
    return {
      questionNo: essayScoresWithPoint.questionNo,
      score: essayScoresWithPoint.score,
    };
  });
}
