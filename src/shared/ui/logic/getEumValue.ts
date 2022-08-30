export enum CubeStateView {
  Created = '임시저장',
  OpenApproval = '승인요청',
  Opened = '승인',
  Closed = '폐강',
  Rejected = '반려',
}

export enum UserCubeStateView {
  Created = '임시저장',
  OpenApproval = '승인요청',
  Opened = '승인',
  Closed = '폐강',
  Rejected = '반려',
}

export enum CubeTypeView {
  ClassRoomLecture = 'Classroom',
  ELearning = 'E-learning',
  Video = 'Video',
  Audio = 'Audio',
  Community = 'Task',
  WebPage = 'Web Page',
  Documents = 'Documents',
  Experiential = 'Experiential',
  Cohort = 'Cohort',
  Task = 'Task',
  Discussion = 'Discussion',
}

export enum ArrangeStateView {
  Created = '임시저장',
  Opened = '게시중',
  Reservation = '예약게시',
  Closed = '게시종료',
}

export enum ArrangeTypeView {
  RQD = '권장과정',
  NEW = '신규과정',
  POP = '인기과정',
}

export enum BadgeStateView {
  Created = '임시저장',
  OpenApproval = '승인대기',
  Opened = '승인',
  Closed = '종료',
  Rejected = '반려',
}

export enum BadgeIssueStateView {
  None = '-',
  Requested = '발급요청',
  RequestCanceled = '발급요청취소',
  RequestRejected = '발급요청반려',
  Issued = '획득완료',
  Canceled = '발급취소',
  ChallengeCancel = '도전취소',
}

export enum BannerStateView {
  Created = '임시저장',
  Waiting = '예약게시',
  Opened = '게시중',
}

export enum BadgeDesignAdminTypeView {
  College = 'College',
  Subsidiary = '관계사',
}

export enum AplStateView {
  Created = ' ',
  OpenApproval = '승인요청',
  Opened = '승인완료',
  Rejected = '반려',
}

export enum AplTypeView {
  Etc = '기타-직접입력',
}

type StringDict = { [key: string]: string };

const EnumUtil = {
  getEnumValue(dict: StringDict, targetKey: string) {
    const result: Map<string, string> = new Map<string, string>();
    Object.keys(dict)?.forEach((key) => {
      if (key === targetKey) result.set(key, dict[key]);
    });

    return result;
  },
};

export default EnumUtil;
