import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container, Form } from 'semantic-ui-react';

import { fileUtil } from '@nara.drama/depot';
import { patronInfo } from '@nara.platform/dock';
import { reactAlert, reactAutobind } from '@nara.platform/accent';

import { PolyglotModel, SelectType } from 'shared/model';
import { depotService, DepotUploadType } from 'shared/present';
import { PageTitle } from 'shared/components';
import { confirm, ConfirmModel } from 'shared/components';
import {
  Language,
  LangSupport,
  getDefaultLanguage,
  getPolyglotToAnyString,
  getLanguageType,
} from 'shared/components/Polyglot';
import { ConfirmWin, AlertWin } from 'shared/ui';

import CollegeService from '../../present/logic/CollegeService';
import CollegeBannerDetailView from '../view/CollegeBannerDetailView';
import { CollegeBannerModel } from '../../model/CollegeBannerModel';

interface Props extends RouteComponentProps<{ cineroomId: string; collegeBannerId: string }> {
  collegeService?: CollegeService;
}

interface States {
  alertWinOpen: boolean;
  alertIcon: string;
  alertTitle: string;
  alertType: string;
  alertMessage: string;
  confirmWinOpenSave: boolean;
  confirmWinOpenDelete: boolean;
}

const ICON_EXTENSION = {
  IMAGE: 'jpg|png|jpeg|svg|JPG|PNG|JPEG|SVG',
};

