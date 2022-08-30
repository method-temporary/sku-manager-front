import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import UserCubeService from '../../present/logic/UserCubeService';
import CreateBasicInfoView from '../view/CreateBasicInfoView';
import CubeService from '../../present/logic/CubeService';
import SearchTagRdo from '../../../board/searchTag/model/SearchTagRdo';
import { CollegeService } from '../../../../college';
import { UserWorkspaceService } from '../../../../userworkspace';

interface Props {
  readonly?: boolean;
}

interface States {}

interface Injected {
  userCubeService: UserCubeService;
  cubeService: CubeService;
  collegeService: CollegeService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('userCubeService', 'cubeService', 'collegeService', 'userWorkspaceService')
@observer
@reactAutobind
class CreateBasicInfoContainer extends ReactComponent<Props, States, Injected> {
  //

  componentDidMount() {
    //
  }

  addAllSharedCineroomId(checked: boolean): void {
    //
    const { cubeService, userWorkspaceService } = this.injected;
    const { allUserWorkspaces } = userWorkspaceService;

    if (checked) {
      cubeService.changeCubeProps(
        'sharingCineroomIds',
        allUserWorkspaces.map((userWorkspace) => userWorkspace.id)
      );
    } else {
      cubeService.changeCubeProps('sharingCineroomIds', []);
    }
  }

  addSharedCineroomId(cineroomId: string): void {
    //
    const { cubeService } = this.injected;
    const targetSharingCineroomIds = [...cubeService.cube.sharingCineroomIds];
    if (targetSharingCineroomIds.some((id) => id === cineroomId)) {
      targetSharingCineroomIds.splice(targetSharingCineroomIds.indexOf(cineroomId), 1);
    } else {
      targetSharingCineroomIds.push(cineroomId);
    }
    cubeService.changeCubeProps('sharingCineroomIds', targetSharingCineroomIds);
  }

  onChangeCubeProps(name: string, value: any): void {
    const { cubeService } = this.injected;
    cubeService.changeCubeProps(name, value);
  }

  async onChangeTagPropsWithAutoComplete(name: string, value: any): Promise<void> {
    const { cubeService } = this.injected;
    this.onChangeCubeProps(name, value);

    if (name === 'cubeContents.tag' && typeof value === 'string' && value !== '') {
      // 자동완성
      cubeService.clearSearchTags();

      const searchTagRdo: SearchTagRdo = {
        startDate: 0,
        endDate: 9999999999999,
        tag: value,
        keywords: '',
        creator: '',
        modifier: '',
        text: '',
        limit: 10,
        offset: 0,
        searchType: 'TAG',
      };
      await cubeService.findAllSearchTagByTag(searchTagRdo);
    }
  }

  addCubeTagsProps(value: string) {
    //
    const { cubeService } = this.injected;
    if (value === '') {
      cubeService.clearSearchTags();
    } else {
      //TODO: Tag AutoComplete
      // const targetTags = [...cubeService.cube.cubeContents.tags];
      // if (!targetTags.some((tag) => tag === value)) {
      //   targetTags.push(value);
      //   cubeService.changeCubeProps('cubeContents.tags', targetTags);
      // }
    }
    this.onChangeCubeProps('cubeContents.tag', '');
    cubeService.clearSearchTags();
  }

  setHourAndMinute(name: string, value: number) {
    //
    if (value < 0) value = 0;
    let hours: number = 0;
    let minutes: number = 0;
    Promise.resolve()
      .then(() => {
        if (name === 'hour') {
          if (value >= 1000) value = 999;
          hours = value;
        }
        if (name === 'minute') {
          if (value >= 60) value = 59;
          minutes = value;
        }
      })
      .then(() => this.setLearningTime(hours, minutes));
  }

  setLearningTime(hour: number, minute: number) {
    //
    const { cubeService } = this.injected;

    const numberHour = Number(hour);
    const numberMinute = Number(minute);
    const newMinute = numberHour * 60 + numberMinute;
    cubeService.changeCubeProps('learningTime', newMinute);
  }

  removeCubeTagsProps(index: number) {
    //
    const { cubeService } = this.injected;
    //TODO: Create관리 Tag 삭제로직
    const targetTags = cubeService.cube.cubeContents.tags;
    // targetTags.splice(index, 1);
    cubeService.changeCubeProps('cubeContents.tags', targetTags);
  }

  onSelectInstructor(index: number, name: string, value: boolean): void {
    const { cubeService } = this.injected;
    cubeService.cubeInstructors.forEach((cubeInstructor, index) => {
      if (cubeInstructor.representative) {
        cubeService.changeTargetCubeInstructorProp(index, 'representative', false);
      }
    });

    cubeService.changeTargetCubeInstructorProp(index, name, value);
  }

  onDeleteInstructor(index: number): void {
    const { cubeService } = this.injected;
    cubeService.deleteTargetCubeInstructor(index);
  }

  render() {
    const { readonly } = this.props;
    const { cubeService, collegeService, userWorkspaceService } = this.injected;
    const { allUserWorkspaces } = userWorkspaceService;
    const { searchTags, cube } = cubeService;

    return (
      <CreateBasicInfoView
        onChangeCubeProps={this.onChangeCubeProps}
        onChangeTagPropsWithAutoComplete={this.onChangeTagPropsWithAutoComplete}
        addCubeTagsProps={this.addCubeTagsProps}
        removeCubeTagsProps={this.removeCubeTagsProps}
        addAllSharedCineroomId={this.addAllSharedCineroomId}
        addSharedCineroomId={this.addSharedCineroomId}
        cube={cube}
        userWorkspaces={allUserWorkspaces}
        searchTags={searchTags}
        readonly={readonly}
        cubeService={cubeService}
        collegeService={collegeService}
      />
    );
    // }
  }
}

export default CreateBasicInfoContainer;
