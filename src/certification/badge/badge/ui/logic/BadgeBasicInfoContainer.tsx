import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { fileUtil, ValidationType } from '@nara.drama/depot';

import { FileUploadType, FileSizeModel, SelectTypeModel } from 'shared/model';
import { sharedService } from 'shared/present';
import { alert, AlertModel } from 'shared/components';
import { fileSizeValidate } from 'shared/helper';

import { BadgeModel } from '_data/badge/badges/model';

import { CollegeService } from '../../../../../college';
import BadgeBasicInfoView from '../view/BadgeBasicInfoView';
import BadgeService from '../../present/logic/BadgeService';

interface Props extends RouteComponentProps<Params> {
  isUpdatable: boolean;
  badge: BadgeModel;
  changeBadgeQueryProp: (name: string, value: any) => void;
  clearBadgeQuery: () => void;
  badgeCategoryMap: Map<string, string>;
  creatorCineroomId?: string;
}

interface Params {
  cineroomId: string;
}

interface State {
  collegeSelect: SelectTypeModel[];
}

interface Injected {
  collegeService: CollegeService;
  badgeService: BadgeService;
}

const ICON_EXTENSION = {
  IMAGE: 'jpg|png|jpeg|svg|JPG|PNG|JPEG|SVG',
};

@inject('collegeService', 'badgeService')
@observer
@reactAutobind
class BadgeBasicInfoContainer extends ReactComponent<Props, State, Injected> {
  //
  state: State = {
    collegeSelect: [],
  };

  async componentDidMount() {
    //
    await this.setCollegeSelectType();
  }

  async setCollegeSelectType() {
    //
    const { collegeService } = this.injected;
    const collegesSelectByCineroom: SelectTypeModel[] = [];

    await collegeService.findAllCollegeList();

    collegeService.collegeList?.forEach((college) => {
      collegesSelectByCineroom.push(new SelectTypeModel(college.key, college.text, college.value));
    });

    if (collegesSelectByCineroom.length === 1) {
      const { changeBadgeQueryProp } = this.props;
      changeBadgeQueryProp('collegeId', collegesSelectByCineroom[0].value);
    }

    this.setState({ collegeSelect: collegesSelectByCineroom });
  }

  onChangeSelectIssueAutomatically(event: any, data: any) {
    //
    const { changeBadgeQueryProp } = this.props;

    changeBadgeQueryProp('issueAutomatically', data);
    changeBadgeQueryProp('additionalRequirementsNeeded', false);
  }

  async uploadFile(file: File) {
    //
    const fileSize = new FileSizeModel();
    fileSize.init(50, 50);

    if (!file || (file instanceof File && !this.validatedAll(file)) || !(await fileSizeValidate(file, fileSize))) {
      return;
    }
    const { changeBadgeQueryProp } = this.props;

    if (file.size >= 1024 * 1024 * 0.3) {
      alert(AlertModel.getCustomAlert(true, '알림', '300KB 이하만 업로드 가능합니다', '확인'));
      return;
    }

    changeBadgeQueryProp('fileName', file.name);

    sharedService
      .uploadFile(file, FileUploadType.Badge)
      .then((url) => {
        if (!url) {
          alert(AlertModel.getCustomAlert(true, '알림', '업로드가 실패했습니다.', '확인'));
        } else {
          changeBadgeQueryProp('iconUrl', url);
        }
      })
      .catch(() => {
        alert(AlertModel.getCustomAlert(true, '알림', '업로드가 실패했습니다.', '확인'));
      });
  }

  validatedAll(file: File) {
    const validations = [
      { type: 'Extension', validValue: ICON_EXTENSION.IMAGE },
      { type: ValidationType.MaxSize, validValue: 30 * 1024 }, // 30k
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

  render() {
    //
    const { collegeService } = this.injected;
    const { isUpdatable, badgeCategoryMap } = this.props;
    const { badge, changeBadgeQueryProp } = this.props;
    const { cineroomId } = this.props.match.params;
    const { collegeSelect } = this.state;

    return (
      <BadgeBasicInfoView
        isUpdatable={isUpdatable}
        badge={badge}
        onChangeSelectIssueAutomatically={this.onChangeSelectIssueAutomatically}
        changeBadgeQueryProp={changeBadgeQueryProp}
        badgeCategoryMap={badgeCategoryMap}
        uploadFile={this.uploadFile}
        cineroomId={cineroomId}
        collegeSelect={collegeSelect}
        collegeMap={collegeService.collegesMap}
      />
    );
  }
}

export default withRouter(BadgeBasicInfoContainer);
