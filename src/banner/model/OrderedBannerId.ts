export default class OrderedBannerId {
  bannerId: string = '';
  displayOrder: number = 0;

  constructor(orderedBannerId?: OrderedBannerId) {
    if(orderedBannerId) {
      Object.assign(this, {...orderedBannerId})
    }
  }
}
