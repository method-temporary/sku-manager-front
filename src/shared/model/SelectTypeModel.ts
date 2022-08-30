export default class SelectTypeModel {
  //
  key: string;
  text: string;
  value: string | number | boolean | undefined;

  constructor(key: string = '0', text: string = '전체', value: string | number | boolean | undefined = '') {
    //
    this.key = key;
    this.text = text;
    this.value = value;
  }
}
