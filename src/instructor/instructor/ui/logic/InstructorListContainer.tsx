import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Container, Table } from 'semantic-ui-react';
import moment from 'moment';
import XLSX from 'xlsx';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { SelectType } from 'shared/model';
import {
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  PageTitle,
  Pagination,
  SearchBox,
  SubActions,
  Loader,
} from 'shared/components';
import { addSelectTypeBoxAllOption } from 'shared/helper';
import { LoaderService } from 'shared/components/Loader';

import InvitationCdo from 'instructor/instructor/model/vo/InvitationCdo';
import InstructorService from '../../present/logic/InstructorService';
import { CollegeService } from '../../../../college';
import InstructorListView from '../View/InstructorListView';
import { getInstructorInstructorExcelModel, InstructorExcelModel } from '../../model/instructorExcelModel';
import { InstructorWithUserIdentity } from '../../model/InstructorWithUserIdentity';
import InstructorInvitationService from '../../present/logic/InstructorInvitationService';
import { DeliveryMethod } from '../../../../user/model/DeliveryMethod';
import { InstructorModel } from '../..';

interface Params {
  cineroomId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface Injected {
  sharedService: SharedService;
  instructorService: InstructorService;
  collegeService: CollegeService;
  instructorInvitationService: InstructorInvitationService;
  loaderService: LoaderService;
}

@inject('sharedService', 'instructorService', 'collegeService', 'instructorInvitationService', 'loaderService')
@observer
@reactAutobind
class InstructorListContainer extends ReactComponent<Props, {}, Injected> {
  //
  paginationKey = 'instructorMgt';

  async findInstructor() {
    //
    const { instructorService, sharedService } = this.injected;

    const pageModel = sharedService.getPageModel(this.paginationKey);

    const totalCount = await instructorService.findInstructors(pageModel);

    await sharedService.setCount(this.paginationKey, totalCount);
  }

  async onClickExcelDown() {
    //
    const { instructorService, collegeService } = this.injected;
    const { findInstructorExcel } = instructorService;
    const { collegesMap } = collegeService;

    const instructors = await findInstructorExcel();

    const wbList: InstructorExcelModel[] = [];

    instructors &&
      instructors.forEach((instructorWiths) => {
        wbList.push(getInstructorInstructorExcelModel(instructorWiths, collegesMap));
      });

    //
    const sheet = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, sheet, '강사 관리');

