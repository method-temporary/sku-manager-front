import { decorate, observable } from 'mobx';

import { DramaEntity } from '@nara.platform/accent';

import { PolyglotModel, PatronKey } from 'shared/model';
import { LangSupport, DEFAULT_LANGUAGE } from 'shared/components/Polyglot';

import { CreatorModel } from '../../cube/term/model/CreatorModel';
import { ChannelModel } from '../../cube/board/board/model/ChannelModel';

import { CollegeType } from './CollegeType';

export class CollegeModel implements DramaEntity {
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = new PatronKey();

  // collegeId: string = '';
  collegeType: CollegeType = CollegeType.University;
  name: PolyglotModel = new PolyglotModel();
  description: string = '';
  iconFileBoxId: string = '';
  panoptoFolderId: string = '';
  channels: ChannelModel[] = [];
  creator: CreatorModel = new CreatorModel();
  // openState: string = '';
  time: number = 0;

  displayOrder: number = 0;
  opened: boolean = false;
  enabled: boolean = false;

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  constructor(college?: CollegeModel) {
    //
    if (college) {
      const creator = (college.creator && new CreatorModel(college.creator)) || this.creator;
      const channels = college.channels?.map((channel) => new ChannelModel(channel));
      const name = new PolyglotModel(college.name);
      Object.assign(this, { ...college, creator, name, channels });
    }
  }
}

decorate(CollegeModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,

  // collegeId: observable,
  collegeType: observable,
  name: observable,
  description: observable,
  iconFileBoxId: observable,
  panoptoFolderId: observable,
  channels: observable,
  creator: observable,

  displayOrder: observable,
  opened: observable,
  enabled: observable,

  langSupports: observable,
});
