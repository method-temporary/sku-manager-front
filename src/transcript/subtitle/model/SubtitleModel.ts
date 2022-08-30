import { decorate, observable } from 'mobx';
import { PatronKey, DomainEntity } from '@nara.platform/accent';
import { NameValueList } from 'shared/model';

export class SubtitleModel implements DomainEntity {
  id: string = '';
  entityVersion: number = 0;

  deliveryId: string = '';
  locale: string = '';
  url: string = '';
  fileName: string = '';
  fileSize: string = '';
  creatorId: string = '';
  createdTime: number = 0;
  modifierId: string = '';
  modifiedTime: number = 0;

  patronKey: PatronKey = {} as PatronKey;

  constructor(subtitleModel?: SubtitleModel) {
    //
    if (subtitleModel) {
      Object.assign(this, { ...subtitleModel });
    }
  }

  static getNameValueList(subtitleModel: SubtitleModel) {
    const nameValues = [];
    nameValues.push({ name: 'deliveryId', value: subtitleModel.deliveryId });
    nameValues.push({ name: 'locale', value: subtitleModel.locale });
    nameValues.push({ name: 'url', value: subtitleModel.url });
    nameValues.push({ name: 'fileName', value: subtitleModel.fileName });
    nameValues.push({ name: 'fileSize', value: subtitleModel.fileSize });
    nameValues.push({ name: 'creatorId', value: subtitleModel.creatorId });
    nameValues.push({ name: 'createdTime', value: subtitleModel.createdTime });
    nameValues.push({ name: 'modifierId', value: subtitleModel.modifierId });
    nameValues.push({ name: 'modifiedTime', value: subtitleModel.modifiedTime });
    return { nameValues } as NameValueList;
  }

  static asSubtitleCdo(subtitleModel: SubtitleModel): SubtitleModel {
    return subtitleModel;
  }
}

decorate(SubtitleModel, {
  deliveryId: observable,
  locale: observable,
  url: observable,
  fileName: observable,
  fileSize: observable,
  creatorId: observable,
  createdTime: observable,
  modifierId: observable,
  modifiedTime: observable,
});
