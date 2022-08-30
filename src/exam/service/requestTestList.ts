import moment from 'moment';
import { encodingUrlBrackets } from 'shared/helper';

import { searchExamPapers } from 'exam/api/examApi';
import { ExamPaperAdminRdo } from 'exam/model/sdo/ExamPaperAdminRdo';
import { setTestListViewModel } from 'exam/store/TestListStore';
import { getTestSearchBoxViewModel } from 'exam/store/TestSearchBoxStore';
import { TestListItem } from 'exam/viewmodel/TestListViewModel';
import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';

export async function requestTestList(offset: number, limit: number) {
  const testSearchBox = getTestSearchBoxViewModel();
  if (testSearchBox === undefined) {
    return;
  }

  const examPaperAdminRdo: ExamPaperAdminRdo = {
    title: testSearchBox.keywordType === 'title' ? encodingUrlBrackets(testSearchBox.keyword) : '',
    authorName: testSearchBox.keywordType === 'authorName' ? testSearchBox.keyword : '',
    finalCopy: parseFinalCopy(testSearchBox.versionState),
    questionSelectionType: testSearchBox.questionSelectionType,
    startDate: testSearchBox.startDate.setHours(0, 0, 0),
    endDate: testSearchBox.endDate.setHours(23, 59, 59),
    offset,
    limit,
  };

  const examPapers = await searchExamPapers(examPaperAdminRdo);
  if (examPapers !== undefined && examPapers.results !== undefined) {
    const testList: TestListItem[] = examPapers.results.map((result) => {
      return {
        id: result.id,
        title: result.title,
        language: result.language,
        isFinalVersion: result.finalCopy,
        questionSelectionTypeText: QuestionSelectionTypeText[result.questionSelectionType],
        creatorName: result.authorName,
        patronKey: { keyString: result?.patronKey.keyString },
        createDate: moment(result.time).format('YYYY.MM.DD'),
      };
    });

    setTestListViewModel({
      totalCount: examPapers.totalCount,
      testList,
    });
  }
}

function parseFinalCopy(versionState: string): boolean | undefined {
  if (versionState === 'finalVersion') {
    return true;
  } else if (versionState === 'editableVersion') {
    return false;
  }

  return undefined;
}
