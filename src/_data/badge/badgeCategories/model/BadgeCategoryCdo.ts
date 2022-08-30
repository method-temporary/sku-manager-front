import { PolyglotModel } from 'shared/model';
import { LangSupport } from 'shared/components/Polyglot';

export class BadgeCategoryCdo {
  //
  name: PolyglotModel = new PolyglotModel();
  iconPath: string = '';
  backgroundImagePath: string = '';
  topImagePath: string = '';
  themeColor: string = '';

  langSupports: LangSupport[] = [];
}
