import { decorate, observable } from 'mobx';

import { DomainEntity } from '@nara.platform/accent';

import { IdName, PatronKey } from 'shared/model';

export class CollegeModel implements DomainEntity {
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;
  // collegeId: string = '';
  collegeType: string = '';
  name: string = '';
  description: string = '';
  iconFileBoxId: string = '';
  panoptoFolderId: string = '';
  channels: IdName = new IdName();
  displayOrder: number = 0;
  registeredTime: number = 0;
  useFlag: boolean = false;

  constructor(channel?: CollegeModel) {
    if (channel) {
      Object.assign(this, { ...channel });
    }
  }
}

decorate(CollegeModel, {
  id: observable,
  entityVersion: observable,
  // collegeId: observable,
  collegeType: observable,
  name: observable,
  description: observable,
  iconFileBoxId: observable,
  panoptoFolderId: observable,
  displayOrder: observable,
  registeredTime: observable,
  useFlag: observable,
});
