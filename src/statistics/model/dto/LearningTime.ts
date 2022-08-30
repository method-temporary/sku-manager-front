export default class LearningTime {
  //
  membership200: number = 0;
  membership20: number = 0;
  membershipNa: number = 0;

  constructor(learningTime?: LearningTime) {
    if (learningTime) {
      Object.assign(this, { ...learningTime });
    }
  }
}
