export enum AppliedResult {
  // UI측 데이터 유효성 체크시 사용.
  NoEmailInput = 'e-mail 주소 미입력', //Email 필수칼럼이 미입력인 데이터(처리 대상에서 제외함.)
  NotEmailAddressFormat = 'e-mail 주소 형식 아님.', //이메일 주소 형식이 아님.(처리 대상에서 제외함.)
  NoLectureInput = 'Lecture명 미입력', //Lecture 필수칼럼이 미입력인 데이터(처리 대상에서 제외함.)
  NoLearningCompleted = '학습완료 상태 아님.', //Percent Completed 칼럼이 100%가 아닌 데이터(처리 대상에서 제외함.)
  NoCompleteTimeInput = '학습완료 시간 미입력', //Completed (PST/PDT) 필수칼럼 미입력(처리 대상에서 제외함.)

  //Back-End 유효성 체크시 사용.
  Blank = '-', //학습완료 처리 전
  NoLearners = '학습자 없음', //시스템에 해당 사용자 없음
  NoLearningCard = '학습카드 없음', //시스템에 해당 Lecture Card가 없음.
  TestExists = 'Test 존재', //해당 Lecture에 Test 존재로 학습완료처리 불가
  AlreadyBeenProcessed = '기존 완료처리 건', //이미 학습완료 처리된 건
  DuplicationCardName = '중복된 과정명 존재', //중복된 과정명 존재
  ProcessingSuccess = '완료처리 성공', //학습완료 처리 성공
}
