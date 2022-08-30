import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, reactAlert } from '@nara.platform/accent';

import { depotService, DepotUploadType } from 'shared/present';

import TranscriptFormListView from '../view/TranscriptFormListView';
import { CollegeService } from '../../../college';
import SubtitleService from '../../subtitle/present/logic/SubtitleService';
import TranscriptService from '../../subtitle/present/logic/TranscriptService';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  collegeService?: CollegeService;
  subtitleService?: SubtitleService;
  transcriptService?: TranscriptService;
}

@inject('collegeService', 'subtitleService', 'transcriptService')
@observer
@reactAutobind
class TranscriptListContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount(): void {
    const { collegeService } = this.props;
    if (collegeService != null) {
      if (collegeService.collegeList.length == 0) {
        collegeService.findAllCollegeList();
      }
    }
  }

  public changePanoptoId(deliveryId: string) {
    const { subtitleModel } = this.props.subtitleService!;

    subtitleModel.deliveryId = deliveryId;

    //reactAlert({ title: '안내', message: deliveryId });
  }

  public changeLanguage(locale: string) {
    const { subtitleModel } = this.props.subtitleService!;

    subtitleModel.locale = locale;

    //reactAlert({ title: '안내', message: deliveryId });
  }

  async uploadFile(file: File, func?: any) {
    //
    const { subtitleModel } = this.props.subtitleService!;
    if (!file || (file instanceof File && !this.validatedAll(file))) {
      alert('srt자막파일만 업로드 가능합니다.');
      return;
    }

    if (file.size >= 1024 * 1024 * 0.3) {
      alert('300KB 이하만 업로드 가능합니다.');
      return;
    }

    const { srtUpload } = this.props.transcriptService!;

    await depotService.uploadFile(file, DepotUploadType.Question);
    await srtUpload(subtitleModel.deliveryId, file, subtitleModel.locale)
      .then((url) => {
        if (!url) {
          reactAlert({ title: '알림', message: '업로드가 실패했습니다.' });
        } else {
          subtitleModel.fileName = file.name;
          subtitleModel.fileSize = file.size.toString();
          subtitleModel.creatorId = patronInfo.getPatronEmail() || '';
          subtitleModel.modifierId = patronInfo.getPatronEmail() || '';
          subtitleModel.locale = subtitleModel.locale;
          subtitleModel.url = url;
          this.props.subtitleService?.registerSubtitle().then((response: any) => {
            if (response != '') {
              reactAlert({
                title: '안내',
                message: '자막 저장이 성공했습니다.',
              });

              if (func) {
                // 2021.03.23 기준 Modal popup 업로드 버튼 클릭 시, TranscriptManagerModal.findTranscriptList 세팅 중
                func(0, subtitleModel.locale);
              }
            } else {
              reactAlert({
                title: '안내',
                message: '자막 저장이 실패했습니다.',
              });
            }
          });
        }
      })
      .catch(() => {
        reactAlert({ title: '알림', message: '업로드가 실패했습니다.' });
      });
  }

  async removeDeliveryIdLocale(func?: any) {
    const { removeTranscriptByDeliveryIdLocale } = this.props.transcriptService!;
    const { subtitleModel, removeSubtitle } = this.props.subtitleService!;
    const deliveryId = subtitleModel.deliveryId;
    const locale = subtitleModel.locale;

    await removeTranscriptByDeliveryIdLocale(deliveryId, locale)
      .then((res: any) => {
        removeSubtitle().then((response: any) => {
          if (response != '') {
            reactAlert({
              title: '안내',
              message: '삭제 되었습니다.',
            });

            if (func) {
              // 2021.03.23 기준 Modal popup 업로드 버튼 클릭 시, TranscriptManagerModal.findTranscriptList 세팅 중
              func(0, locale);
            }
          } else {
            reactAlert({
              title: '안내',
              message: '삭제 실패했습니다.',
            });
          }
        });
      })
      .catch(() => {
        reactAlert({ title: '알림', message: '삭제 실패했습니다.' });
      });
  }

  validatedAll(file: File) {
    const ext = file.name.split('.').pop();
    if (ext == 'srt') {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { collegeService } = this.props;
    const { subtitleModel } = this.props.subtitleService!;
    const { changeTranscriptModalOpen } = this.props.transcriptService || ({} as TranscriptService);
    return (
      <TranscriptFormListView
        uploadFile={this.uploadFile}
        removeDeliveryIdLocale={this.removeDeliveryIdLocale}
        subtitleModel={subtitleModel}
        changePanoptoId={this.changePanoptoId}
        changeLanguage={this.changeLanguage}
      />
    );
  }
}
export default withRouter(TranscriptListContainer);
