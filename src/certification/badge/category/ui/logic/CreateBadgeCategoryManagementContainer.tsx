import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { fileUtil, ValidationType } from '@nara.drama/depot';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, FileUploadType, FileSizeModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { alert, AlertModel, PageTitle, SubActions, Polyglot } from 'shared/components';
import { isDefaultPolyglotBlank } from 'shared/components/Polyglot';
import { fileSizeValidate } from 'shared/helper';

import { fromBadgeCategoryCdoModel, getBadgeCategoryModelNameValueList } from '../../shared/util';
import BadgeCategoryService from '../../present/logic/BadgeCategoryService';
import { BadgeCategoryThemeColor } from '../../model/BadgeCategoryThemeColor';
import DetailBadgeCategoryManagementView from '../view/DetailBadgeCategoryManagementView';
import BadgeCategoryGuideModal from './BadgeCategoryGuideModal';
import BadgeCategoryPreviewModal from 'certification/badge/badge/ui/logic/BadgeCategoryPreviewModal';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  badgeCategoryId: string;
}

interface Injected {
  badgeCategoryService: BadgeCategoryService;
  sharedService: SharedService;
}

interface State {
  isUpdatable: boolean;
}

const EXTENSION = {
  IMAGE: 'jpg|jpeg|gif',
};

@inject('badgeCategoryService', 'sharedService')
@observer
@reactAutobind
class CreateBadgeCategoryManagementContainer extends ReactComponent<Props, State, Injected> {
  //

  constructor(props: Props) {
    super(props);
    this.state = {
      isUpdatable: false,
    };
  }

  componentDidMount(): void {
    //
    const { badgeCategoryId } = this.props.match.params;
    const { badgeCategoryService } = this.injected;
    badgeCategoryService.clearFileName();

    if (badgeCategoryId) {
      this.findBadgeCategoryById(badgeCategoryId);
    } else {
      this.setState({ isUpdatable: true });
    }
  }

  async findBadgeCategoryById(badgeCategoryId: string) {
    //
    const { badgeCategoryService } = this.injected;
    badgeCategoryService.clearFileName();
    await badgeCategoryService.findBadgeCategoryById(badgeCategoryId);
  }

  async saveBadgeCategory() {
    //
    const { badgeCategoryService } = this.injected;
    let { badgeCategoryId } = this.props.match.params;

    if (this.badgeCategoryValidationCheck()) {
      if (badgeCategoryId) {
        await badgeCategoryService.modifyBadgeCategory(
          badgeCategoryId,
          getBadgeCategoryModelNameValueList(badgeCategoryService.badgeCategory)
        );
      } else {
        badgeCategoryId = await badgeCategoryService.registerBadgeCategory(
          fromBadgeCategoryCdoModel(badgeCategoryService.badgeCategory)
        );
      }
      alert(AlertModel.getSaveSuccessAlert());
      badgeCategoryService.clearBadgeCategory();
      badgeCategoryService.clearFileName();

      this.routeToBadgeCategoryDetail(badgeCategoryId);
    }
  }

  badgeCategoryValidationCheck(): boolean {
    //
    const { badgeCategory } = this.injected.badgeCategoryService;
    let validation: boolean;

    if (!isDefaultPolyglotBlank(badgeCategory.langSupports, badgeCategory.name)) {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredInputAlert('Badge ?????????'));
      return validation;
    }

