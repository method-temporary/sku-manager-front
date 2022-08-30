import SelectTypeModel from '../model/SelectTypeModel';

export function addSelectTypeBoxAllOption(selectType: any[] = [], option = {}) {
  const allSelectTypeOption: SelectTypeModel = Object.assign(new SelectTypeModel('All', '전체', ''), option);
  return [allSelectTypeOption, ...selectType];
}

export default {
  addSelectTypeBoxAllOption,
};
