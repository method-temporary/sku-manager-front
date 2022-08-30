import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Container } from 'semantic-ui-react';

import { fileUtil } from '@nara.drama/depot';
import { MemberViewModel } from '@nara.drama/approval';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, PolyglotModel, FileUploadType } from 'shared/model';
import { PageTitle, SubActions, alert, AlertModel, confirm, ConfirmModel, Polyglot } from 'shared/components';
import { SharedService } from 'shared/present';
import { Language, isDefaultPolyglotBlank } from 'shared/components/Polyglot';

import { CollegeService } from 'college';

import InstructorService from '../../present/logic/InstructorService';
import InstructorCreateView from '../View/InstructorCreateView';
import { InstructorCdoModel } from '../../model/InstructorCdoModel';

interface Params {
  cineroomId: string;
  instructorId?: string;
}

interface Props extends RouteComponentProps<Params> {}

interface State {
  imageFile: File | null;
}

interface Injected {
  sharedService: SharedService;
  instructorService: InstructorService;
  collegeService: CollegeService;
}

const ICON_EXTENSION = {
  IMAGE: 'jpg|png|jpeg|svg|JPG|PNG|JPEG|SVG',
};

@inject('sharedService', 'instructorService', 'collegeService')
@observer
@reactAutobind
class InstructorCreateContainer extends ReactComponent<Props, State, Injected> {
  //
  state: State = {
    imageFile: null,
  };

  constructor(props: Props) {
    super(props);

    this.injected.instructorService.clearInstructorCdo();

    if (this.props.match.params.instructorId) {
      this.setInstructorCdo(this.props.match.params.instructorId);
    }
  }

  async setInstructorCdo(instructorId: string) {
    //
    const { findInstructorById, setInstructorCdo } = this.injected.instructorService;

    const instructor = await findInstructorById(instructorId);

    const instructorCdo = await InstructorCdoModel.asCdoByInstructorWiths(instructor);

    await setInstructorCdo(instructorCdo);
  }

  onClickOrgChart(member: MemberViewModel) {
    //
    const { instructorService } = this.injected;
    const { changeInstructorCdoProps } = instructorService;

    this.setState({ imageFile: null });

    const position = new PolyglotModel();
    position.setValue(Language.Ko, member.title);

    changeInstructorCdoProps('employeeId', member.employeeId);
    changeInstructorCdoProps('email', member.email);
    changeInstructorCdoProps('name', member.name);
    changeInstructorCdoProps('position', position);
    changeInstructorCdoProps('organization', member.companyName);
    changeInstructorCdoProps('previewPhotoPath', process.env.REACT_APP_SK_IM_PHOTO_ROOT_URL + member.photoFileUrl);
    changeInstructorCdoProps('photoFilePath', process.env.REACT_APP_SK_IM_PHOTO_ROOT_URL + member.photoFileUrl);
    changeInstructorCdoProps('denizenId', member.id);
    changeInstructorCdoProps('fileName', '');
    changeInstructorCdoProps('accountCreationTime', member.creationTime);
    changeInstructorCdoProps('phone', member.phone);
  }

