import { action, observable, runInAction } from 'mobx';
import { TranscriptModel } from '../../model/TranscriptModel';
import { TranscriptUdoModel } from '../../model/TranscriptUdoModel';
import { TranscriptCdoModel } from '../../model/TranscriptCdoModel';
import { OffsetElementList } from '@nara.platform/accent';
import autobind from 'autobind-decorator';
import TranscriptApi from '../apliclient/TranscriptApi';
import _ from 'lodash';
import { TranscriptState } from '../../model/TranscriptState';

@autobind
export default class TranscriptService {
  //
  static instance: TranscriptService;

  transcriptApi: TranscriptApi;

  @observable
  transcript: TranscriptModel = new TranscriptModel();

  @observable
  transcriptModelList: TranscriptModel[] = []; //화면에 보이는 대본 리스트

  @observable
  transcriptPostList: TranscriptModel[] = []; //실제 전송에 보내는 리스트

  @observable
  transcriptTotalCount: number = 0;

  @observable
  transcripts: OffsetElementList<TranscriptModel> = {
    results: [],
    totalCount: 0,
  } as OffsetElementList<TranscriptModel>;

  @observable
  transcriptCount: number = 0;

  @observable
  deliveryIdSet: string = '';

  @observable
  languageSet: string = 'ko';


  @observable
  transcriptModalOpen: boolean = false;

  constructor(transcriptApi: TranscriptApi) {
    //
    this.transcriptApi = transcriptApi;
  }

  toHHMM(idx: string): string {
    //
    const time = parseInt(idx);
    const hours = Math.floor(time / 60);
    const minutes = Math.floor(time - hours * 60);

    let sHours = '';
    let sMinutes = '';
    sHours = String(hours.toString()).padStart(2, '0');
    sMinutes = String(minutes.toString()).padStart(2, '0');

    return sHours + ':' + sMinutes;
  }

  @action
  async findAllTranscripts(deliveryId: string, locale: string, page?: number) {
    //
    const transcriptModels = await this.transcriptApi.findAllTranscript(
      deliveryId,
      locale
    );

    this.deliveryIdSet = deliveryId;
    this.languageSet = locale;

    if (transcriptModels.length == 0) {
      this.addTranscript();
      return null;
    }

    return runInAction(() =>
      transcriptModels
        .sort((a, b) => parseInt(a.idx) - parseInt(b.idx))
        .map((transcriptModel) => {
          transcriptModel.number = this.transcriptCount++;
          transcriptModel.idx = this.toHHMM(transcriptModel.idx);

          this.transcript.transcripts.push(
            new TranscriptModel(transcriptModel)
          );
          this.transcriptModelList = this.transcript.transcripts;
        })
    );
  }

  @action
  async findTranscriptList(deliveryId: string, locale: string, offset: number, limit: number) {
    //
    const transcriptList = await this.transcriptApi.findTranscriptList(
      deliveryId,
      locale,
      offset,
      limit
    );

    this.deliveryIdSet = deliveryId;
    this.languageSet = locale;

    runInAction(() => {
      this.transcriptTotalCount = transcriptList.totalCount;
      if (this.transcriptTotalCount === 0) {
        this.transcriptModelList = [];
        this.addTranscript();
      } else {
        transcriptList.results
          .map((transcriptModel) => {
            transcriptModel.number = this.transcriptCount++;
            transcriptModel.idx = this.toHHMM(transcriptModel.idx);

            // transcriptModelList -> 화면에서 실제로 보여질 Transcript List setting
            this.transcript.transcripts.push(
              new TranscriptModel(transcriptModel)
            );
            this.transcriptModelList = this.transcript.transcripts;
          });
      }
    })

    return runInAction(() => (this.transcripts = transcriptList));
  }

  @action
  async findTranscript(Id: string) {
    //
    const transcriptModel = await this.transcriptApi.findTranscript(Id);
    return runInAction(
      () => (this.transcript = new TranscriptModel(transcriptModel))
    );
  }

