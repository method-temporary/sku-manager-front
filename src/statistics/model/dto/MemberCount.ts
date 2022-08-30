export class MemberCount {
  //
  membership200: number = 0;
  membership20: number = 0;
  membershipNa: number = 0;

  constructor(memberCount?: MemberCount) {
    if (memberCount) {
      Object.assign(this, { ...memberCount });
    }
  }
}
