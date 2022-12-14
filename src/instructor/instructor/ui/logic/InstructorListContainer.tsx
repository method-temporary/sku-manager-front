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

    XLSX.utils.book_append_sheet(wb, sheet, '?????? ??????');

    const date = moment().format('YYYY-MM-DD_HH:mm:ss');
    const fileName = `?????? ?????? -.${date}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    return fileName;
  }

  async onClickAccount(instructor: InstructorModel) {
    //
    const { instructorService, loaderService } = this.injected;

    if (instructor.email === '') {
      alert(
        AlertModel.getCustomAlert(false, '?????? ?????? ?????? ??????', '???????????? ?????? ????????? ?????? ????????? ??? ????????????.', '??????')
      );
      return;
    }

    loaderService.openPageLoader();

    const response = await instructorService.accountInstructor(instructor.id, 'mySUNI12!');

    if (response !== '') {
      alert(
        AlertModel.getCustomAlert(false, '?????? ?????? ??????', '??????????????? ?????????????????????.', '??????', () => {
          this.findInstructor();
        })
      );
    }
  }

  renderAccountInfo(instructorWiths: InstructorWithUserIdentity): JSX.Element {
    //
    const { instructor, user } = instructorWiths;

    if (instructor.internal && user.id === '') {
      return <Table.Cell textAlign="center">?????? ??????</Table.Cell>;
    }

    if (instructor.denizenId === '' || instructor.denizenId === null) {
      return (
        <Table.Cell textAlign="center" onClick={(event: any) => event.stopPropagation()}>
          <Button type="button" onClick={() => this.onClickAccount(instructor)}>
            ?????? ??????
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
          `?????? ${DeliveryMethod.EMAIL === deliveryMethod ? '??????' : 'SMS'} ??????`,
          `?????? ${DeliveryMethod.EMAIL === deliveryMethod ? '??????' : 'SMS'}???(???) ?????? ???????????????????`,
          false,
          '??????',
          '??????',
          async () => {
            await instructorInvitationService.invite(invitationCdos);
            alert(
              AlertModel.getCustomAlert(
                false,
                `?????? ${DeliveryMethod.EMAIL === deliveryMethod ? '??????' : 'SMS'} ?????? ??????`,
                '?????????????????????',
                '??????',
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
            '?????? ??????',
            `email??? ?????? ????????? ??????????????? [${invalidTargets.map((target) => target.instructor.name.value)}]`,
            '??????',
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
            '?????? ??????',
            `???????????? ?????? ????????? ??????????????? [${invalidTargets.map((target) => target.instructor.name.value)}]`,
            '??????',
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
          <SearchBox.Group name="????????????">
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
              placeholder="??????"
            />
            <SearchBox.Select
              name="????????????"
              options={SelectType.searchWordForInstructorInternal}
              fieldName="internal"
              placeholder="??????"
            />
            <SearchBox.Select
              name="????????????"
              options={SelectType.searchWordForResting}
              fieldName="resting"
              placeholder="??????"
            />
          </SearchBox.Group>
          <SearchBox.Query
            options={SelectType.searchWordForInstructor}
            placeholders={['??????', '???????????? ??????????????????.']}
            searchWordDisabledValues={['', '??????']}
          />

          {/* TODO : Agency / ?????? ?????? ?????? ?????? ??? ?????? ??????
        <SearchBoxFieldView
          fieldTitle="????????????/??????"
          fieldOption={SelectType.searchWordForInstructorDepartment}
          onChangeQueryProps={changeInstructorQueryProps}
          targetValue={instructorQueryModel.department || '??????'}
          queryFieldName="department"
        /> */}

          {/*<SearchBoxFieldView*/}
          {/*  fieldTitle="????????????"*/}
          {/*  fieldOption={addSelectTypeBoxAllOption(SelectType.searchWordForAccountExist)}*/}
          {/*  onChangeQueryProps={changeInstructorQueryProps}*/}
          {/*  targetValue={instructorQueryModel.account === false ? false : instructorQueryModel.account || '??????'}*/}
          {/*  queryFieldName="account"*/}
          {/*/>*/}
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findInstructor}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count number={count} text=" ???" />
            </SubActions.Left>
            <SubActions.Right>
              <div className="div-section">
                <Button className="button" onClick={() => this.invite(DeliveryMethod.SMS)}>
                  ??????SMS ??????
                </Button>
                <Button className="button" onClick={() => this.invite(DeliveryMethod.EMAIL)}>
                  ???????????? ??????
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
