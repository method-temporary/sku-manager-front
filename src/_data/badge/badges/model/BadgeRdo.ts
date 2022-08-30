class BadgeRdo {
  //
  startDate: number = 0; // 등록일자
  endDate: number = 0; // 등록일자
  cineroomId: string = ''; // 사용처
  categoryId: string = ''; // Main 분야 Id
  type: string = ''; // 유형
  level: string = ''; // Level
  issueAutomatically?: boolean = undefined; // 발급 구분
  additionalRequirementsNeeded?: boolean = undefined; // 추가 발급 조건
  name: string = ''; // Badge 명
  registrantName: string = ''; // 생성자명
  state: string = '';
  searchable: string = ''; // 공개 여부

  groupSequences: number[] = [];
  displayCategory?: boolean = undefined;

  limit: number = 20;
  offset: number = 0;
}

export default BadgeRdo;