@inject('collegeService')
@observer
@reactAutobind
class CreateCollegeBannerContainer extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      alertWinOpen: false,
      confirmWinOpenSave: false,
      confirmWinOpenDelete: false,
      alertMessage: '',
      alertIcon: '',
      alertTitle: '',
      alertType: '',
    };
  }

  componentDidMount() {
    //
    this.init();
    this.findAllColleges();
  }

  async init() {
    const { collegeService } = this.props;
    const { collegeBannerId } = this.props.match.params;
    if (collegeService) {
      if (!collegeBannerId) {
        collegeService.clearCollegeBannerProps();
      } else {
        await collegeService.findCollegeBanner(collegeBannerId);
      }
      collegeService.changeCollegeBannerViewType();
    }
  }

  findAllColleges() {
    //
    const { collegeService } = this.props;
    if (collegeService) collegeService.findAllColleges();
  }

  setCollege() {
    const { colleges } = this.props.collegeService || ({} as CollegeService);
    const list: any = [];
    if (colleges && colleges.length) {
      colleges.map((college, index) => {
        list.push({
          key: index + 1,
          text: getPolyglotToAnyString(college.name, getDefaultLanguage(college.langSupports)),
          value: college.id,
        });
      });
    }
    return list;
  }

  uploadFile(file: File, lang: Language, index: number) {
    if (!file || (file instanceof File && !this.validatedAll(file))) {
      return;
    }
    const { collegeService } = this.props;
    if (collegeService === undefined) {
      return;
    }
    const { collegeBanner } = collegeService;
    //const fileName = new LanguageStrings(collegeBanner.collegeBannerContents[index].fileName);
    const imageUrl = new PolyglotModel(collegeBanner.collegeBannerContents[index].imageUrl);
    //const imageAlt = new LanguageStrings(collegeBanner.collegeBannerContents[index].imageAlt);

    if (file.size >= 1024 * 1024 * 0.3) {
      alert('300KB 이하만 업로드 가능합니다.');
      return;
    }
    //this.changeFileName(file.name);

    depotService
      .uploadFile(file, DepotUploadType.CollegeBanner)
      .then((url) => {
        if (!url) {
          reactAlert({ title: '알림', message: '업로드가 실패했습니다.' });
        } else {
          imageUrl.setValue(lang, url);
          collegeService!.changeCollegeBannerContentProps(index, 'imageUrl', imageUrl);
        }
      })
      .catch(() => {
        reactAlert({ title: '알림', message: '업로드가 실패했습니다.' });
      });
  }

  deleteFile(lang: Language, index: number) {
    const { collegeService } = this.props;
    if (collegeService === undefined) {
      return;
    }
    const { collegeBanner } = collegeService;
    const imageUrl = new PolyglotModel(collegeBanner.collegeBannerContents[index].imageUrl);

    if (imageUrl.getValue(lang)) {
      confirm(
        ConfirmModel.getCustomConfirm(
          '삭제 안내',
          // (getLanguageType(lang)?.text || lang).concat('  Banner Image를 삭제 하시겠습니까?'),
          '선택한 항목을 삭제하시겠습니까?',
          true,
          '삭제',
          '취소',
          () => {
            imageUrl.setValue(lang, '');
            collegeService!.changeCollegeBannerContentProps(index, 'imageUrl', imageUrl);
          }
        )
      );
    }
  }

  validatedAll(file: File) {
    const validations = [
      { type: 'Extension', validValue: ICON_EXTENSION.IMAGE },
      //{ type: ValidationType.MaxSize, validValue: 30 * 1024 }, // 30k
    ] as any[];
    const hasNonPass = validations.some((validation) => {
      if (validation.validator && typeof validation.validator === 'function') {
        return !validation.validator(file);
      } else {
        if (!validation.type || !validation.validValue) {
          // console.warn('validations의 type과 validValue값을 넣어주시거나 validator를 사용해주세요.');
          return false;
        }

        return !fileUtil.validate(file, [], validation.type, validation.validValue);
      }
    });

    return !hasNonPass;
  }

  resetImage(index: number) {
    this.onChangeCollegeBannerContentProps(index, 'imageUrl', '');
  }

  onChangeCollegeBannerViewType() {
    const { collegeService } = this.props;
    if (collegeService) collegeService.changeCollegeBannerViewType();
  }

  onChangeCollegeBannerProps(name: string, value: string | number | [LangSupport]) {
    //
    const { collegeService } = this.props;
    if (collegeService) collegeService.changeCollegeBannerProps(name, value);
  }

  onChangeCollegeBannerContentProps0(name: string, value: string | number | PolyglotModel) {
    this.onChangeCollegeBannerContentProps(0, name, value);
  }

  onChangeCollegeBannerContentProps1(name: string, value: string | number | PolyglotModel) {
    this.onChangeCollegeBannerContentProps(1, name, value);
  }

  onChangeCollegeBannerContentProps(index: number, name: string, value: string | number | PolyglotModel) {
    //
    const { collegeService } = this.props;
    if (collegeService) collegeService.changeCollegeBannerContentProps(index, name, value);
  }

  async handleSave() {
    //
    const { collegeBanner } = this.props.collegeService || ({} as CollegeService);
    // Banner 명, College 선택 Validation Check
    const collegeBannerObject = CollegeBannerModel.isBlank(collegeBanner);

    // 2021-08-18 Validation Check 제외로 인한 주석 처리
    // const collegeBannerContentObject = CollegeBannerContentModel.isBlank(
    //   collegeBanner.langSupports,
    //   collegeBanner.collegeBannerContents
    // );

    // if (collegeBannerObject === 'success' && collegeBannerContentObject === 'success') {
    if (collegeBannerObject === 'success') {
      this.setState({ confirmWinOpenSave: true });
    } else if (collegeBannerObject !== 'success') {
      const message = collegeBannerObject + '은 필수입력 항목입니다.';
      this.confirmBlank(message);
    }

    // else if (collegeBannerContentObject !== 'success' && collegeBannerContentObject !== 'http') {
    //   const message = collegeBannerContentObject + '은 필수입력 항목입니다.';
    //   this.confirmBlank(message);
    // } else if (collegeBannerContentObject !== 'success' && collegeBannerContentObject === 'http') {
    //   const message = '링크는 http:// 또는 https:// 으로 시작되어야 합니다.';
    //   this.confirmBlank(message);
    // }
  }

  handleDelete() {
    //
    this.setState({ confirmWinOpenDelete: true });
  }

  confirmBlank(message: string) {
    //
    this.setState({
      alertMessage: message,
      alertWinOpen: true,
      alertTitle: '필수 정보 입력 안내',
      alertIcon: 'triangle',
      alertType: '안내',
    });
  }

  handleCloseAlertWin(mode?: string) {
    //
    this.setState({
      alertWinOpen: false,
    });
  }

  handleCloseConfirmWin() {
    //
    this.setState({
      confirmWinOpenSave: false,
      confirmWinOpenDelete: false,
    });
  }

  handleOKConfirmWinSave(type?: string) {
    //
    const { collegeService } = this.props;
    const { collegeBannerId } = this.props.match.params;

    if (collegeService) {
      const creatorName = patronInfo.getPatronName() || '';
      collegeService.changeCollegeBannerProps('creatorName', creatorName);

      collegeService.collegeBanner.collegeBannerContents.map((collegeBannerContent, index) => {
        if (collegeBannerContent.useLink === 0) {
          collegeService.changeCollegeBannerContentProps(index, 'linkUrl', '');
        }
      });

      if (!collegeBannerId) {
        collegeService
          .registerCollegeBanner()
          .then(() => collegeService.clearCollegeBannerProps())
          .then(() => this.routeToCollegeBannerList());
      } else {
        collegeService
          .modifyCollegeBanner(collegeBannerId)
          .then(() => collegeService.clearCollegeBannerProps())
          .then(() => this.routeToCollegeBannerList());
      }
    }
  }

  handleOKConfirmWinDelete() {
    //
    const { collegeService } = this.props;
    const { collegeBannerId } = this.props.match.params;

    if (collegeService) {
      collegeService
        .removeCollegeBanner(collegeBannerId)
        .then(() => collegeService.clearCollegeBannerProps())
        .then(() => this.routeToCollegeBannerList());
    }
  }

  handleAlertOk(type: string) {
    //
    if (type === '안내') this.handleCloseAlertWin();
  }

  routeToCollegeBannerList() {
    const { collegeService } = this.props;
    if (collegeService) {
      Promise.resolve()
        //.then(() => collegeService.clearCollegeBannerProps())
        .then(() =>
          this.props.history.push(
            `/cineroom/${this.props.match.params.cineroomId}/arrange-management/college/college-banner-list`
          )
        );
    }
  }

  render() {
    const { alertWinOpen, confirmWinOpenSave, confirmWinOpenDelete, alertMessage, alertIcon, alertTitle, alertType } =
      this.state;
    const { collegeBanner } = this.props.collegeService || ({} as CollegeService);
    const { collegeBannerId } = this.props.match.params;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.MainCategoryStateSection} />
        <div className="content">
          <Form>
            <CollegeBannerDetailView
              collegeBanner={collegeBanner}
              setCollege={this.setCollege}
              uploadFile={this.uploadFile}
              deleteFile={this.deleteFile}
              resetImage={this.resetImage}
              onChangeCollegeBannerViewType={this.onChangeCollegeBannerViewType}
              onChangeCollegeBannerProps={this.onChangeCollegeBannerProps}
              onChangeCollegeBannerContentProps={this.onChangeCollegeBannerContentProps}
            />
          </Form>

          <div className="fl-left">
            {collegeBannerId && (
              <Button primary onClick={this.handleDelete} type="button">
                삭제
              </Button>
            )}
          </div>

          <div className="fl-right">
            <Button onClick={this.routeToCollegeBannerList} type="button">
              목록
            </Button>
            <Button primary onClick={this.handleSave} type="button">
              저장
            </Button>
          </div>

          <AlertWin
            message={alertMessage}
            handleClose={this.handleCloseAlertWin}
            open={alertWinOpen}
            alertIcon={alertIcon}
            title={alertTitle}
            type={alertType}
            handleOk={this.handleAlertOk}
          />

          <ConfirmWin
            message="저장하시겠습니까?"
            open={confirmWinOpenSave}
            handleClose={this.handleCloseConfirmWin}
            handleOk={this.handleOKConfirmWinSave}
            title="저장 안내"
            buttonYesName="저장"
            buttonNoName="취소"
          />

          <ConfirmWin
            message="삭제하시겠습니까?"
            open={confirmWinOpenDelete}
            handleClose={this.handleCloseConfirmWin}
            handleOk={this.handleOKConfirmWinDelete}
            title="삭제 안내"
            buttonYesName="삭제"
            buttonNoName="취소"
          />
        </div>
      </Container>
    );
  }
}

export default withRouter(CreateCollegeBannerContainer);
