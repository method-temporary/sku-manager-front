import { decorate, observable } from 'mobx';

import { PatronKey, DomainEntity } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';

import { NameValueList } from 'shared/model';

import { TranscriptCdoModel } from './TranscriptCdoModel';
import { UserService } from '../../../user';
import { TranscriptState } from './TranscriptState';

export class TranscriptModel implements DomainEntity {
  id: string = '';
  entityVersion: number = 0;

  deliveryId: string = '';
  locale: string = '';
  idx: string = '';
  text: string = '';

  creatorId: string = '';
  createdTime: number = 0;
  modifierId: string = '';
  modifiedTime: number = 0;

  transcripts: TranscriptModel[] = [];

  patronKey: PatronKey = {} as PatronKey;

  number: number = 0;

  state: TranscriptState = TranscriptState.Pass;

  startTime: string = '';
  endTime: string = '';

  constructor(transcriptModel?: TranscriptModel) {
    //
    if (transcriptModel) {
      Object.assign(this, { ...transcriptModel });
    }
  }

  static getNameValueList(transcriptModel: TranscriptModel) {
    const nameValues = [];
    nameValues.push({ name: 'deliveryId', value: transcriptModel.deliveryId });
    nameValues.push({ name: 'locale', value: transcriptModel.locale });
    nameValues.push({ name: 'idx', value: transcriptModel.idx });
    nameValues.push({ name: 'text', value: transcriptModel.text });
    nameValues.push({ name: 'creatorId', value: transcriptModel.creatorId });
    nameValues.push({ name: 'createdTime', value: transcriptModel.createdTime });
    nameValues.push({ name: 'modifierId', value: transcriptModel.modifierId });
    nameValues.push({ name: 'modifiedTime', value: transcriptModel.modifiedTime });
    nameValues.push({ name: 'state', value: transcriptModel.state });

    return { nameValues } as NameValueList;
  }

  static asTranscriptCdo(transcriptModel: TranscriptModel): TranscriptCdoModel {
    return {
      id: transcriptModel.id || '',
      audienceKey: '',
      deliveryId: transcriptModel.deliveryId,
      locale: transcriptModel.locale || '',
      // transcriptModel.locale || userService.instance.skProfile.memberLocale.languages.defaultLanguage || '', TODO memberLocale
      idx: parseInt(transcriptModel.idx),
      text: transcriptModel.text,
      creatorId: UserService.instance.user.email || patronInfo.getPatronEmail() || '',
      state: transcriptModel.state || TranscriptState.Pass,
      startTime: transcriptModel.startTime,
      endTime: transcriptModel.endTime,
    };
  }
}

decorate(TranscriptModel, {
  deliveryId: observable,
  locale: observable,
  idx: observable,
  text: observable,
  creatorId: observable,
  createdTime: observable,
  modifierId: observable,
  modifiedTime: observable,
  startTime: observable,
  endTime: observable,
});
