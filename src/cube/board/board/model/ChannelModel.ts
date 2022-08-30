import { decorate, observable } from 'mobx';

import { DomainEntity, NameValueList } from '@nara.platform/accent';

import { PatronKey, PolyglotModel } from 'shared/model';

export class ChannelModel implements DomainEntity {
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;
  // channelId: string = '';
  name: PolyglotModel = new PolyglotModel();
  iconFileBoxId: string = '';
  description: string = '';
  displayOrder: number = 0;
  registeredTime: number = 0;
  useFlag: boolean = false;

  children: ChannelModel[] = [];
  parentId: string | null = null;

  constructor(channel?: ChannelModel) {
    if (channel) {
      const name = new PolyglotModel(channel.name);
      const children = (channel.children && channel.children.length > 0 && [...channel.children]) || [];
      Object.assign(this, { ...channel, name, children });
    }
  }

  static asNameValueList(channel: any): NameValueList {
    //
    return {
      nameValues: [
        {
          name: 'name',
          value: channel.name,
        },
        {
          name: 'description',
          value: channel.description,
        },
      ],
    };
  }
}

decorate(ChannelModel, {
  id: observable,
  entityVersion: observable,
  // channelId: observable,
  name: observable,
  iconFileBoxId: observable,
  description: observable,
  displayOrder: observable,
  registeredTime: observable,
  useFlag: observable,
  children: observable,
  parentId: observable,
});
