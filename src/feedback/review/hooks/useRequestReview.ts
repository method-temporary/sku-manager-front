import { useEffect } from 'react';
import { requestReview } from '../service/requestReview';
import { useReviewListPage, useSurveyCaseId } from '../store/ReviewStore';
import { LoaderService } from '../../../shared/components/Loader';

export function useRequestReview() {
  //
  const page = useReviewListPage();
  const surveyCaseId = useSurveyCaseId();

  useEffect(() => {
    if (surveyCaseId !== undefined) {
      requestReview();
    }
  }, [surveyCaseId, page]);
}
