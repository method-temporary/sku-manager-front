import autobind from 'autobind-decorator';
import { action, computed, observable, runInAction } from 'mobx';
import GroupMemberTempProcApi from '../api/GroupMemberTempProcApi';
import { GroupMemberTempCdoModel } from '../model/GroupMemberTempCdoModel';
import { GroupMemberTempModel } from '../model/GroupMemberTempModel';

@autobind
export default class GroupMemberTempProcService {
  //
  static instance: GroupMemberTempProcService;
  groupMemberTempProcApi: GroupMemberTempProcApi;

  @observable
  _fileName: string = '';

  /**
   * 학습완료 처리 실행여부(false - 학습완료 처리 실행전, true - 실행후)
   */
  @observable
  _isProcessed: boolean = false;

  /**
   * 엑셀 파일 불러오기 총 데이터 건수
   */
  @observable
  _excelDataRowCount: number = 0;

  _groupMemberTempCboList: GroupMemberTempCdoModel[] = [];

  /**
   * 학습완료 처리후 반환된 결과 목록
   */
  @observable
  _groupMemberTempModelList: GroupMemberTempModel[] = [];

  /**
   * 학습완료 처리할 데이터 건수
   * 학습완료이면서 이메일, 강좌명, 학습완료시간이 존재해야만 처리대상에 포함됨.
   */
  @observable
  _procTargetTotalListCount: number = 0;

  constructor(groupMemberTempProcApi: GroupMemberTempProcApi) {
    this.groupMemberTempProcApi = groupMemberTempProcApi;
  }

  @action
  changeFileName(fileName: string) {
    this._fileName = fileName;
  }

  @action
  setIsProcessed(isProcessed: boolean) {
    this._isProcessed = isProcessed;
  }

  @action
  setExcelDataRowCount(excelDataRowCount: number) {
    this._excelDataRowCount = excelDataRowCount;
  }

  @action
  setGroupMemberTempUdoList(groupMemberTempProcCboList: GroupMemberTempCdoModel[]) {
    this._groupMemberTempCboList = groupMemberTempProcCboList;
    this._procTargetTotalListCount = this._groupMemberTempCboList.length;
  }

  getGroupMemberTempUdoList() {
    return this._groupMemberTempCboList;
  }

  /**
   * 학습완료 처리 하기
   * @param groupMemberTempCboList
   */
  @action
  async registerGroupMemberTempComplete(
    communityId: string,
    groupMemberTempCboList: GroupMemberTempCdoModel[]
  ): Promise<GroupMemberTempModel[]> {
    //
    this._groupMemberTempModelList = [];
    const groupMemberTempProcList = await this.groupMemberTempProcApi.registerGroupMemberTempComplete(
      communityId,
      groupMemberTempCboList
    );
    return runInAction(
      () =>
        (this._groupMemberTempModelList = groupMemberTempProcList.map(
          (groupMemberTempProc: GroupMemberTempModel) => new GroupMemberTempModel(groupMemberTempProc)
        ))
    );
  }

  /**
   * 엑셀 파일 불러오기시 기존 데이터 처리 표기 부분 초기화(그리드 포함)
   */
  @action
  clearDisplay() {
    //전체 엑셀 건수 표기 초기화
    this._excelDataRowCount = 0;

    //학습완료 처리 대상 건수 초기화
    this._procTargetTotalListCount = 0;

    //학습완료 처리 업데이트용 데이터 목록 초기화
    this._groupMemberTempCboList = [];

    //학습완료 처리후 결과 목록 초기화
    this._groupMemberTempModelList = [];
  }

  @computed
  get fileName() {
    return this._fileName;
  }

  /**
   * 학습완료 처리 실행여부(false - 학습완료 처리 실행전, true - 실행후) 가져오기
   */
  @computed
  get isProcessed() {
    return this._isProcessed;
  }

  /**
   * 엑셀내 전체 데이터 건수(오류포함) 가져오기
   */
  @computed
  get excelDataRowCount() {
    return this._excelDataRowCount;
  }

  /**
   * 학습완료 처리할 데이터 건수 가져오기
   * 학습완료이면서 이메일, 강좌명, 학습완료시간이 존재해야만 처리대상에 포함됨.
   */
  @computed
  get procTargetTotalListCount() {
    return this._procTargetTotalListCount;
  }

  /**
   * 학습완료 처리시 오류를 제외한 실제 완료처리 성공 건수 가져오기
   */
  @computed
  get processingSuccessTotalCount() {
    let completedTotalCount: number = 0;

    this._groupMemberTempModelList.map((model) => {
      if (model.result === 'Success') {
        completedTotalCount += 1;
      }
    });

    return completedTotalCount;
  }

  @computed
  get groupMemberTempProcList() {
    return this._groupMemberTempModelList;
  }
}

Object.defineProperty(GroupMemberTempProcService, 'instance', {
  value: new GroupMemberTempProcService(GroupMemberTempProcApi.instance),
  writable: false,
  configurable: false,
});
