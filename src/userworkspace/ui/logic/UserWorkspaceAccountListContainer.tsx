import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import XLSX from 'xlsx';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PageModel, PolyglotModel } from 'shared/model';
import { alert, AlertModel, confirm, ConfirmModel, Loader, Pagination, SubActions } from 'shared/components';
import { SharedService } from 'shared/present';
import { Language, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { SearchBoxService } from 'shared/components/SearchBox';
import { LoaderService } from 'shared/components/Loader';
import { AlertWin } from 'shared/ui';

import { getMemberRdo } from '../../../approval/shared/member.util';
import MemberQueryModel from '../../../approval/model/MemberQueryModel';
import { UserService } from '../../../user';
import ProfileInvitationService from '../../../user/present/logic/ProfileInvitationService';
import { DeliveryMethod } from '../../../user/model/DeliveryMethod';
import InvitationCdo from '../../../user/model/InvitationCdo';
import { getUserWorkspaceMemberXlsxModel } from '../../shared/util/userworkspace.util';
import UserWorkspaceService from '../../present/logic/UserWorkspaceService';
import { UserWorkspaceMemberXlsxModel } from '../../model/UserWorkspaceMemberXlsxModel';
import NonGdiMemberCitizensApplicationSdo from '../../model/dto/NonGdiMemberCitizensApplicationSdo';
import { NonGdiMemberSdo } from '../../model/dto/NonGdiMemberSdo';
import NonGdiMemberCitizensApplicationResult from '../../model/dto/NonGdiMemberCitizensApplicationResult';
import UserWorkspaceAccountSearchBox from '../view/UserWorkspaceAccountSearchBox';
import UserWorkspaceAccountListView from '../view/UserWorkspaceAccountListView';
import UserWorkspaceAccountDetailModal from './UserWorkspaceAccountDetailModal';
import UserWorkspaceExcelUploadFailureListModal from './UserWorkspaceExcelUploadFailureListModal';
import ExcelReadModal from './ExcelReadModal';

interface Props extends RouteComponentProps<Params> {}

interface Params {}

interface States {
  excelReadModalWin: boolean;
  invalidModalWin: boolean;
  failedReasonText: string;
  fileName: string;
  loaderText: string;
  alertOpen: boolean;
  excelEmptyColumnIdx: number;
  excelEmptyColumn: string;
  isSuniEdu: boolean;
}

interface Injected {
  userWorkspaceService: UserWorkspaceService;
  searchBoxService: SearchBoxService;
  sharedService: SharedService;
  userService: UserService;
  profileInvitationService: ProfileInvitationService;
  loaderService: LoaderService;
}

@inject(
  'userWorkspaceService',
  'searchBoxService',
  'sharedService',
  'userService',
  'profileInvitationService',
  'loaderService'
)
@observer
@reactAutobind
class UserWorkspaceAccountListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'userWorkspaceAccount';

  constructor(props: Props) {
    super(props);
    this.state = {
      excelReadModalWin: false,
      invalidModalWin: false,
      failedReasonText: '',
      fileName: '',
      loaderText: '',
      alertOpen: false,
      excelEmptyColumnIdx: 0,
      excelEmptyColumn: '',
      isSuniEdu: false,
    };
  }

  componentDidMount() {}

  async findUserWorkspaceAccount(): Promise<void> {
    //
    const { userWorkspaceService, sharedService } = this.injected;
    const { userWorkspace, memberSearchForm } = userWorkspaceService;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    userWorkspaceService.clearSelectedMemberIds();

    const offsetElementList = await userWorkspaceService.findMemberByCreationTime(
      MemberQueryModel.asSkProfileRdo(userWorkspace.usid, memberSearchForm, pageModel)
    );

    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  changeUserWorkspaceAccountQueryProps(name: string, value: any): void {
    //
    const { userWorkspaceService } = this.injected;
    userWorkspaceService.changeMemberSearchFormProps(name, value);
  }

  onChecked(id: string): void {
    //
    const { userWorkspaceService } = this.injected;
    const { members } = userWorkspaceService;
    const selectedIds = [...userWorkspaceService.selectedMemberIds];

    const allChecked =
      selectedIds.length !== 0 && members.filter((member) => !selectedIds.includes(member.user.id)).length === 0;

    if (id === 'All') {
      if (!allChecked) {
        userWorkspaceService.setSelectedMemberIds(userWorkspaceService.members.map((member) => member.user.id));
      } else {
        userWorkspaceService.clearSelectedMemberIds();
      }
    } else {
      if (selectedIds.includes(id)) {
        selectedIds.splice(
          selectedIds.findIndex((selectedId) => selectedId === id),
          1
        );
      } else {
        selectedIds.push(id);
      }

      userWorkspaceService.setSelectedMemberIds(selectedIds);
    }
  }

  onClickExcelDownload(): void {
    //
    // const { userWorkspaceService } = this.injected;
  }

  async findMemberById(): Promise<boolean> {
    //
    const { userWorkspaceService } = this.injected;
    const { selectedMemberIds } = userWorkspaceService;

    if (selectedMemberIds.length === 0 || selectedMemberIds.length > 1) {
      alert(AlertModel.getCustomAlert(true, '계정 수정 안내', '하나의 계정을 선택해주세요', '확인'));
      return false;
    } else if (selectedMemberIds.length === 1) {
      await userWorkspaceService.findMemberById(selectedMemberIds[0]);
      return true;
    }

    return false;
  }

  selectedMemberCheck(): boolean {
    const { userWorkspaceService } = this.injected;
    const { selectedMemberIds } = userWorkspaceService;

    if (selectedMemberIds.length === 0 || selectedMemberIds.length > 1) {
      alert(AlertModel.getCustomAlert(true, '계정 수정 안내', '하나의 계정을 선택해주세요', '확인'));
      return false;
    } else if (selectedMemberIds.length === 1) {
      return true;
    }

    return false;
  }

  async deactivateNonGdiMemberCitizen(): Promise<void> {
    //
    const { userWorkspaceService } = this.injected;
    const { selectedMemberIds } = userWorkspaceService;

    confirm(
      ConfirmModel.getRemoveConfirm(async () => {
        await userWorkspaceService.deactivateNonGdiMemberCitizen(selectedMemberIds);
        await this.findUserWorkspaceAccount();
      })
    );
  }

  async userWorkspaceMemberExcelDownload(): Promise<string> {
    //
    const { userWorkspaceService } = this.injected;
    const { memberSearchForm, userWorkspace } = userWorkspaceService;

    const memberList = await userWorkspaceService.findMemberByCreationTimeForExcel(
      getMemberRdo(userWorkspace.usid, memberSearchForm, new PageModel(0, 999999))
    );

    const memberXlsxList: UserWorkspaceMemberXlsxModel[] = [];
    memberList &&
      memberList.forEach((member, index) => {
        memberXlsxList.push(getUserWorkspaceMemberXlsxModel(index, member));
      });

    const memberExcel = XLSX.utils.json_to_sheet(memberXlsxList);
    const temp = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(temp, memberExcel, '계정설정');

    // const date = moment().format('YYYY-MM-DD HH:mm:ss');
    const fileName = `members.xlsx`;
    XLSX.writeFile(temp, fileName, { compression: true });
    return fileName;
  }

  onChangeOpen() {
    //
    const { excelReadModalWin } = this.state;
    if (excelReadModalWin) this.setState({ excelReadModalWin: false });
    else this.setState({ excelReadModalWin: true });
  }

  uploadFile(file: File) {
    //
    const { userWorkspaceService } = this.injected;
    const { userWorkspace } = userWorkspaceService;
    // const { member } = userService!.skProfile;

    userWorkspaceService.setNonGdiMemberCitizensApplicationSdo(new NonGdiMemberCitizensApplicationSdo());
    userWorkspaceService.clearTempNonGdiMemberSdo();

    const nonGdiMemberCitizensApplicationSdo = new NonGdiMemberCitizensApplicationSdo();
    nonGdiMemberCitizensApplicationSdo.workspaceCineroomId = userWorkspace.id;
    nonGdiMemberCitizensApplicationSdo.companyCode = userWorkspace.usid;
    nonGdiMemberCitizensApplicationSdo.companyName = getPolyglotToAnyString(userWorkspace.name);

    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      let binary = '';
      const data = new Uint8Array(e.target.result);
      const length = data.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(data[i]);
      }
      const workbook: any = XLSX.read(binary, { type: 'binary' });
      let members: any[] = [];

      workbook.SheetNames.forEach((item: any) => {
        const jsonArray = XLSX.utils.sheet_to_json(workbook.Sheets[item]);
        if (jsonArray.length === 0) {
          return;
        }
        members = jsonArray;
      });

      const target = [
        // ...members.filter((member) => member.이메일 !== null && member.이메일 !== '' && member.이메일 !== undefined),
        ...members,
      ];

      const invalidMembers: any[] = [];
      const toDeactivateMembers: any[] = [];

      target &&
        target.forEach((member, index) => {
          const memberSdo = new NonGdiMemberSdo();
          const name = new PolyglotModel();
          name.setValue(Language.Ko, member['성명 (Ko)']);
          name.setValue(Language.En, member['성명 (En)']);
          name.setValue(Language.Zh, member['성명 (Zh)']);
          memberSdo.name = name;
          memberSdo.usid = member['사번'];
          memberSdo.email = (member.이메일 && member.이메일.trim()) || '';
          // 김민준 - 다국어 적용시 변경 필요
          // const department = new PolyglotModel();
          // department.setValue(Language.Ko, member['소속부서명 (Ko)']);
          // department.setValue(Language.En, member['소속부서명 (En)']);
          // department.setValue(Language.Zh, member['소속부서명 (Zh)']);
          // memberSdo.departmentName = department;
          memberSdo.departmentName = member['소속부서명'];
          memberSdo.citizenId = member.사용자ID;
          memberSdo.tempWorkType = member['작업구분'];

          let phoneNumber = (member.연락처 && String(member.연락처).replace(/\-/g, '')) || '';
          if ((phoneNumber.length === 9 || phoneNumber.length === 10) && phoneNumber[0] === '1') {
            phoneNumber = 0 + phoneNumber;
          }
          memberSdo.phone = phoneNumber;

          userWorkspaceService.addTempNonGdiMemberSdo(memberSdo);

          if (member['작업구분'] === '추가') {
            nonGdiMemberCitizensApplicationSdo.toRegisterList.push(memberSdo);
          } else if (member['작업구분'] === '변경') {
            nonGdiMemberCitizensApplicationSdo.toModifyList.push(memberSdo);
          } else if (member['작업구분'] === '삭제') {
            nonGdiMemberCitizensApplicationSdo.toDeactivateCitizenIds.push(memberSdo.citizenId);
            toDeactivateMembers.push(memberSdo);
          }
        });

      if (invalidMembers.length <= 0) {
        userWorkspaceService.setNonGdiMemberCitizensApplicationSdo(nonGdiMemberCitizensApplicationSdo);
        this.setState({ fileName: file.name });
        userWorkspaceService.setUploadedFileName(file.name);
        userWorkspaceService.setUploadToDeactivateMembers(toDeactivateMembers);
        userWorkspaceService.setInvalidMembers([]);
      } else {
        this.setState({
          excelReadModalWin: false,
          invalidModalWin: true,
          failedReasonText: '엑셀 업로드에 적합하지 않은 양식이 있습니다.',
        });
        userWorkspaceService.setInvalidMembers(invalidMembers);
      }
    };
    fileReader.readAsArrayBuffer(file);
  }

  async onInvalidModalClose(value: boolean): Promise<void> {
    this.setState({ invalidModalWin: false });
    await this.findUserWorkspaceAccount();
  }

  async onReadExcel() {
    //
    const { userWorkspaceService, loaderService } = this.injected;
    const { userWorkspace } = userWorkspaceService;
    const { nonGdiMemberCitizensApplicationSdo, uploadToDeactivateMembers, tempNonGdiMemberSdoList } =
      userWorkspaceService;
    const { toRegisterList, toModifyList, toDeactivateCitizenIds } = nonGdiMemberCitizensApplicationSdo;
    const fails = [];
    const SPLIT_COUNT = 100;
    userWorkspaceService.setInvalidMembers([]);

    // 누락 데이터 확인
    let isSuniEdu = false;
    const emptyCheck =
      (tempNonGdiMemberSdoList &&
        tempNonGdiMemberSdoList.length > 0 &&
        tempNonGdiMemberSdoList.find((member, idx) => {
          if (!member.name || (member.name && !member.name.ko && !member.name.en && !member.name.zh)) {
            this.setState({ excelEmptyColumnIdx: idx });
            this.setState({ excelEmptyColumn: '성명' });
            return true;
          } else if (!member.email) {
            this.setState({ excelEmptyColumnIdx: idx });
            this.setState({ excelEmptyColumn: '이메일' });
            return true;
          } else if (!member.departmentName) {
            this.setState({ excelEmptyColumnIdx: idx });
            this.setState({ excelEmptyColumn: '소속부서명' });
            return true;
          } else if (member.tempWorkType && member.tempWorkType !== '추가' && !member.citizenId) {
            this.setState({ excelEmptyColumnIdx: idx });
            this.setState({ excelEmptyColumn: '사용자ID' });
            return true;
          } else if (userWorkspace.usid === 'SUNIEDU' && member.email) {
            isSuniEdu = true;
            if (/^.*@sk.com$/.test(member.email.toLowerCase())) {
              this.setState({
                excelEmptyColumnIdx: idx,
                excelEmptyColumn: '이메일',
              });
              return true;
              // validation = 'Suni_Edu 소속은 @sk.com 이메일을 사용할 수 없습니다.';
            }
          }
          return false;
        }) &&
        true) ||
      false;

    if (emptyCheck) {
      this.setState({ alertOpen: true, isSuniEdu });
      return;
    }

    loaderService.openPageLoader(true);
    if (toRegisterList.length + toModifyList.length + toDeactivateCitizenIds.length > SPLIT_COUNT) {
      const sdos = [];
      for (let i = SPLIT_COUNT; i < toRegisterList.length + SPLIT_COUNT; i += SPLIT_COUNT) {
        const sdo = NonGdiMemberCitizensApplicationSdo.getCopiedSdo(nonGdiMemberCitizensApplicationSdo);
        sdo.toRegisterList = toRegisterList.slice(i - SPLIT_COUNT, i);
        sdos.push(sdo);
      }

      for (let i = SPLIT_COUNT; i < toModifyList.length + SPLIT_COUNT; i += SPLIT_COUNT) {
        const sdo = NonGdiMemberCitizensApplicationSdo.getCopiedSdo(nonGdiMemberCitizensApplicationSdo);
        sdo.toModifyList = toModifyList.slice(i - SPLIT_COUNT, i);
        sdos.push(sdo);
      }
      for (let i = SPLIT_COUNT; i < toDeactivateCitizenIds.length + SPLIT_COUNT; i += SPLIT_COUNT) {
        const sdo = NonGdiMemberCitizensApplicationSdo.getCopiedSdo(nonGdiMemberCitizensApplicationSdo);
        sdo.toDeactivateCitizenIds = toDeactivateCitizenIds.slice(i - SPLIT_COUNT, i);
        sdos.push(sdo);
      }

      let loadingCount = 0;
      /* eslint-disable no-await-in-loop */
      for (const sdo of sdos) {
        this.setState({
          loaderText: `일괄 변경 중(${loadingCount}/${
            toRegisterList.length + toModifyList.length + toDeactivateCitizenIds.length
          })`,
        });
        const fail = await userWorkspaceService.applyNonGdiMemberCitizens(sdo);
        loadingCount += sdo.toRegisterList.length + sdo.toModifyList.length + sdo.toDeactivateCitizenIds.length;
        fails.push(fail);
      }
    } else {
      const fail = await userWorkspaceService.applyNonGdiMemberCitizens(nonGdiMemberCitizensApplicationSdo);
      fails.push(fail);
    }
    this.setState({
      excelReadModalWin: false,
    });

    const totalCount = toRegisterList.length + toModifyList.length + toDeactivateCitizenIds.length;

    let failToRegisterCount = 0;
    let failToUpdateCount = 0;
    let failToDeleteCount = 0;

    const invalidMembers: any[] = [];

    fails.forEach((fail) => {
      const failedRegisters =
        (fail.failedToRegisterSdos &&
          fail.failedToRegisterSdos.map((target) => {
            return new NonGdiMemberSdo({ ...target, failedReason: '추가 실패' });
          })) ||
        [];
      const failedModifies =
        (fail.failedToModifySdos &&
          fail.failedToModifySdos.map((target) => {
            return new NonGdiMemberSdo({ ...target, failedReason: '변경 실패' });
          })) ||
        [];
      const failedToDeactivates =
        (fail.failedToDeactivateCitizenIds &&
          fail.failedToDeactivateCitizenIds.map((target) => {
            const sdo = uploadToDeactivateMembers.find((member) => member.citizenId === target);
            sdo.failedReason = '삭제 실패';
            return sdo;
          })) ||
        [];
      invalidMembers.push(...failedRegisters, ...failedModifies, ...failedToDeactivates);
      failToRegisterCount += failedRegisters.length;
      failToUpdateCount += failedModifies.length;
      failToDeleteCount += failedToDeactivates.length;
    });
    userWorkspaceService.setInvalidMembers(invalidMembers);

    this.setState({
      fileName: '',
      loaderText: '',
      invalidModalWin: true,
      failedReasonText: `총 ${totalCount} 건 중 ${
        totalCount - (failToRegisterCount + failToUpdateCount + failToDeleteCount)
      }건 성공 / ${failToRegisterCount + failToUpdateCount + failToDeleteCount}건이 실패 했습니다. </br> (추가: ${
        toRegisterList.length
      }, 변경: ${toModifyList.length}, 삭제: ${
        toDeactivateCitizenIds.length
      }) / (추가: ${failToRegisterCount}, 변경: ${failToUpdateCount}, 삭제: ${failToDeleteCount})`,
    });
    userWorkspaceService.setUploadedFileName('');

    loaderService.closeLoader(true);
  }

  async applyNonGdiMemberCitizen(
    sdo: NonGdiMemberCitizensApplicationSdo
  ): Promise<NonGdiMemberCitizensApplicationResult> {
    const { userWorkspaceService } = this.injected;
    return userWorkspaceService.applyNonGdiMemberCitizens(sdo);
  }

  onClickPassWordModalOk(password: string, close: () => void) {
    //
    const { userWorkspaceService } = this.injected;
    const { members, selectedMemberIds } = userWorkspaceService;

    const targetMember = members.find((member) => member.user.id === selectedMemberIds[0]);

    if (targetMember) {
      confirm(
        ConfirmModel.getCustomConfirm(
          '비밀번호 초기화',
          '비밀번호를 초기화하시겠습니까?',
          false,
          '초기화',
          '취소',
          () => this.modifySkProfileDefaultPassword(password, targetMember.user.email, close)
        )
      );
    }
  }

  async modifySkProfileDefaultPassword(password: string, email: string, close: () => void) {
    //
    const { userService } = this.injected;
    const { modifyUserDefaultPassword } = userService;

    modifyUserDefaultPassword(password, email).then((response) => {
      if (response.errorCode === 0) {
        alert(AlertModel.getSaveSuccessAlert(close));
      } else {
        alert(AlertModel.getCustomAlert(false, 'Saving Failed', response.errorMessage, 'Ok'));
      }
    });

    await this.findUserWorkspaceAccount();
  }

  async invite(deliveryMethod: DeliveryMethod): Promise<void> {
    //
    const { profileInvitationService, userWorkspaceService } = this.injected;
    const { selectedMemberIds } = userWorkspaceService;
    const invitationCdos = selectedMemberIds.map((id) => {
      const invitationCdo = new InvitationCdo();
      invitationCdo.userId = id;
      invitationCdo.byEmail = deliveryMethod === DeliveryMethod.EMAIL;
      invitationCdo.bySms = deliveryMethod === DeliveryMethod.SMS;
      return invitationCdo;
    });

    confirm(
      ConfirmModel.getCustomConfirm(
        `초대 ${DeliveryMethod.EMAIL === deliveryMethod ? '메일' : 'SMS'} 전송`,
        `초대 ${DeliveryMethod.EMAIL === deliveryMethod ? '메일' : 'SMS'}을(를) 전송 하시겠습니까?`,
        false,
        '전송',
        '취소',
        async () => {
          await profileInvitationService.invite(invitationCdos);
          alert(
            AlertModel.getCustomAlert(
              false,
              `초대 ${DeliveryMethod.EMAIL === deliveryMethod ? '메일' : 'SMS'} 전송 완료`,
              '전송되었습니다',
              '확인',
              async () => {
                await this.findUserWorkspaceAccount();
              }
            )
          );
        }
      )
    );
  }

  handleCloseAlert() {
    this.setState({ alertOpen: false, excelEmptyColumn: '' });
  }

  render() {
    //
    const {
      excelReadModalWin,
      invalidModalWin,
      failedReasonText,
      fileName,
      loaderText,
      alertOpen,
      excelEmptyColumn,
      excelEmptyColumnIdx,
      isSuniEdu,
    } = this.state;
    const { userWorkspaceService, sharedService } = this.injected;
    const { memberSearchForm, members, selectedMemberIds, invalidMembers } = userWorkspaceService;
    const { startNo, count } = sharedService.getPageModel(this.paginationKey);

    return (
      <Container fluid>
        <UserWorkspaceAccountSearchBox
          findUserWorkspaceAccount={this.findUserWorkspaceAccount}
          changeUserWorkspaceAccountQueryProps={this.changeUserWorkspaceAccountQueryProps}
          memberSearchForm={memberSearchForm}
          paginationKey={this.paginationKey}
        />
        <Pagination name={this.paginationKey} onChange={this.findUserWorkspaceAccount}>
          <Grid className="list-info">
            <Grid.Row>
              <Grid.Column width={8}>
                <SubActions.Count number={count} text="건" />
              </Grid.Column>
              <Grid.Column width={8}>
                <div className="right" style={{ display: 'inline-block' }}>
                  <div className="div-section">
                    <SubActions.ExcelButton download onClick={() => this.userWorkspaceMemberExcelDownload()} />
                    <Button className="button" onClick={() => this.onChangeOpen()}>
                      엑셀 일괄 변경
                    </Button>
                  </div>
                  <div className="div-section">
                    <Button className="button" onClick={() => this.invite(DeliveryMethod.SMS)}>
                      초대SMS 전송
                    </Button>
                    <Button className="button" onClick={() => this.invite(DeliveryMethod.EMAIL)}>
                      초대메일 전송
                    </Button>
                  </div>
                  <div className="div-section">
                    <UserWorkspaceAccountDetailModal
                      text="추가"
                      findUserWorkspaceAccount={this.findUserWorkspaceAccount}
                    />
                    <UserWorkspaceAccountDetailModal
                      text="수정"
                      onMount={this.findMemberById}
                      selectedMemberCheck={this.selectedMemberCheck}
                      memberId={selectedMemberIds.length === 1 ? selectedMemberIds[0] : ''}
                      findUserWorkspaceAccount={this.findUserWorkspaceAccount}
                    />

                    <Button
                      disabled={selectedMemberIds.length === 0}
                      onClick={() => this.deactivateNonGdiMemberCitizen()}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Loader loaderText={loaderText && loaderText}>
            <UserWorkspaceAccountListView
              onChecked={this.onChecked}
              members={members}
              selectedMemberIds={selectedMemberIds}
              startNo={startNo}
            />
          </Loader>
          <Pagination.Navigator />
        </Pagination>
        <ExcelReadModal
          open={excelReadModalWin}
          onChangeOpen={this.onChangeOpen}
          fileName={fileName}
          uploadFile={this.uploadFile}
          onReadExcel={this.onReadExcel}
          targetText="엑셀 파일을 업로드하면 사용자가 일괄 변경됩니다."
          defaultForm="엑셀-계정-설정.xlsx"
        />
        <UserWorkspaceExcelUploadFailureListModal
          open={invalidModalWin}
          failedList={invalidMembers}
          text={failedReasonText}
          onClosed={this.onInvalidModalClose}
        />
        <AlertWin
          message={
            isSuniEdu
              ? `${excelEmptyColumnIdx + 1} 번째 유저의 ${excelEmptyColumn} 컬럼 값을 확인해 주세요.`
              : `${excelEmptyColumnIdx + 1} 번째 유저의 ${excelEmptyColumn} 컬럼 값이 비어있습니다.`
          }
          handleClose={this.handleCloseAlert}
          open={alertOpen}
          alertIcon="triangle"
          title={isSuniEdu ? 'Suni_Edu 소속은 @sk.com 이메일을 사용할 수 없습니다.' : '필수 값 입력 누락'}
          type="안내"
          handleOk={this.handleCloseAlert}
        />
      </Container>
    );
  }
}

export default withRouter(UserWorkspaceAccountListContainer);
