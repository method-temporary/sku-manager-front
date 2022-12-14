import XLSX from 'xlsx';
import dayjs from 'dayjs';

import { PolyglotModel } from '../shared/model';
import { getPolyglotToAnyString } from '../shared/components/Polyglot';

import { MatrixQuestionItems } from './form/model/MatrixQuestionItems';
import { AnswerSheetService, SurveyFormService } from './index';

export async function onDownLoadSurveyExcel(surveyId: string, surveyCaseId: string, name: PolyglotModel) {
  //
  const { findSurveyForm, surveyForm } = SurveyFormService.instance;
  const { findEvaluationSheetsBySurveyCaseIdForExcel } = AnswerSheetService.instance;

  await findSurveyForm(surveyId);
  await findEvaluationSheetsBySurveyCaseIdForExcel(surveyCaseId);

  const { evaluationSheetsForExcel } = AnswerSheetService.instance;
  const { questions } = surveyForm;

  console.log(questions);
  console.log(evaluationSheetsForExcel);

  const wbList: any[] = [];

  evaluationSheetsForExcel &&
    evaluationSheetsForExcel.forEach((evaluationSheet) => {
      const { answers } = evaluationSheet;
      const answerMap: Map<string, string> = new Map();

      answers &&
        answers.forEach((answer) => {
          let answerData = '';
          if (answer.answerItem.answerItemType === 'Boolean') {
            answerData = answer.answerItem.itemNumbers[0] === '0' ? 'No' : 'Yes';
          } else if (answer.answerItem.answerItemType === 'Date') {
            answerData = answer.answerItem.sentence;
          } else if (answer.answerItem.answerItemType === 'Matrix') {
            answer.answerItem &&
              answer.answerItem.matrixItem &&
              answer.answerItem.matrixItem.forEach((matrixItem) => {
                answerMap.set(answer.questionNumber + '-' + matrixItem.rowNumber, matrixItem.columnSelectedNumber);
              });
          } else if (answer.answerItem.answerItemType === 'Review') {
            answerData =
              getChoiceFixedItemNumberText(answer.answerItem.itemNumbers[0]) + '-' + (answer.answerItem.sentence || '');
          } else if (answer.answerItem.answerItemType === 'ChoiceFixed') {
            answerData = getChoiceFixedItemNumberText(answer.answerItem.itemNumbers[0]);
          } else {
            answerData = answer.answer;
          }

          if (answer.answerItem.answerItemType !== 'Matrix') {
            answerMap.set(answer.questionNumber, answerData);
          }
        });

      const wb: any = {
        ?????????: evaluationSheet.email,
        ??????: evaluationSheet.employeeId,
        ?????????: evaluationSheet.name,
        ????????????: evaluationSheet.companyCode,
        ?????????: evaluationSheet.company,
        ????????????: evaluationSheet.departmentCode,
        ?????????: evaluationSheet.department,
      };

      questions &&
        questions.forEach((question) => {
          const questionNumber = question.sequence.toSequenceString();

          if (question.questionItemType === 'Matrix') {
            const matrixQuestionItems = question.answerItems as MatrixQuestionItems;
            matrixQuestionItems.rowItems &&
              matrixQuestionItems.rowItems.forEach((m, i) => {
                matrixQuestionItems.columnItems &&
                  matrixQuestionItems.columnItems.forEach((f) => {
                    if (f.number === answerMap.get(questionNumber + '-' + m.number)) {
                      return (wb[m.value] = f.value || '');
                    } else {
                      return null;
                    }
                  });
              });
          } else {
            wb[question.sequence.number + '??? ?????? ' + question.sentence] = answerMap.get(questionNumber) || '';
          }
        });
      wbList.push(wb);
    });

  const surveyExcel = XLSX.utils.json_to_sheet(wbList);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, surveyExcel, '????????????');

  const date = dayjs(new Date()).format('YYYY-MM-DD:HH:mm:ss');
  const fileName = `${getPolyglotToAnyString(name)}(${surveyForm.title}).${date}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}

function getChoiceFixedItemNumberText(itemNumber: string) {
  switch (itemNumber) {
    case '1':
      return '?????? ?????????';
    case '2':
      return '?????????';
    case '3':
      return '????????????';
    case '4':
      return '?????????';
    case '5':
      return '?????? ?????????';
    default:
      return '';
  }
}