    const date = moment().format('YYYY-MM-DD_HH:mm:ss');
    const fileName = `강사 관리 -.${date}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    return fileName;
  }

  async onClickAccount(instructor: InstructorModel) {
    //
    const { instructorService, loaderService } = this.injected;

    if (instructor.email === '') {
      alert(
        AlertModel.getCustomAlert(false, '계정 생성 실패 안내', '이메일이 없는 강사는 계정 생성할 수 없습니다.', '확인')
      );
      return;
    }

    loaderService.openPageLoader();

    const response = await instructorService.accountInstructor(instructor.id, 'mySUNI12!');

    if (response !== '') {
      alert(
        AlertModel.getCustomAlert(false, '계정 생성 안내', '정상적으로 생성되었습니다.', '확인', () => {
          this.findInstructor();
        })
      );
    }
  }

  renderAccountInfo(instructorWiths: InstructorWithUserIdentity): JSX.Element {
    //
    const { instructor, user } = instructorWiths;

    if (instructor.internal && user.id === '') {
      return <Table.Cell textAlign="center">퇴사 계정</Table.Cell>;
    }

    if (instructor.denizenId === '' || instructor.denizenId === null) {
      return (
        <Table.Cell textAlign="center" onClick={(event: any) => event.stopPropagation()}>
          <Button type="button" onClick={() => this.onClickAccount(instructor)}>
            계정 생성
          </Button>
        </Table.Cell>
      );
    }

    if (instructor.accountCreationTime === null || instructor.accountCreationTime === 0) {
      return <Table.Cell textAlign="center">-</Table.Cell>;
    }

    return <Table.Cell textAlign="center">{moment(instructor.accountCreationTime).format('YYYY-MM-DD')}</Table.Cell>;
  }

  routeToInstructorCreate() {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/instructors/instructor-create`
    );
  }

  routeToInstructorDetail(instructorId: string) {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/instructors/instructor-detail/${instructorId}`
    );
  }

  checkAll(value: boolean): void {
    //
    const { instructorService } = this.injected;
    instructorService.instructors.forEach((target, index) => {
      const { instructor, user } = target;
      if (
        instructor.signedDate == null &&
        !instructor.internal &&
        (!instructor.internal || user.id !== '') &&
        instructor.denizenId !== '' &&
        instructor.denizenId !== null &&
        instructor.accountCreationTime !== null &&
        instructor.accountCreationTime !== 0
      ) {
        instructorService.changeTargetInstructorProps(index, 'selected', value);
      }
    });
  }

  checkOne(index: number, value: boolean): void {
    //
    const { instructorService } = this.injected;
    instructorService.changeTargetInstructorProps(index, 'selected', value);
  }

  async invite(deliveryMethod: DeliveryMethod): Promise<void> {
    //
    const { instructorInvitationService, instructorService } = this.injected;
    const { instructors } = instructorService;
    const selectedInstructors = instructors.filter((target) => target.selected);
    const invitationCdos = selectedInstructors.map((target) => {
      const invitationCdo = new InvitationCdo();
      invitationCdo.deliveryMethods = [deliveryMethod];
      invitationCdo.targetInstructorId = target.instructor.id;
      return invitationCdo;
    });

    if (this.inviteValidationCheck(selectedInstructors, deliveryMethod)) {
      confirm(
        ConfirmModel.getCustomConfirm(
          `초대 ${DeliveryMethod.EMAIL === deliveryMethod ? '메일' : 'SMS'} 전송`,
          `초대 ${DeliveryMethod.EMAIL === deliveryMethod ? '메일' : 'SMS'}을(를) 전송 하시겠습니까?`,
          false,
          '전송',
          '취소',
          async () => {
            await instructorInvitationService.invite(invitationCdos);
            alert(
              AlertModel.getCustomAlert(
                false,
                `초대 ${DeliveryMethod.EMAIL === deliveryMethod ? '메일' : 'SMS'} 전송 완료`,
                '전송되었습니다',
                '확인',
                async () => {
                  await this.findInstructor();
                }
              )
            );
          }
        )
      );
    }
  }

  inviteValidationCheck(instructors: InstructorWithUserIdentity[], type: DeliveryMethod): boolean {
    //
    if (type === DeliveryMethod.EMAIL) {
      const invalidTargets = instructors.filter((target) => !target.instructor.email);
      if (invalidTargets.length > 0) {
        alert(
          AlertModel.getCustomAlert(
            true,
            '메일 전송',
            `email이 없는 계정이 존재합니다 [${invalidTargets.map((target) => target.instructor.name.value)}]`,
            '확인',
            () => {}
          )
        );
        return false;
      }
    }

    if (type === DeliveryMethod.SMS) {
      const invalidTargets = instructors.filter((target) => !target.instructor.phone);
      if (invalidTargets.length > 0) {
        alert(
          AlertModel.getCustomAlert(
            true,
            '메일 전송',
            `연락처가 없는 계정이 존재합니다 [${invalidTargets.map((target) => target.instructor.name.value)}]`,
            '확인',
            () => {}
          )
        );
        return false;
      }
    }

    return true;
  }

  render() {
    //
    const { instructorService, sharedService, collegeService } = this.injected;
    const { instructorSdo, changeInstructorSdoProp, instructors } = instructorService;
    const { count } = sharedService.getPageModel(this.paginationKey);
    const { collegesMap } = collegeService;

    return (
      <Container>
        <PageTitle breadcrumb={SelectType.instructorSections} />

        <SearchBox
          name={this.paginationKey}
          changeProps={changeInstructorSdoProp}
          queryModel={instructorSdo}
          onSearch={this.findInstructor}
        >
          <SearchBox.Group name="등록일자">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
            />
          </SearchBox.Group>
          <SearchBox.Group>
            <SearchBox.Select
              name="Category"
              options={addSelectTypeBoxAllOption(collegeService.collegesSelect)}
              fieldName="college"
              placeholder="전체"
            />
            <SearchBox.Select
              name="강사구분"
              options={SelectType.searchWordForInstructorInternal}
              fieldName="internal"
              placeholder="전체"
            />
            <SearchBox.Select
              name="활동여부"
              options={SelectType.searchWordForResting}
              fieldName="resting"
              placeholder="전체"
            />
          </SearchBox.Group>
          <SearchBox.Query
            options={SelectType.searchWordForInstructor}
            placeholders={['전체', '검색어를 입력해주세요.']}
            searchWordDisabledValues={['', '전체']}
          />

          {/* TODO : Agency / 부서 조회 위치 확인 후 조건 추가
        <SearchBoxFieldView
          fieldTitle="소속기관/부서"
          fieldOption={SelectType.searchWordForInstructorDepartment}
          onChangeQueryProps={changeInstructorQueryProps}
          targetValue={instructorQueryModel.department || '전체'}
          queryFieldName="department"
        /> */}

          {/*<SearchBoxFieldView*/}
          {/*  fieldTitle="계정유무"*/}
          {/*  fieldOption={addSelectTypeBoxAllOption(SelectType.searchWordForAccountExist)}*/}
          {/*  onChangeQueryProps={changeInstructorQueryProps}*/}
          {/*  targetValue={instructorQueryModel.account === false ? false : instructorQueryModel.account || '전체'}*/}
          {/*  queryFieldName="account"*/}
          {/*/>*/}
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findInstructor}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count number={count} text=" 명" />
            </SubActions.Left>
            <SubActions.Right>
              <div className="div-section">
                <Button className="button" onClick={() => this.invite(DeliveryMethod.SMS)}>
                  초대SMS 전송
                </Button>
                <Button className="button" onClick={() => this.invite(DeliveryMethod.EMAIL)}>
                  초대메일 전송
                </Button>
              </div>
              <Pagination.LimitSelect />
              <SubActions.ExcelButton download onClick={this.onClickExcelDown} />
              <SubActions.CreateButton onClick={this.routeToInstructorCreate} />
            </SubActions.Right>
          </SubActions>

          <Loader>
            <InstructorListView
              instructors={instructors}
              routeToInstructorDetail={this.routeToInstructorDetail}
              collegesMap={collegesMap}
              renderAccountInfo={this.renderAccountInfo}
              checkAll={this.checkAll}
              checkOne={this.checkOne}
            />
          </Loader>

          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default InstructorListContainer;
