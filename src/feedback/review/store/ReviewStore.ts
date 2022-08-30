import { createStore } from 'shared/store';
import { ReviewListViewModel } from '../viewmodel/ReviewViewModel';

export const [setReviewListViewModel, onReviewListViewModel, getReviewListViewModel, useReviewListViewModel] =
  createStore<ReviewListViewModel>();

export const [setReviewListPage, onReviewListPage, getReviewListPage, useReviewListPage] = createStore<number>(1);
export const initReviewListLimit = 20;
export const [setReviewListLimit, onReviewListLimit, getReviewListLimit, useReviewListLimit] =
  createStore<number>(initReviewListLimit);

export const [setSurveyCaseId, onSurveyCaseId, getSurveyCaseId, useSurveyCaseId] = createStore<string>();
