class CollegeDisplayOrderUdo {
  //
  collegeDisplayOrders: CollegeDisplayOrder[] = [];

  constructor(udo?: CollegeDisplayOrderUdo) {
    if (udo) {
      Object.assign(this, { ...udo });
    }
  }
}

class CollegeDisplayOrder {
  //
  collegeId: string = '';
  displayOrder: number = 0;

  constructor(id: string, displayOrder?: number) {
    this.collegeId = id;
    this.displayOrder = displayOrder || 0;
  }
}

export { CollegeDisplayOrder, CollegeDisplayOrderUdo };
export default CollegeDisplayOrderUdo;