  uploadFile(file: File) {
    //
    if (!file || (file instanceof File && !this.validatedAll(file))) {
      return;
    }

    const { changeInstructorCdoProps } = this.injected.instructorService;

    if (file.size >= 1024 * 1024 * 0.3) {
      alert(AlertModel.getCustomAlert(false, '파일 선택 실패', '300KB 이하만 업로드 가능합니다.', '확인'));
      return;
    }

    this.setState({ imageFile: file });

    changeInstructorCdoProps('fileName', file.name);
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      const data = e.target.result;
      changeInstructorCdoProps('previewPhotoPath', data);
    };
    fileReader.readAsDataURL(file);
  }

  validatedAll(file: File) {
    const validations = [{ type: 'Extension', validValue: ICON_EXTENSION.IMAGE }] as any[];
    const hasNonPass = validations.some((validation) => {
      if (validation.validator && typeof validation.validator === 'function') {
        return !validation.validator(file);
      } else {
        if (!validation.type || !validation.validValue) {
          return false;
        }
        return !fileUtil.validate(file, [], validation.type, validation.validValue);
      }
    });

    return !hasNonPass;
  }

  async onClickSaveInstructor() {
    //
    if (!this.validationCheck()) {
      return;
    }

    confirm(
      ConfirmModel.getSaveConfirm(() => {
        this.onClickSave();
      }),
      false
    );
  }

  validationCheck() {
    //
    const { instructorService } = this.injected;
    const { instructorCdo } = instructorService;
    const { langSupports } = instructorCdo;

    if (instructorCdo.collegeId === '') {
      alert(AlertModel.getRequiredChoiceAlert('College'));
      return false;
    }

    if (instructorCdo.internal) {
      if (isDefaultPolyglotBlank(langSupports, instructorCdo.name)) {
        alert(AlertModel.getCustomAlert(false, '필수 선택 안내', '사내 강사는 조직도로 강사를 선택해 주세요', '확인'));
        return false;
      }
    } else {
      if (isDefaultPolyglotBlank(langSupports, instructorCdo.name)) {
        alert(AlertModel.getRequiredInputAlert('Name'));
        return false;
      }

      if (isDefaultPolyglotBlank(langSupports, instructorCdo.organization)) {
        alert(AlertModel.getRequiredInputAlert('소속기관/부서'));
        return false;
      }
    }

    if (instructorCdo.email.trim() !== '') {
      const reg = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

      if (!reg.test(instructorCdo.email.trim())) {
        alert(AlertModel.getCustomAlert(false, 'Email 형식 안내', 'Email 형식에 맞지 않습니다.', '확인'));
        return false;
      }
    }

    // if (instructorCdo.phone.trim() !== '') {
    //   const reg = new RegExp(/^\d{3}-\d{3,4}-\d{4}$/);

    //   if (!reg.test(instructorCdo.phone.trim())) {
    //     alert(
    //       AlertModel.getCustomAlert(
    //         false,
    //         '전화번호 형식 안내',
    //         '전화번호 형식(XXX-XXXX-XXXX)에 맞지 않습니다. ',
    //         '확인'
    //       )
    //     );
    //     return false;
    //   }
    // }

    return true;
  }

  async onClickSave() {
    //
    const { sharedService, instructorService } = this.injected;
    const { changeInstructorCdoProps, registerInstructor, modifyInstructor } = instructorService;

    if (this.state.imageFile) {
      const path = await sharedService.uploadFile(this.state.imageFile, FileUploadType.Instructor);

      changeInstructorCdoProps('photoFilePath', path);
    }

    let instructorId = '';

    if (this.props.match.params.instructorId) {
      instructorId = await modifyInstructor(this.props.match.params.instructorId);
      if (instructorId !== 'EmailAlreadyExists') instructorId = this.props.match.params.instructorId;
    } else {
      instructorId = await registerInstructor();
    }

    if (instructorId === 'EmailAlreadyExists') {
      // Email 중복
      alert(AlertModel.getOverlapAlert(`"E-amil"`));
      return;
    } else if (instructorId === '') {
      alert(AlertModel.getCustomAlert(true, '예상치 못한 에러 발생', '', '확인'));
      return;
    }

    alert(
      AlertModel.getSaveSuccessAlert(() => {
        this.routeToInstructorDetail(instructorId);
      })
    );
  }

  routeToInstructorList() {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/instructors/instructor-list`
    );
  }

  routeToInstructorDetail(instructorId: string) {
    this.props.history.replace(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/instructors/instructor-detail/${instructorId}`
    );
  }

  render() {
    //
    const { instructorId } = this.props.match.params;
    const { instructorService, collegeService } = this.injected;
    const { instructorCdo, changeInstructorCdoProps } = instructorService;
    const { collegesSelect } = collegeService;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.instructorSections} />
        <Polyglot languages={instructorCdo.langSupports}>
          <InstructorCreateView
            instructorId={instructorId}
            instructorCdo={instructorCdo}
            changeInstructorCdoProps={changeInstructorCdoProps}
            collegesSelect={collegesSelect}
            uploadFile={this.uploadFile}
            onClickOrgChart={this.onClickOrgChart}
          />
        </Polyglot>

        <SubActions form>
          <SubActions.Left>
            {this.props.match.params.instructorId && (
              <Button onClick={() => this.props.history.goBack()} type="button">
                취소
              </Button>
            )}
          </SubActions.Left>
          <SubActions.Right>
            <Button onClick={this.routeToInstructorList} type="button">
              목록
            </Button>
            <Button primary onClick={this.onClickSaveInstructor} type="button">
              저장
            </Button>
          </SubActions.Right>
        </SubActions>
      </Container>
    );
  }
}

export default InstructorCreateContainer;
