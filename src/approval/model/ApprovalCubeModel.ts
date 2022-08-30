import { decorate, observable } from 'mobx';
import { patronInfo } from '@nara.platform/dock';
import moment from 'moment';
import numeral from 'numeral';

import { DramaEntity, PatronKey } from '@nara.platform/accent';

import { CategoryModel, CreatorModel, IdName, PolyglotModel, OperationModel } from 'shared/model';

import { CubeState } from '../../personalcube/model/vo/CubeState';
import { CubeContentsModel } from '../../personalcube/model/old/CubeContentsModel';
import { OpenRequest } from '../../cube/cube';
import { FreeOfChargeModel } from './FreeOfChargeModel';
import { ApprovalCubeXlsxModel } from './ApprovalCubeXlsxModel';
import ApprovalCubeQueryModel from './ApprovalCubeQueryModel';
import { Enrolling } from '../../cube/classroom/model/vo/Enrolling';

export class ApprovalCubeModel implements DramaEntity {
  //
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;

  personalCubeId: string = '';
  name: string = '';
  category: CategoryModel = new CategoryModel();
  subCategories: CategoryModel[] = [];
  creator: CreatorModel = new CreatorModel();
  cubeState: CubeState = CubeState.Created;

  subsidiaries: IdName[] = [];
  requiredSubsidiaries: IdName[] = [];
  contents: CubeContentsModel = new CubeContentsModel();
  cubeIntro: IdName = new IdName();
  tags: PolyglotModel[] = [];
  // time: number = 0;
  registeredTime: number = 0;
  openRequests: OpenRequest[] = [];

  //UI
  required: boolean = false;
  studentId: string = '';
  rollBookId: string = '';
  classroomId: string = '';
  studentName: string = '';
  // memberDepartment: string = '';
  studentDepartmentNames: PolyglotModel = new PolyglotModel();
  studentCompanyNamesJson: PolyglotModel = new PolyglotModel();
  email: string = '';
  cubeName: PolyglotModel = new PolyglotModel();

  round: number = 0;
  // studentCount: number = 0;
  approvedStudentCount: number = 0; // 신청 현황
  capacity: number = 0;
  remark: string = '';

  freeOfCharge: FreeOfChargeModel = new FreeOfChargeModel();
  chargeAmount: number = 0; // 비용
  operation: OperationModel = new OperationModel();
  enrolling: Enrolling = new Enrolling(); // 신청/취소/학습 기간/신청유무
  lectureCardId: string = '';
  cubeType: string = '';
  proposalState: string = '';
  learningState: string = '';

  learningStartDate: string = ''; // 교육 기간 (시작)
  learningEndDate: string = ''; // 교육 기간 (종료)

  constructor(approvalCube?: ApprovalCubeModel) {
    //
    if (approvalCube) {
      const cubeName = (approvalCube.cubeName && new PolyglotModel(approvalCube.cubeName)) || this.cubeName;
      const creator = (approvalCube.creator && new CreatorModel(approvalCube.creator)) || this.creator;
      const contents = (approvalCube.contents && new CubeContentsModel(approvalCube.contents)) || this.contents;
      const cubeIntro = (approvalCube.cubeIntro && new IdName(approvalCube.cubeIntro)) || this.cubeIntro;
      const category = (approvalCube.category && new CategoryModel(approvalCube.category)) || this.category;
      const freeOfCharge =
        (approvalCube.freeOfCharge && new FreeOfChargeModel(approvalCube.freeOfCharge)) || this.freeOfCharge;
      const operation = (approvalCube.operation && new OperationModel(approvalCube.operation)) || this.operation;
      const enrolling = (approvalCube.enrolling && new Enrolling(approvalCube.enrolling)) || this.enrolling;
      const studentDepartmentNames =
        (approvalCube.studentDepartmentNames && new PolyglotModel(approvalCube.studentDepartmentNames)) ||
        this.studentDepartmentNames;
      const studentCompanyNamesJson =
        (approvalCube.studentCompanyNamesJson && new PolyglotModel(approvalCube.studentCompanyNamesJson)) ||
        this.studentCompanyNamesJson;

      Object.assign(this, {
        ...approvalCube,
        cubeName,
        studentDepartmentNames,
        studentCompanyNamesJson,
        creator,
        contents,
        cubeIntro,
        category,
        freeOfCharge,
        operation,
        enrolling,
      });

      // UI Model
      const companyCode = patronInfo.getPatronCompanyCode();

      this.required =
        approvalCube.requiredSubsidiaries &&
        approvalCube.requiredSubsidiaries.some((subsidiary) => subsidiary.id === companyCode);
    }
  }

