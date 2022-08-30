import { SelectTypeModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CollegeService } from '../../index';

export function getCollegeOptions(cineroomId: string, collegeService: CollegeService): SelectTypeModel[] {
  //
  const { collegesForCurrentCineroom, collegesSelect } = collegeService;
  const collegeSelect: SelectTypeModel[] = [];

  if (cineroomId === 'ne1-m2-c2' || cineroomId === 'ALL') {
    return collegesSelect;
  }

  collegesForCurrentCineroom &&
    collegesForCurrentCineroom.forEach((college) => {
      collegeSelect.push(new SelectTypeModel(college.id, getPolyglotToAnyString(college.name), college.id));
    });

  return collegeSelect;
}

export function getFamilyCollegeSelect(cineroomId: string, collegeService: CollegeService): SelectTypeModel[] {
  //
  const { familyCollegesForCurrentCineroom, collegesSelect } = collegeService;
  const collegeSelect: SelectTypeModel[] = [];

  if (cineroomId === 'ne1-m2-c2' || cineroomId === 'ALL') {
    return collegesSelect;
  }

  familyCollegesForCurrentCineroom &&
    familyCollegesForCurrentCineroom.forEach((college) => {
      collegeSelect.push(new SelectTypeModel(college.id, getPolyglotToAnyString(college.name), college.id));
    });

  return collegeSelect;
}