  @action
  addTranscript() {
    //
    const transcriptModel = new TranscriptModel();
    transcriptModel.number = this.transcriptCount++;
    transcriptModel.deliveryId = this.deliveryIdSet;
    transcriptModel.locale = this.languageSet;
    transcriptModel.state = TranscriptState.Add;

    const transcripts = [...this.transcript.transcripts, transcriptModel];

    this.transcript = _.set(this.transcript, 'transcripts', transcripts);
    this.transcriptModelList = this.transcript.transcripts;

    this.transcriptPostList.push(transcriptModel);
  }

  @action
  removeTranscript(index: number) {
    //
    this.transcript.transcripts[index] = _.set(
      this.transcript.transcripts[index],
      'state',
      TranscriptState.Delete
    );

    if (this.transcript.transcripts[index].id && this.transcriptPostList.length > 0) {
      if (this.transcriptPostList?.find(transcriptModel => transcriptModel.id === this.transcript.transcripts[index].id)) {
        this.transcriptPostList.map((transcriptModel) => {
          if (transcriptModel.id === this.transcript.transcripts[index].id) {
            transcriptModel.state = TranscriptState.Delete;
          }
        });
      } else {
        this.transcriptPostList.push(this.transcript.transcripts[index]);
      }
    } else {
      this.transcriptPostList.push(this.transcript.transcripts[index]);
    }

    const transcripts = this.transcript.transcripts
      .slice(0, index)
      .concat(this.transcript.transcripts.slice(index + 1));

    this.transcript = _.set(this.transcript, 'transcripts', transcripts);
    this.transcriptModelList = this.transcript.transcripts;


  }

  @action
  changeTranscript(index: number, prop: string, string: any) {
    this.transcript.transcripts[index] = _.set(
      this.transcript.transcripts[index],
      prop,
      string
    );

    if (this.transcript.transcripts[index].state == TranscriptState.Pass) {
      this.transcript.transcripts[index] = _.set(
        this.transcript.transcripts[index],
        'state',
        TranscriptState.Modify
      );

      this.transcriptPostList.push(this.transcript.transcripts[index]);
    }

  }

  @action
  changeLanguage(prop: string, language: any) {
    // this.transcript.transcripts.map((transcriptModel) => {
    //   if(transcriptModel.locale !== language){

    //   }
    //   // transcriptModel.push(TranscriptModel.asTranscriptCdo(transcriptModel));
    // });
    // this.transcriptPostList.push(this.transcript.transcripts[index]);
  }

  @action
  clear() {
    //
    this.transcript = new TranscriptModel();
    // this.transcriptModelList = [];
    this.transcriptPostList = [];
  }

  @action
  changeTotalCount(transcriptCount: number) {
    //
    this.transcriptCount = transcriptCount;
  }

  @action
  async registerTranscript() {
    const transcriptCdoModel: TranscriptCdoModel[] = [];

    // this.transcript.transcripts.map(transcriptModel => {
    //   transcriptCdoModel.push(TranscriptModel.asTranscriptCdo(transcriptModel));
    // })
    this.transcriptPostList.map((transcriptModel) => {
      // transcriptCdoModel.push(TranscriptModel.asTranscriptCdo(transcriptModel));
      if (!(!transcriptModel.id && transcriptModel.state === TranscriptState.Delete)) {
        transcriptCdoModel.push(TranscriptModel.asTranscriptCdo(transcriptModel));
      }
    });

    return this.transcriptApi.registerTranscript(transcriptCdoModel);
  }

  @action
  async srtUpload(panoptosesstionId: string, file: File, locale: string) {
    return this.transcriptApi.srtUpload(panoptosesstionId, file, locale);
  }

  @action
  changeTranscriptModalOpen(open: boolean) {
    //
    this.transcriptModalOpen = open;
  }

  @action
  setRelationCourseSet(transcriptModelList: TranscriptModel[]) {
    //
    this.transcriptModelList = transcriptModelList;
  }

  @action
  async removeTranscriptByDeliveryIdLocale(panoptosesstionId: string, locale: string) {
    return this.transcriptApi.removeTranscriptByDeliveryIdLocale(panoptosesstionId, locale);
  }
}

Object.defineProperty(TranscriptService, 'instance', {
  value: new TranscriptService(TranscriptApi.instance),
  writable: false,
  configurable: false,
});
