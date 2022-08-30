import { reactAlert, reactConfirm } from '@nara.platform/accent';
import { registerDisplayReviewAnswer, removeDisplayReviewAnswer } from '../api/reviewApi';
import { requestReview } from '../service/requestReview';
import { setReviewListPage, setReviewListViewModel, setSurveyCaseId } from '../store/ReviewStore';

export function clearReview() {
  setReviewListViewModel({ totalCount: 0, results: [] });
  setSurveyCaseId('');
  setReviewListPage(1);
}

export async function onChangeRegisterDisplay(evaluationSheetId: string) {
  reactConfirm({
    title: 'Review 등록 안내',
    message: '해당 내용을 Review로 노출하시겠습니까?',
    onOk: async () => {
      const reviewAnswerId = await registerDisplayReviewAnswer(evaluationSheetId);
      requestReview();
    },
  });
}
export async function onChangeRemoveDisplay(reviewAnswerId: string) {
  await removeDisplayReviewAnswer(reviewAnswerId);
  requestReview();
  reactAlert({
    title: 'Review 등록 안내',
    message: 'Review가 미노출 처리되었습니다.',
  });
}
