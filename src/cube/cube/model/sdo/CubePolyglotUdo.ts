import { PolyglotModel } from 'shared/model';
import { LangSupport } from 'shared/components/Polyglot';

import { Descriptions } from '../vo/Descriptions';

export default class CubePolyglotUdo {
  //
  cubeId: string = '';

  langSupports: LangSupport[] = [];
  name: PolyglotModel = new PolyglotModel();
  tags: PolyglotModel = new PolyglotModel();

  description: Descriptions = new Descriptions();
  reportName: PolyglotModel = new PolyglotModel();
  reportQuestion: PolyglotModel = new PolyglotModel();
}
