import { PatronKey, CreatorModel, PolyglotModel } from 'shared/model';
import { LangSupport, DEFAULT_LANGUAGE } from 'shared/components/Polyglot';

export class CollegeChannelRom {
  //
  id: string = '';
  patronKey: PatronKey = new PatronKey();
  name: PolyglotModel = new PolyglotModel();
  description: PolyglotModel = new PolyglotModel();
  panoptoFolderId: string = '';
  creator: CreatorModel = new CreatorModel();

  displayOrder: number = 0;
  registeredTime: number = 0;
  enabled: number = 0;

  // channels: Channel = new Channel();

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  constructor(collegeChannelRom?: CollegeChannelRom) {
    if (collegeChannelRom) {
      //
      const name = new PolyglotModel(collegeChannelRom.name);
      const description = new PolyglotModel(collegeChannelRom.description);

      Object.assign(this, { ...collegeChannelRom, name, description });
    }
  }
}
