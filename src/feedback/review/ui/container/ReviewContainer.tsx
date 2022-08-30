import { useRequestReview } from 'feedback/review/hooks/useRequestReview';
import { useReviewNo } from 'feedback/review/hooks/useReviewNo';
import { useReviewPagination } from 'feedback/review/hooks/useReviewPagination';
import { useReviewListViewModel } from 'feedback/review/store/ReviewStore';
import React from 'react';
import { Pagination } from 'semantic-ui-react';
import { Loader, SubActions } from 'shared/components';
import { ReviewListView } from '../view/ReviewListView';

export function ReviewContainer() {
  useRequestReview();
  const reviewList = useReviewListViewModel();
  const reviewNo = useReviewNo() || 1;
  const [activePage, totalPages, onPageChange] = useReviewPagination();

  return (
    <>
      <SubActions>
        <SubActions.Left>
          <SubActions.Count text="개 Review" number={reviewList?.totalCount || 0} />
        </SubActions.Left>
      </SubActions>
      <Loader>
        <ReviewListView reviewNo={reviewNo} reviewList={reviewList} />
      </Loader>
      <div className="center">
        <Pagination activePage={activePage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </>
  );
}
