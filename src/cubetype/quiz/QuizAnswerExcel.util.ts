import { QuizAnswerExcelRdo } from '../../_data/quiz/quiz/model/QuizAnswerExcelRdo';
import { QuizQuestionType } from '../../_data/quiz/quiz/model/QuizQuestionType';
import { QuizQuestionItem } from '../../_data/quiz/quiz/model/QuizQuestionItem';
import { UserQuizAnswerRdo } from '../../_data/quiz/quiz/model/UserQuizAnswerRdo';
import { QuizChoiceAnswerExcelModel } from './model/excel/QuizChoiceAnswerExcelModel';
import dayjs from 'dayjs';
import { QuizSubjectAnswerExcelModel } from './model/excel/QuizSubjectAnswerExcelModel';
import XLSX, { ColInfo, Range, RowInfo, WorkBook, WorkSheet } from 'xlsx';

function downloadExcel(quizTitle: string, answerList: QuizAnswerExcelRdo[]) {
  //
  const wb = XLSX.utils.book_new();

  if (answerList.length < 1) {
    return;
  }

  answerList.forEach((item, idx) => parsingSheetData(idx, item, wb));

  const fileName = `${quizTitle}_${dayjs().format('YYYY-MM-DD HH:mm:ss')}.xlsx`;

  XLSX.writeFile(wb, fileName, { compression: true });
}

/**
 * quiz 문항별로 시트 작성
 * @param idx
 * @param quizQuestionInfo
 * @param wb
 */
function parsingSheetData(idx: number, quizQuestionInfo: QuizAnswerExcelRdo, wb: WorkBook) {
  //
  const sheetName: string = `${idx + 1}번 문항`;
  const data: QuizChoiceAnswerExcelModel[] | QuizSubjectAnswerExcelModel[] = parsingAnswerData(
    quizQuestionInfo.quizQuestionType,
    quizQuestionInfo.questionItems || [],
    quizQuestionInfo.userQuizAnswerRdoList || []
  );

  const ws: WorkSheet = designWorkSheet(quizQuestionInfo.quizQuestionType, !!quizQuestionInfo.quizSubText);

  const headerTitle = quizQuestionInfo.quizText || '';
  const subTitle = quizQuestionInfo.quizSubText || '';

  XLSX.utils.sheet_add_json(ws, [{ headerTitle }], { skipHeader: true, origin: 'A1' });
  subTitle && XLSX.utils.sheet_add_json(ws, [{ subTitle }], { skipHeader: true, origin: 'A2' });
  XLSX.utils.sheet_add_json(ws, data, { skipHeader: false, origin: (subTitle && 'A3') || 'A2' });
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
}

/**
 * 작성 시트의 전반적인 디자인 작성
 * * 셀단위 디자인 변경은 현재 확인안됨
 * @param type
 * @param hasSubText
 */
function designWorkSheet(type: QuizQuestionType, hasSubText?: boolean): WorkSheet {
  //
  // 객관식 / 주관식에 따라서 필요 컬럼수가 다름 => 최상단의 병합 사이즈가 다름
  const isChoice: boolean = type === 'SingleChoice' || type === 'MultipleChoice';
  /**
   * Note
   *  - 유형별로 사용하는 컬럼 수가 다름
   *  - 상단 Text 표현을 위한 병합 사이즈 조정
   */
  const mergeCellSize: number = isChoice ? 6 : 5;

  /**
   * Note
   *  - 컬럼별 width 길이 수정
   *  - 객관식 / 주관식에 따라 다른 넓이 적용
   */
  const cols: ColInfo[] = [
    { wpx: isChoice ? 55 : 300 },
    { wpx: isChoice ? 300 : 130 },
    { wpx: isChoice ? 130 : 55 },
    { wpx: isChoice ? 55 : 100 },
    { wpx: isChoice ? 100 : 100 },
    { wpx: isChoice ? 110 : 110 },
    { wpx: isChoice ? 110 : undefined },
  ];

  /**
   * Note
   *  - Cell 병합 옵션
   *  - s: 시작지점 / e: 종료지점 / c: CellIdx / r: RowIdx
   */
  // [A1:A:mergeCellSize] 만큼 병합
  const mergeRange: Range[] = [{ s: { c: 0, r: 0 }, e: { c: mergeCellSize, r: 0 } }];
  // [B1:B:mergeCellSize] 만큼 병합
  if (hasSubText) {
    mergeRange.push({ s: { c: 0, r: 1 }, e: { c: mergeCellSize, r: 1 } });
  }

  /**
   * Note
   *  - Row별 높이 수정
   *  - N번째 Row에 변동이 필요한 경우 아래 배열 index N-1번에 값 세팅 필요
   */
  const rowHeights: RowInfo[] = [];

  /**
   * Note
   *  - 사용 취소
   *  - subTitle을 한 Row에서 2번째 줄에 표현하기 위한 로직
   *  - subTitle을 2번째 Row에서 표현하므로 사용 불필요
   */
  // if (!hasSubText) {
  // 1번째 Row의 사이즈 pixel 단위로 조정
  // rowHeights.push({ hpx: 40 });
  // }

  return {
    // style은 pro 버전부터 적용? 추가적인 lib 필요?
    // '!A3': {
    //   s: {
    //     fill: {
    //       patternType: 'solid',
    //       fgColor: { rgb: '00dce6f1' },
    //       bgColor: { rgb: '00dce6f1' },
    //     },
    //   },
    // },

    '!cols': cols,
    '!merges': mergeRange,
    '!rows': rowHeights,
  } as WorkSheet;
}

