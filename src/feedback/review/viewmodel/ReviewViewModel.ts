export interface ReviewViewModel {
  userId: string;
  companyName: string;
  departmentName: string;
  name: string;
  email: string;
  evaluationId: string;
  reviewAnswerId?: string;
  review?: string;
  display: boolean;
}

export interface ReviewListViewModel {
  results: ReviewViewModel[];
  totalCount: number;
}
