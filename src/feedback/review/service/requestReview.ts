import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { AnswerItemType } from 'survey/answer/model/AnswerItemType';
import AnswerSheetModel from 'survey/answer/model/AnswerSheetModel';
import { findCompleteAnswerSheets, findReviewAnswersBySurveyCaseId, findUsersByDenizenIds } from '../api/reviewApi';
import {
  getReviewListLimit,
  getReviewListPage,
  getSurveyCaseId,
  initReviewListLimit,
  setReviewListViewModel,
} from '../store/ReviewStore';
import { ReviewViewModel } from '../viewmodel/ReviewViewModel';
import { LoaderService } from '../../../shared/components/Loader';

export async function requestReview() {
  //
  const { openLoader, closeLoader } = LoaderService.instance;
  openLoader(true);

  const surveyCaseId = getSurveyCaseId();
  if (surveyCaseId !== undefined) {
    const page = getReviewListPage() || 1;
    const limit = getReviewListLimit() || initReviewListLimit;
    const offset = (page - 1) * limit;

    const answerSheets = await findCompleteAnswerSheets(surveyCaseId, offset, limit);
    if (answerSheets === undefined) {
      closeLoader(true);
      return;
    }

    const reviewAnswers = await findReviewAnswersBySurveyCaseId(surveyCaseId);
    const users = answerSheets.results.map((answerSheet: AnswerSheetModel) => {
      return answerSheet.patronKey.keyString;
    });
    const userInfos = await findUsersByDenizenIds(users);
    if (userInfos === undefined) {
      closeLoader(true);
      return;
    }

    const reviewViewModels = answerSheets.results.map((answerSheet: AnswerSheetModel) => {
      const user = userInfos.find((user) => user.id === answerSheet.patronKey.keyString);
      const reviewAnswer = reviewAnswers?.find((review) => review.denizenId === user?.id);

      const review: ReviewViewModel = {
        userId: user?.id || '',
        companyName: (user && getPolyglotToAnyString(user.companyName)) || '',
        departmentName: (user && getPolyglotToAnyString(user.departmentName)) || '',
        name: (user && getPolyglotToAnyString(user.name)) || '',
        email: user?.email || '',
        evaluationId: answerSheet.evaluationSheet.id || '',
        reviewAnswerId: reviewAnswer?.id,
        review:
          answerSheet.evaluationSheet.answers.length > 0 &&
          answerSheet.evaluationSheet.answers[0].answerItemType === AnswerItemType.Review
            ? answerSheet.evaluationSheet.answers[0].answerItem.sentence
            : '',
        display: reviewAnswer?.id !== undefined,
      };

      return review;
    });

    //const newReviewViewModels = reviewViewModels.filter((result) => result.userId !== '' && result.evaluationId !== '');
    setReviewListViewModel({ totalCount: answerSheets.totalCount, results: reviewViewModels });
  }

  closeLoader(true);
}