/**
 * Note
 *  - headerTitle과 SubTitle을 한 Row에 표현하기 위한 함수
 *  - 엑셀 초기 생성 시 한줄로 보이는 오류가 있어(실제 데이터는 두줄) 각 Row별로 달리 표현하기 위해 취소
 */
// function parsingSheetHeader(title: string, subTitle?: string) {
//   return `${title || ''}${subTitle && ` \n${subTitle}`}`;
// }

/**
 * 문항별 기반 데이터 생성
 * 문항 유형별 함수 분기
 * @param type
 * @param questions
 * @param answers
 */
function parsingAnswerData(
  type: QuizQuestionType,
  questions: QuizQuestionItem[],
  answers: UserQuizAnswerRdo[]
): QuizChoiceAnswerExcelModel[] | QuizSubjectAnswerExcelModel[] {
  switch (type) {
    case 'SingleChoice':
    case 'MultipleChoice':
      return parsingChoiceAnswers(questions, answers);
    default:
      return parsingSubjectAnswers(questions, answers);
  }
}

/**
 * 단일 객관식 / 복수 객관식 유형의 문항 시트 내용을 위한 기반 데이터 작성
 * @param questions
 * @param answerUsers
 */
function parsingChoiceAnswers(
  questions: QuizQuestionItem[],
  answerUsers: UserQuizAnswerRdo[]
): QuizChoiceAnswerExcelModel[] {
  if (answerUsers.length < 1) {
    return [];
  }

  const result: QuizChoiceAnswerExcelModel[] = [];

  answerUsers.forEach(
    (answerUser) =>
      answerUser.quizQuestionAnswerItem &&
      answerUser.quizQuestionAnswerItem.forEach((answer) => {
        //
        const targetQuestion: QuizQuestionItem | undefined = questions.find(
          (question) => String(question.number || 0) === answer
        );

        result.push({
          '선택 답변': (targetQuestion && targetQuestion.number && targetQuestion.number.toString()) || '',
          '선택 답변 문항': (targetQuestion && targetQuestion.text) || '',
          답변일: dayjs(answerUser.registeredTime || 0).format('YYYY-MM-DD HH:mm:ss.SSS'),
          학습자: answerUser.name || '',
          이메일: answerUser.email || '',
          회사: answerUser.companyName || '',
          부서: answerUser.departmentName || '',
        });
      })
  );

  return result;
}

/**
 * 주관식 / 단답형 유형의 문항 시트 내용을 위한 기반 데이터 작성
 * @param questions
 * @param answerUsers
 */
function parsingSubjectAnswers(
  questions: QuizQuestionItem[],
  answerUsers: UserQuizAnswerRdo[]
): QuizSubjectAnswerExcelModel[] {
  if (answerUsers.length < 1) {
    return [];
  }

  const result: QuizSubjectAnswerExcelModel[] = [];

  answerUsers.forEach(
    (answerUser) =>
      answerUser.quizQuestionAnswerItem &&
      answerUser.quizQuestionAnswerItem.forEach((answer) => {
        result.push({
          답변: answer,
          답변일: dayjs(answerUser.registeredTime || 0).format('YYYY-MM-DD HH:mm:SSS'),
          학습자: answerUser.name || '',
          이메일: answerUser.email || '',
          회사: answerUser.companyName || '',
          부서: answerUser.departmentName || '',
        });
      })
  );

  return result;
}

export const QuizAnswerExcelFunc = {
  downloadExcel,
};