  public static getProposalStateName(proposalState: string) {
    //
    if (!proposalState) {
      return '';
    }

    if (proposalState && proposalState === 'Approved') {
      return '승인';
    }
    if (proposalState && proposalState === 'Submitted') {
      return '승인대기';
    }
    if (proposalState && proposalState === 'Canceled') {
      return '취소';
    }
    if (proposalState && proposalState === 'Rejected') {
      return '반려';
    }
    return '';
  }

  public static getLearningStateName(learningState: string) {
    //
    if (!learningState) {
      return '';
    }

    if (learningState === 'Progress') {
      return '학습중';
    } else if (learningState === 'Waiting') {
      return '결과처리 대기';
    } else if (learningState === 'Passed') {
      return '이수';
    } else if (learningState === 'Missed') {
      return '미이수';
    } else if (learningState === 'NoShow') {
      return '불참';
    }
    return '';
  }

  static asXLSX(approvalCube: ApprovalCubeModel, index: number): ApprovalCubeXlsxModel {
    //
    return {
      No: index + 1,
      신청자: approvalCube.studentName,
      email: approvalCube.email,
      '회사(Ko)': approvalCube?.studentCompanyNamesJson.ko || '-',
      '회사(En)': approvalCube?.studentCompanyNamesJson.en || '-',
      '회사(Zh)': approvalCube?.studentCompanyNamesJson.zh || '-',
      '조직(Ko)': approvalCube?.studentDepartmentNames.ko || '-',
      '조직(En)': approvalCube?.studentDepartmentNames.en || '-',
      '조직(Zh)': approvalCube?.studentDepartmentNames.zh || '-',
      '과정명(Ko)': approvalCube?.cubeName.ko || '-',
      '과정명(En)': approvalCube?.cubeName.en || '-',
      '과정명(Zh)': approvalCube?.cubeName.zh || '-',
      차수: approvalCube.round,
      신청상태: ApprovalCubeModel.getProposalStateName(approvalCube.proposalState),
      //학습상태: ApprovalCubeModel.getLearningStateName(approvalCube.learningState),
      신청현황: approvalCube.approvedStudentCount + '/' + approvalCube.capacity,
      '(차수)교육기간': approvalCube.learningStartDate + '~' + approvalCube.learningEndDate,
      // 신청일자: approvalCube.time && moment(approvalCube.time).format('YYYY.MM.DD'),
      신청일자: approvalCube.registeredTime && moment(approvalCube.registeredTime).format('YYYY.MM.DD'),
      '인당 교육금액': numeral(approvalCube.chargeAmount).format('0,0'),
    };
  }

  static isBlank(approvalCube: ApprovalCubeQueryModel): string {
    //if (!approvalCube.name) return 'Badge명';
    return 'success';
  }
}

decorate(ApprovalCubeModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,

  personalCubeId: observable,
  name: observable,
  creator: observable,
  contents: observable,
  cubeIntro: observable,
  tags: observable,
  category: observable,
  subCategories: observable,
  cubeState: observable,
  subsidiaries: observable,
  requiredSubsidiaries: observable,
  // time: observable,
  registeredTime: observable,
  openRequests: observable,
  required: observable,

  studentId: observable,
  rollBookId: observable,
  classroomId: observable,
  studentName: observable,
  studentDepartmentNames: observable,
  cubeName: observable,

  round: observable,
  approvedStudentCount: observable,
  capacity: observable,
  remark: observable,

  freeOfCharge: observable,
  chargeAmount: observable,
  operation: observable,
  enrolling: observable,
  lectureCardId: observable,
  cubeType: observable,
  proposalState: observable,

  learningStartDate: observable,
  learningEndDate: observable,
});
