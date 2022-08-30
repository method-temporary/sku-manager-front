export enum SortFilterState {
  //
  StudentCountDesc = 'StudentCountDesc', // 학습자 많은 순
  StudentCountAsc = 'StudentCountAsc', // 학습자 적은 순
  PassedStudentCountDesc = 'PassedStudentCountDesc', // 이수자 많은 순
  PassedStudentCountAsc = 'PassedStudentCountAsc', // 이수자 적은순
  StarCountDesc = 'StarCountDesc', // 별점 높은 순
  StarCountAsc = 'StarCountAsc', // 별점 낮은 순
  CollegeOrder = 'CollegeOrder', // 모르겠음

  // card
  TimeDesc = 'TimeDesc', // 최신 등록순
  TimeAsc = 'TimeAsc', // 오래된 등록순

  // UserGroup, UserGroupCategory
  RegisteredTimeDesc = 'RegisteredTimeDesc',
  RegisteredTimeAsc = 'RegisteredTimeAsc',

  // Manage Results
  ModifiedTimeDesc = 'ModifiedTimeDesc',
  ModifiedTimeAsc = 'ModifiedTimeAsc',

  // 임시
  CreationTimeDesc = 'CreationTimeDesc',
  CreationTimeAsc = 'CreationTimeAsc',
}
