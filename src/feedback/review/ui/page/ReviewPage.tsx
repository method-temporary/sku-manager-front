import { clearReview } from 'feedback/review/event/reviewEvent';
import { setSurveyCaseId } from 'feedback/review/store/ReviewStore';
import React, { useEffect } from 'react';
import { ReviewContainer } from '../container/ReviewContainer';

interface ReviewProps {
  surveyCaseId: string;
}

export function ReviewPage({ surveyCaseId }: ReviewProps) {
  useEffect(() => {
    clearReview();
  }, []);
  useEffect(() => {
    setSurveyCaseId(surveyCaseId);
  }, [surveyCaseId]);
  return (
    <>
      <ReviewContainer />
    </>
  );
}