    if (badgeCategory.iconPath != null && badgeCategory.iconPath !== '') {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredChoiceAlert('Badge ?????? ?????? Image'));
      return validation;
    }

    if (badgeCategory.backgroundImagePath != null && badgeCategory.backgroundImagePath !== '') {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredChoiceAlert('Badge ?????? Image'));
      return validation;
    }

    if (
      badgeCategory.themeColor != null &&
      badgeCategory.themeColor !== '' &&
      (badgeCategory.themeColor === BadgeCategoryThemeColor.Blue ||
        badgeCategory.themeColor === BadgeCategoryThemeColor.Yellow ||
        badgeCategory.themeColor === BadgeCategoryThemeColor.Green ||
        badgeCategory.themeColor === BadgeCategoryThemeColor.Red ||
        badgeCategory.themeColor === BadgeCategoryThemeColor.SkyBlue ||
        badgeCategory.themeColor === BadgeCategoryThemeColor.Orange ||
        badgeCategory.themeColor === BadgeCategoryThemeColor.LightGreen ||
        badgeCategory.themeColor === BadgeCategoryThemeColor.Purple)
    ) {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredChoiceAlert('Theme Color'));
      return validation;
    }

    if (badgeCategory.topImagePath != null && badgeCategory.topImagePath !== '') {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredChoiceAlert('Top Image'));
      return validation;
    }

    return validation;
  }

  changeBadgeCategoryProps(name: string, value: any): void {
    //
    const { badgeCategoryService } = this.injected;
    badgeCategoryService.changeBadgeCategoryProps(name, value);
  }

  async uploadFile(file: File, name: 'iconPath' | 'topImagePath' | 'backgroundImagePath') {
    //
    const fileSize = new FileSizeModel();

    switch (name) {
      case 'iconPath': {
        fileSize.init(54, 54);
        break;
      }
      case 'topImagePath': {
        fileSize.init(58, 24);
        break;
      }
      case 'backgroundImagePath': {
        fileSize.init(232, 232);
        break;
      }
    }

    if (!file || (file instanceof File && !this.validatedAll(file)) || !(await fileSizeValidate(file, fileSize))) {
      return;
    }

    const { badgeCategoryService, sharedService } = this.injected;

    if (badgeCategoryService) {
      if (file.size >= 1024 * 1024 * 0.3) {
        alert(AlertModel.getCustomAlert(true, '??????', '300KB ????????? ????????? ???????????????', '??????', () => {}));

        return;
      }
      badgeCategoryService.changeFileName(file.name, name);
      const filePath = sharedService.uploadFile(file, FileUploadType.Badge);
      filePath.then((value) => {
        badgeCategoryService.changeBadgeCategoryProps(name, value);
      });
    }
  }

  validatedAll(file: File) {
    const validations = [{ type: 'Extension', validValue: EXTENSION.IMAGE }, { type: ValidationType.MaxSize }] as any[];
    // if (this.props.validations && Array.isArray(this.props.validations)) {
    //   validations = validations.map(defaultValidation => {
    //     const customValidation = this.props.validations!.find(validation => defaultValidation.type === validation.type);
    //     return customValidation || defaultValidation;
    //   });
    // }

    const hasNonPass = validations.some((validation) => {
      if (validation.validator && typeof validation.validator === 'function') {
        return !validation.validator(file);
      } else {
        if (!validation.type || !validation.validValue) {
          // console.warn('validations??? type??? validValue?????? ?????????????????? validator??? ??????????????????.'); TODO: default size ?????? ??????
          return false;
        }
        return !fileUtil.validate(file, validation.type, validation.validValue);
      }
    });

    return !hasNonPass;
  }

  routeToBadgeCategoryList(): void {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/certification-management/badgeCategory/badge-category-list`
    );
  }

  routeToBadgeCategoryDetail(badgeCategoryId: string) {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/certification-management/badgeCategory/badge-category-create/${badgeCategoryId}`
    );
  }

  async isUpdatableCheck(val: boolean): Promise<void> {
    //
    this.setState({ isUpdatable: val });
    if (!val) {
      await this.findBadgeCategoryById(this.props.match.params.badgeCategoryId);
    }
  }

  render() {
    //
    const { badgeCategory, fileName, backGroundFileName, topIconFileName } = this.injected.badgeCategoryService;
    const { isUpdatable } = this.state;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.badgeCategorySections} />

        <Polyglot languages={badgeCategory.langSupports}>
          <Form>
            <SubActions form>
              <DetailBadgeCategoryManagementView
                changeBadgeCategoryProps={this.changeBadgeCategoryProps}
                uploadFile={this.uploadFile}
                badgeCategory={badgeCategory}
                fileName={fileName}
                backGroundName={backGroundFileName}
                topIconFileName={topIconFileName}
                isUpdatable={isUpdatable}
              />
              <SubActions.Left>
                {(this.props.match.params.badgeCategoryId && !this.state.isUpdatable && (
                  <Button onClick={() => this.isUpdatableCheck(true)} primary>
                    ??????
                  </Button>
                )) ||
                  (this.props.match.params.badgeCategoryId && (
                    <Button onClick={() => this.isUpdatableCheck(false)}> ?????? </Button>
                  ))}
              </SubActions.Left>
              <SubActions.Right>
                <BadgeCategoryGuideModal trigger={<Button basic>Badge ?????? ?????? Guide</Button>} />
                <Button basic href={`${process.env.PUBLIC_URL}/resources/BadgeTemplate.zip`}>
                  ????????? ????????????
                </Button>
                <Button basic onClick={this.routeToBadgeCategoryList}>
                  ??????
                </Button>
                {this.props.match.params.badgeCategoryId && !this.state.isUpdatable && (
                  <BadgeCategoryPreviewModal badgeCategoryId={this.props.match.params.badgeCategoryId} />
                )}
                <Button disabled={!isUpdatable} primary onClick={this.saveBadgeCategory}>
                  ??????
                </Button>
              </SubActions.Right>
            </SubActions>
          </Form>
        </Polyglot>
      </Container>
    );
  }
}

export default CreateBadgeCategoryManagementContainer;
