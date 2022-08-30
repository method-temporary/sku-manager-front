import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import depot from '@nara.drama/depot';
import { CubeDiscussionService } from '../../../../cubetype';
import AdditionalInfoForDiscussionView from '../view/AdditionalInfoForDiscussionView';
import { RelatedUrl } from '../../model/vo/RelatedUrl';

interface Props extends RouteComponentProps {
  cubeType?: string;
  filesMap: Map<string, any>;
  readonly?: boolean;
}

interface Injected {
  cubeDiscussionService: CubeDiscussionService;
}

@inject('cubeDiscussionService')
@observer
@reactAutobind
class CubeDiscussionContainer extends ReactComponent<Props, {}, Injected> {
  //
  handleOnChangeCubeDiscussionProps(name: string, value: string | boolean) {
    //
    const { cubeDiscussionService } = this.injected;
    cubeDiscussionService.changeCubeDiscussionProps(name, value);

    switch (name) {
      //  비공개 일 때 대댓글 개수 제한 0개로 설정
      case 'privateComment':
        if (value) {
          this.onChangeCubeDiscussionCountProps('completionCondition.subCommentCount', '0');
        }
        break;
    }
  }

  onChangeCubeDiscussionCountProps(name: string, value: string) {
    let val = value;
    if (val === '') {
      val = '0';
    } else if (value.startsWith('0') && value !== '0') {
      val = value.substr(1);
    }
    this.handleOnChangeCubeDiscussionProps(name, val);
  }

  onChangeCubeDiscussionContentProps(name: string, value: any): void {
    //
    const { cubeDiscussionService } = this.injected;
    const invalid = value.length > 100;
    if (invalid) {
      return;
    }

    cubeDiscussionService.changeCubeDiscussionProps(name, value);
  }

  onClickAddRelatedUrl() {
    //
    const { cubeDiscussion, changeCubeDiscussionProps } = this.injected.cubeDiscussionService;

    const newRelatedUrls = [...cubeDiscussion.relatedUrlList, new RelatedUrl()];

    changeCubeDiscussionProps('relatedUrlList', newRelatedUrls);
  }

  onClickRemoveRelatedUrl(index: number) {
    //
    const { cubeDiscussion, changeCubeDiscussionProps } = this.injected.cubeDiscussionService;

    const newRelatedUrls = this.removeInList(index, [...cubeDiscussion.relatedUrlList]);

    changeCubeDiscussionProps('relatedUrlList', newRelatedUrls);
  }

  removeInList(index: number, oldList: RelatedUrl[]) {
    //
    return oldList.slice(0, index).concat(oldList.slice(index + 1));
  }

  getFileBoxIdForCubeDiscussion(fileBoxId: string) {
    //
    const { cubeDiscussionService } = this.injected;
    // const { cubeIntro } = cubeService || {} as CubeIntroService;
    // todo 파일 삭제했을때 로직
    if (cubeDiscussionService) {
      cubeDiscussionService.changeCubeDiscussionProps('depotId', fileBoxId);
    }
  }

  findFiles(type: string, fileBoxId: string) {
    const filesMap: Map<string, any> = new Map<string, any>();
    depot.getDepotFiles(fileBoxId).then((files) => {
      filesMap.set(type, files);
      const newMap = new Map(filesMap.set(type, files));
      return newMap;
    });
    return filesMap;
  }

  render() {
    const { cubeDiscussion } = this.injected.cubeDiscussionService;
    const { readonly } = this.props;
    return (
      <AdditionalInfoForDiscussionView
        handleOnChangeCubeDiscussionProps={this.handleOnChangeCubeDiscussionProps}
        // onChangeCubeDiscussionCountProps={this.onChangeCubeDiscussionCountProps}
        // onChangeCubeDiscussionContentProps={this.onChangeCubeDiscussionContentProps}
        onClickAddRelatedUrl={this.onClickAddRelatedUrl}
        onClickRemoveRelatedUrl={this.onClickRemoveRelatedUrl}
        cubeDiscussion={cubeDiscussion}
        // getFileBoxIdForCubeDiscussion={this.getFileBoxIdForCubeDiscussion}
        cubeType={this.props.cubeType}
        readonly={readonly}
      />
    );
  }
}

export default withRouter(CubeDiscussionContainer);
