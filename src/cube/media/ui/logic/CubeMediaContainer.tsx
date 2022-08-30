import React from 'react';
import { inject, observer } from 'mobx-react';
import { Moment } from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { CubeType } from 'shared/model';
import { RoleConfirm } from 'shared/ui';
import { CourseraCourseListModal } from 'cube/linkedInCoursera/coursera/modal/CourseraCourseListModal';
import { LinkedInCourseListModal } from 'cube/linkedInCoursera/linkedIn/modal/LinkedInCourseListModal';

import { CollegeService } from '../../../../college';
import MediaService from '../../present/logic/MediaService';
import AdditionalInfoForMediaView from '../view/AdditionalInfoForMediaView';

interface Props {
  cubeType: CubeType;
  readonly?: boolean;
}

interface States {}

interface Injected {
  mediaService: MediaService;
  collegeService: CollegeService;
}

@inject('mediaService', 'collegeService')
@observer
@reactAutobind
class CubeMediaContainer extends ReactComponent<Props, States, Injected> {
  //
  componentDidMount() {
    this.findAllCollegesForPanopto();
  }

  async findAllCollegesForPanopto() {
    //
    const { collegeService } = this.injected;
    const role = RoleConfirm.getRoleByCurrentCineroom();
    if (role === 'SuperManager' && collegeService) {
      await collegeService.findAllCollegesForPanopto();
    } else if (collegeService) await collegeService.findCollegesByCineroomId();
  }

  onChangeMediaProps(name: string, value: string | Date, nameSub?: string) {
    //
    const { mediaService } = this.injected;
    if (mediaService) mediaService.changeMediaProps(name, value);
    if (mediaService && value instanceof Date) {
      mediaService.changeMediaProps(name, value);
    }
    if (mediaService) {
      mediaService.changeMediaProps(name, value);
    }
  }

  onChangeMediaDateProps(name: string, value: Moment) {
    //
    const { mediaService } = this.injected;
    if (mediaService) mediaService.changeMediaDateProps(name, value);
  }

  goToVideo(url: string) {
    //
    window.open(url);
  }

  render() {
    //
    const { media } = this.injected.mediaService;
    const { cubeType, readonly } = this.props;

    return (
      <>
        <AdditionalInfoForMediaView
          media={media}
          onChangeMediaProps={this.onChangeMediaProps}
          onChangeMediaDateProps={this.onChangeMediaDateProps}
          cubeType={cubeType.toString()}
          goToVideo={this.goToVideo}
          readonly={readonly}
        />
        <CourseraCourseListModal
          modalTitle="Coursera 강의 조회"
          contentProviderId={media.mediaContents.contentsProvider.contentsProviderType.id}
        />
        <LinkedInCourseListModal
          modalTitle="LinkedIn 강의 조회"
          contentProviderId={media.mediaContents.contentsProvider.contentsProviderType.id}
        />
      </>
    );
  }
}

export default CubeMediaContainer;
