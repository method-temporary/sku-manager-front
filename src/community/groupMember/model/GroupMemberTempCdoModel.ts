export class GroupMemberTempCdoModel {
  //
  name: string = ''; //성명
  email: string = ''; //e-mail
  cardName: string = ''; //강의명(학습카드명)
  completedTime: number = 0; //학습완료시간
  result: string = 'Fail'; //학습처리상태(Fail, Success)

  company: string = ''; //소속사
  team: string = ''; //소속 조직(팀)
  nickName: string = ''; //닉네임

  groupMemberId: string = ''; //groupMemberId
}
