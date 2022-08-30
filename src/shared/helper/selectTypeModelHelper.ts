import SelectTypeModel from '../model/SelectTypeModel';

export function castToSelectTypeModel(selectType: { key: string; text: string; value: string }[], all: boolean = true) {
  //
  const options: SelectTypeModel[] = [];

  all && options.push(new SelectTypeModel());

  selectType?.forEach(({ key, text, value }) => {
    options.push(new SelectTypeModel(key, text, value));
  });

  return options;
}
