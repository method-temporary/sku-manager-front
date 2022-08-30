import { action, toJS } from 'mobx';
import _ from 'lodash';

export class PolyglotModel {
  //
  [key: string]: string | Function;

  en: string = '';
  ko: string = '';
  zh: string = '';

  constructor(polyglotModel?: PolyglotModel) {
    //
    if (polyglotModel) {
      polyglotModel = toJS(polyglotModel);

      Object.assign(this, { ...polyglotModel });
    }
  }

  @action
  getValue(key: string): string {
    //

    if (key === 'Korean') key = 'ko';
    else if (key === 'English') key = 'en';
    else if (key === 'Chinese') key = 'zh';

    if (typeof this[key] === 'string') {
      return this[key] as string;
    }

    return '';
  }

  @action
  setValue(key: string, value: any) {
    //
    if (key === 'Korean') key = 'ko';
    else if (key === 'English') key = 'en';
    else if (key === 'Chinese') key = 'zh';

    _.set(this, key, value);
  }

  @action
  init() {
    //
    Object.assign(this, { ...new PolyglotModel() });
  }

  @action
  static stringToModel(value: string) {
    //
    let polyglotModel;

    if (value === '') {
      polyglotModel = new PolyglotModel();
    } else {
      polyglotModel = new PolyglotModel({ ...JSON.parse(value) });
    }

    return polyglotModel;
  }

  @action
  static compareModel(first: PolyglotModel, second: PolyglotModel): string {
    if (!first || !second) {
      return '';
    }

    if (first.ko != '' && second.ko != '' && first.ko === second.ko) {
      return 'ko';
    }

    if (first.en != '' && second.en != '' && first.en === second.en) {
      return 'en';
    }

    if (first.zh != '' && second.zh != '' && first.zh === second.zh) {
      return 'zh';
    }

    return '';
  }
}
