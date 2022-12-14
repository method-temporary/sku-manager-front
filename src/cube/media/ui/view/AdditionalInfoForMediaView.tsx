import $ from 'jquery';
import * as React from 'react';
import { Checkbox, Form, Icon, Input, Select, Table, Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment, { Moment } from 'moment';
import { inject, observer } from 'mobx-react';

import { reactAlert, reactAutobind } from '@nara.platform/accent';

import { CubeType, SelectType } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { dateTimeHelper } from 'shared/helper';

import { ClassroomGroupService } from '../../../classroom';
import MediaService from '../../present/logic/MediaService';
import PanoptoListModal from '../logic/PanoptoListModal';
import PanoptoFolderNameList from '../logic/PanoptoFolderNameList';
import { CollegeService, ContentsProviderService } from '../../../../college';
import { MediaType } from '../../model/vo/MediaType';
import { InternalMediaConnectionModel } from '../../model/old/InternalMediaConnectionModel';
import { MediaModel } from '../../model/MediaModel';
import ContentsProviderSelectContainer from '../logic/ContentsProviderSelectContainer';
import { findAllQuiz } from '../../../../cubetype/quiz/api/QuizApi';
import QuizTableList from '../../../../cubetype/quiz/model/QuizTableList';
import QuizInfoListView from '../../../../cubetype/media/ui/view/QuizInfoListView';
import CreateQuizModalContainer from '../../../../cubetype/quiz/ui/logic/CreateQuizModalContainer';
import LinkedInCourseListModalStore from '../../../linkedInCoursera/linkedIn/modal/LinkedInCourseListModal.store';
import CourseraCourseListModalStore from '../../../linkedInCoursera/coursera/modal/CourseraCourseListModal.store';

interface Props {
  classroomGroupService?: ClassroomGroupService;
  mediaService?: MediaService;
  collegeService?: CollegeService;
  contentsProviderService?: ContentsProviderService;
  onChangeMediaProps: (name: string, value: string | Date, nameSub?: string) => void;
  onChangeMediaDateProps: (name: string, value: Moment) => void;
  media: MediaModel;
  cubeType: string;
  goToVideo: (url: string) => void;
  readonly?: boolean;
}

interface States {
  panoptoListModalOpen: boolean;
  createQuizModalOpen: boolean;
  folderId: string;
  quizInfoList: QuizTableList[];
  updateQuiz: QuizTableList | undefined;
}

@inject('classroomGroupService', 'mediaService', 'collegeService', 'contentsProviderService')
@observer
@reactAutobind
class AdditionalInfoForMediaView extends React.Component<Props, States> {
  //
  isSingleUpload = true;
  externalId: string = '';
  uploadUrl: string = 'https://panopto.mysuni.sk.com/pt/s3_upload_once';
  cookie: string = '';
  uploadResult: any[] = [];

  uploadFiles: any[] = [];
  sessionNames: any[] = [];
  ing: boolean = false;
  value: string = '';

  $drop: any = null;

  $progressBar: any = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      panoptoListModalOpen: false,
      createQuizModalOpen: false,
      folderId: '',
      quizInfoList: [],
      updateQuiz: undefined,
    };
  }

  componentDidUpdate(): void {
    //
    const { collegeService } = this.props;
    const { collegesForPanopto } = collegeService || ({} as CollegeService);
    if (collegeService && collegesForPanopto && collegesForPanopto.length === 1)
      collegeService.setCollegeForPanopto(collegesForPanopto[0]);
    const { media } = this.props.mediaService!;
    if (media && media.mediaType === MediaType.InternalMedia) {
      this.$drop = $('#drop');
      this.$progressBar = $('#progressBar');

      this.$drop
        .on('dragenter', (e: any) => {
          //????????? ????????? ???????????????
          $(e.target).addClass('drag-over');
        })
        .on('dragleave', (e: any) => {
          //????????? ????????? ????????????
          $(e.target).removeClass('drag-over');
        })
        .on('dragover', (e: any) => {
          e.stopPropagation();
          e.preventDefault();
        })
        .on('drop', (e: any) => {
          e.preventDefault();
          $(e.target).removeClass('drag-over');
          const files = e.originalEvent.dataTransfer.files;
          let len = files.length;
          if (this.isSingleUpload) len = 1;
          for (let i = 0; i < len; i++) {
            const file = files[i];
            if (this.isSingleUpload) this.uploadFiles = [];
            const size = this.uploadFiles.push(file);
            this.preview(file, size - 1);
          }
        });

      const uploadStatus = {
        total: 0,
        count: 0,
      };
      $('#btnSubmit').on('click', (e) => {
        if (!this.ing) {
          let nextStep = true;
          $('input[name=sessionNames]').each((i: number, item: any) => {
            if (item.value === '') {
              alert('???????????? ??????????????????.');
              nextStep = false;
            } else {
              this.sessionNames.push(item.value);
            }
          });
          if (nextStep) {
            this.value = '????????? ????????? ????????????.';

            $.each(this.uploadFiles, (i, file) => {
              if (file.upload !== 'disable') uploadStatus.total++;
            });
            this.eachUpload();
          }
        }
      });
      this.$progressBar = $('#progressBar');

      $('#thumbnails').on('click', '.close', (e) => {
        const $target = $(e.target);
        const idx: number = Number($target.attr('data-idx'));
        this.uploadFiles[idx].upload = 'disable';
        $target.parent().remove();
      });
    }
  }

  eachUpload() {
    const file = this.uploadFiles.shift();

    const sessionName = this.sessionNames.shift();
    if (file === undefined) {
      setTimeout(() => {
        /* #############################
         *###############################
         *###############################
         *###### ?????? ??? ?????? ?????? ?????? ???. #####
         */

        /*
        *###############################
        *###############################
        ###############################*/

        // iframe ??? ?????? parent.????????? ??????
        // local broswer ??? ?????? ?????? ????????? ?????? ??????
        $('.thumb').remove();
        this.ing = false;
        $('#btnSubmit').val('?????????');
        this.setProgress(0);
        this.uploadResult = [];
      }, 300);
      return;
    }
    if (file.upload === 'disable') {
      this.eachUpload();
      return;
    }
    const formData = new FormData();
    formData.append('uploadfile', file, file.name);
    formData.append('sessionNames', sessionName);
    formData.append('folderId', this.state.folderId);
    formData.append('externalId', this.externalId);
    formData.append('cookie', this.cookie);
    const $selfProgress = file.target.find('progress'); //File ????????? ???????????? ????????? DOM??? progress ????????? ?????????.

    const clazzThis = this;
    $.ajax({
      url: this.uploadUrl,
      data: formData,
      type: 'post',
      contentType: false,
      processData: false,
      xhr() {
        //XMLHttpRequest ????????? ??????
        // @ts-ignore
        const xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = (e) => {
          //progress ????????? ????????? ??????
          const percent = (e.loaded * 100) / e.total;
          $selfProgress.val(percent); //?????? ????????? ?????????????????? ??????
        };
        return xhr;
      },
      success(ret) {
        // setTimeout(clazzThis.eachUpload, 500); //?????? ?????? ?????????
        clazzThis.setData(ret);
        reactAlert({ title: '??????', message: '???????????? ?????????????????????.' });
        if (ret.boolResult) clazzThis.uploadResult.push(ret.obj.list);
      },
    });
  }

  preview(file: File, idx: number) {
    const reader = new FileReader();
    reader.onload = ((f: any, idx: number) => (e: any) => {
      const $div = $(
        '<div class="thumb">\n' +
          '?????????:<input type="text" name="sessionNames" value="" placeholder="?????????"> <p class="file_name">?????????: ' +
          f.name +
          ' </p>\n' +
          '<a class="close" data-idx="' +
          idx +
          '">x</a>\n' +
          '<progress value="0" max="100" ></progress>\n' +
          '</div>'
      );
      if (this.isSingleUpload) $('#thumbnails').html('');
      $('#thumbnails').append($div);
      f.target = $div;
    })(file, idx);
    reader.readAsDataURL(file);
  }

  setProgress(per: any) {
    this.$progressBar.val(per);
  }

  setData(ret: any) {
    const { mediaService } = this.props;
    if (mediaService && ret.boolResult && ret.obj && ret.obj.list) {
      const internalMediaList: InternalMediaConnectionModel[] = [...mediaService.uploadedPaonoptos];
      if (Array.isArray(ret.obj.list)) {
        Promise.resolve()
          .then(() => {
            ret.obj.list.map((list: any) => {
              const internalMedia = new InternalMediaConnectionModel();
              internalMedia.panoptoSessionId = list.id;
              internalMedia.viewUrl = list.viewerUrl.replace('Viewer', 'Embed');
              internalMedia.thumbUrl = list.viewerUrl.replace('Viewer', 'Embed');
              internalMedia.name = list.name;
              internalMedia.startTime = list.startTime;
              internalMedia.folderName = list.folderName;
              internalMedia.duration = list.duration;
              internalMedia.folderId = list.folderId;
              internalMediaList.push(internalMedia);
            });
          })
          .then(() => {
            const newInternalMedias: InternalMediaConnectionModel[] = [
              ...mediaService.media.mediaContents.internalMedias,
            ];
            mediaService.setUploadedPanoptos(internalMediaList);
            mediaService.changeMediaProps('mediaContents.internalMedias', internalMediaList.concat(newInternalMedias));
          });
      }
    }
  }

  showPanoptoListModal(open: boolean) {
    //
    this.setState({ panoptoListModalOpen: open });
  }

  showCreateQuizModal(open: boolean) {
    this.setState({ createQuizModalOpen: open });
    this.setState({ updateQuiz: undefined });
  }

  makeCollegeOption() {
    const { collegeService } = this.props;
    const { collegesForPanopto } = collegeService || ({} as CollegeService);
    const collegeOption: any[] = [];
    collegesForPanopto.map((college, index) => {
      collegeOption.push({ key: index, text: getPolyglotToAnyString(college.name), value: college.panoptoFolderId });
    });

    return collegeOption;
  }

  onClickExpiryUnlimited() {
    const { media, onChangeMediaDateProps } = this.props;

    if (media) {
      if (media.mediaContents.contentsProvider.expiryDateDot === String('2100.12.30')) {
        onChangeMediaDateProps('mediaContents.contentsProvider.expiryDateMoment', moment().startOf('day'));
      } else {
        onChangeMediaDateProps('mediaContents.contentsProvider.expiryDateMoment', moment('2100-12-30').startOf('day'));
      }
    }
  }

  findQuizData() {
    const { mediaService } = this.props;
    const quizIds = mediaService?.media?.mediaContents?.internalMedias[0]?.quizIds;
    const quizId = quizIds?.filter((row) => row !== undefined).join(',');
    return quizId && this.createQuizInfo(quizId);
  }

  async createQuizInfo(quizId: string) {
    const result = await findAllQuiz(quizId);
    return result;
  }

  updateQuizTable(quizTable: QuizTableList) {
    if (quizTable && quizTable !== undefined) {
      const { createQuizModalOpen } = this.state;
      this.setState({
        createQuizModalOpen: !createQuizModalOpen,
        updateQuiz: quizTable,
      });
    }
  }

  openProviderContentModal() {
    const { media } = MediaService.instance;

    if (media.mediaContents.contentsProvider.contentsProviderType.id === 'PVD00010') {
      const { setIsOpenLinkedInCourseListModal } = LinkedInCourseListModalStore.instance;
      setIsOpenLinkedInCourseListModal(true);
    } else if (media.mediaContents.contentsProvider.contentsProviderType.id === 'PVD0000w') {
      const { setIsOpenCourseraCourseListModal } = CourseraCourseListModalStore.instance;
      setIsOpenCourseraCourseListModal(true);
    }
  }

  render() {
    const {
      onChangeMediaProps,
      onChangeMediaDateProps,
      media,
      cubeType,
      goToVideo,
      mediaService,
      contentsProviderService,
      readonly,
    } = this.props;
    const { contentsProviders } = contentsProviderService!;
    const contentsProvider = contentsProviders.find(
      (cp) => cp.id === media?.mediaContents?.contentsProvider?.contentsProviderType?.id
    );
    const cpName = contentsProvider?.name?.ko;
    const { panoptoListModalOpen, folderId, createQuizModalOpen, quizInfoList, updateQuiz } = this.state;

    let mediaType = '';

    if (cubeType === CubeType.Video) {
      if (media.mediaType === MediaType.InternalMedia) {
        mediaType = '?????? ??????';
      } else if (media.mediaType === MediaType.LinkMedia) {
        mediaType = '?????? ??????';
      } else if (media.mediaType === MediaType.ContentsProviderMedia) {
        mediaType = 'cp??? ??????';
      }
    } else if (cubeType === CubeType.Audio) {
      if (media.mediaType === MediaType.InternalMedia) {
        mediaType = '?????? ?????????';
      } else if (media.mediaType === MediaType.LinkMedia) {
        mediaType = '?????? ?????????';
      } else if (media.mediaType === MediaType.ContentsProviderMedia) {
        mediaType = 'cp??? ?????????';
      }
    }
    return (
      <Table celled key={3}>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} className="title-header">
              ?????? ??????
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">
              ???????????? <span className="required">*</span>
              {!readonly && cubeType === CubeType.Video && <br />}
              {!readonly && cubeType === CubeType.Video && (
                <span style={{ color: 'red', fontSize: '12px', fontWeight: 300 }}>
                  ????????? ????????? ???????????? ?????? ????????? ????????? ?????? ??? ????????????. ?????? ????????? ????????? ????????? ???????????????,
                  ????????? ??????????????? ????????????.
                </span>
              )}
            </Table.Cell>
            <Table.Cell>
              {readonly ? (
                <span>{mediaType}</span>
              ) : (
                <>
                  <Form.Field
                    disabled={readonly}
                    control={Select}
                    placeholder="Select"
                    options={cubeType === CubeType.Video ? SelectType.kindOfVideo : SelectType.kindOfAudio}
                    value={media && media.mediaType}
                    onChange={(e: any, data: any) => onChangeMediaProps('mediaType', data.value)}
                  />
                  {(media && media.mediaType === MediaType.ContentsProviderMedia && (
                    <div style={{ marginBottom: '1em' }}>
                      <Form.Group>
                        <ContentsProviderSelectContainer
                          defaultValue={
                            media &&
                            media.mediaContents &&
                            media.mediaContents.contentsProvider &&
                            media.mediaContents.contentsProvider.contentsProviderType &&
                            media.mediaContents.contentsProvider.contentsProviderType.id
                          }
                          targetProps="mediaContents.contentsProvider.contentsProviderType.id"
                          type="media"
                        />
                        {(cubeType === CubeType.Video &&
                          (media.mediaContents.contentsProvider.contentsProviderType.id === 'PVD0000w' ||
                            media.mediaContents.contentsProvider.contentsProviderType.id === 'PVD00010') && (
                            <Form.Field control={Button} onClick={this.openProviderContentModal}>
                              ????????? ??????
                            </Form.Field>
                          )) ||
                          null}
                      </Form.Group>
                    </div>
                  )) ||
                    null}
                </>
              )}

              {media && media.mediaType === MediaType.LinkMedia ? (
                readonly ? (
                  <Form.Field>{(media && media.mediaContents && media.mediaContents.linkMediaUrl) || '-'}</Form.Field>
                ) : (
                  <Form.Field
                    width={16}
                    control={Input}
                    placeholder={
                      cubeType === CubeType.Video
                        ? '??????????????? ????????? ?????? ?????? ?????? ????????? ??????????????????.'
                        : '??????????????? ????????? ?????? ????????? ?????? ????????? ??????????????????.'
                    }
                    value={(media && media.mediaContents && media.mediaContents.linkMediaUrl) || ''}
                    onChange={(e: any) => onChangeMediaProps('mediaContents.linkMediaUrl', e.target.value)}
                  />
                )
              ) : (
                ''
              )}

              {media && media.mediaType === MediaType.InternalMedia ? (
                <>
                  {readonly ? null : (
                    <PanoptoFolderNameList cubeType={cubeType} showPanoptoListModal={this.showPanoptoListModal} />
                  )}
                  {
                    // selectedPanoptos && selectedPanoptos.length ?
                    (media &&
                      media.mediaContents &&
                      media.mediaContents.internalMedias &&
                      media.mediaContents.internalMedias.length &&
                      media.mediaContents.internalMedias.map((internalMedia, index) => (
                        <Table celled key={index}>
                          <colgroup>
                            <col width="60%" />
                            <col width="20%" />
                            <col width="20%" />
                          </colgroup>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell textAlign="center">??????</Table.HeaderCell>
                              <Table.HeaderCell textAlign="center">?????????</Table.HeaderCell>
                              <Table.HeaderCell textAlign="center">?????? ????????????</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            <Table.Row onClick={() => goToVideo(internalMedia.viewUrl)}>
                              <Table.Cell>{internalMedia.name}</Table.Cell>
                              <Table.Cell>{internalMedia.folderName}</Table.Cell>
                              <Table.Cell>{dateTimeHelper.timeToMinuteSecondFormat(internalMedia.duration)}</Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                      ))) || (
                      <>
                        {/* ???????????? ????????? ????????? */}
                        {/*<Button onClick={() => this.show(true, 'upload')} type="button">????????? ?????????</Button>*/}
                        <div className="file-drop-wrap">
                          <div className="filter">
                            <span>??????</span>
                            <Select
                              disabled={readonly}
                              placeholder="????????? ??? ????????? ??????????????????"
                              className="ui small-border dropdown"
                              options={this.makeCollegeOption()}
                              value={
                                (media &&
                                  media.mediaContents &&
                                  media.mediaContents.internalMedias &&
                                  media.mediaContents.internalMedias[0] &&
                                  media.mediaContents.internalMedias[0].folderId) ||
                                folderId ||
                                ''
                              }
                              onChange={(e: any, data: any) => {
                                this.setState({ folderId: data.value });
                              }}
                            />
                          </div>

                          {(media &&
                            media.mediaContents &&
                            media.mediaContents.internalMedias &&
                            media.mediaContents.internalMedias[0] &&
                            media.mediaContents.internalMedias[0].folderId) ||
                          folderId ? (
                            <div className="file-drop" id="drop">
                              <p>
                                <Icon className="upload" />
                                ????????? ????????? ???????????????.
                              </p>
                              <div className="thumbnails" id="thumbnails">
                                <progress id="progressBar" value="0" max="100" style={{ width: '100%' }} />
                              </div>
                              <div className="bottom">
                                <input type="button" className="btn btn-default" id="btnSubmit" value="?????????" />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </>
                    )
                  }
                  <Form.Group style={{ marginTop: 13 }}>
                    <Form.Field style={{ whiteSpace: 'nowrap' }}>??????????????????:</Form.Field>
                    <div className="ui input right">
                      <DatePicker
                        readOnly={readonly}
                        placeholderText="?????? ????????? ??????????????????."
                        selected={
                          media &&
                          media.mediaContents &&
                          media.mediaContents.contentsProvider &&
                          media.mediaContents.contentsProvider.expiryDateObj
                        }
                        onChange={(date: Date) =>
                          onChangeMediaDateProps(
                            'mediaContents.contentsProvider.expiryDateMoment',
                            moment(date).startOf('day')
                          )
                        }
                        dateFormat="yyyy.MM.dd"
                        disabled={
                          media &&
                          media.mediaContents &&
                          media.mediaContents.contentsProvider &&
                          media.mediaContents.contentsProvider.expiryDateDot === String('2100.12.30')
                        }
                      />
                    </div>
                    <Form.Field
                      disabled={readonly}
                      control={Checkbox}
                      label="?????? ?????????"
                      checked={
                        media &&
                        media.mediaContents &&
                        media.mediaContents.contentsProvider &&
                        media.mediaContents.contentsProvider.expiryDateDot === String('2100.12.30')
                      }
                      onChange={(e: any, data: any) => this.onClickExpiryUnlimited()}
                      style={{ whiteSpace: 'nowrap' }}
                    />
                  </Form.Group>

                  <PanoptoListModal cubeType={cubeType} open={panoptoListModalOpen} show={this.showPanoptoListModal} />
                </>
              ) : (
                ''
              )}

              {media && media.mediaType === MediaType.ContentsProviderMedia ? (
                readonly ? (
                  <Table celled>
                    <colgroup>
                      <col width="30%" />
                      <col width="50%" />
                      <col width="20%" />
                    </colgroup>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell textAlign="center">cp???</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">????????????</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">??????????????????</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell textAlign="center">{cpName || '-'}</Table.Cell>
                        <Table.Cell textAlign="center">
                          {(media &&
                            media.mediaContents &&
                            media.mediaContents.contentsProvider &&
                            media.mediaContents.contentsProvider.url) ||
                            '-'}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {(media &&
                            media.mediaContents &&
                            media.mediaContents.contentsProvider &&
                            media.mediaContents.contentsProvider.expiryDate &&
                            media.mediaContents.contentsProvider.expiryDateDot != String('2100.12.30') &&
                            media.mediaContents.contentsProvider.expiryDateDot) ||
                            '?????? ?????????'}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                ) : (
                  <Form.Group>
                    {/*<ContentsProviderSelectContainer*/}
                    {/*  defaultValue={*/}
                    {/*    media &&*/}
                    {/*    media.mediaContents &&*/}
                    {/*    media.mediaContents.contentsProvider &&*/}
                    {/*    media.mediaContents.contentsProvider.contentsProviderType &&*/}
                    {/*    media.mediaContents.contentsProvider.contentsProviderType.id*/}
                    {/*  }*/}
                    {/*  targetProps="mediaContents.contentsProvider.contentsProviderType.id"*/}
                    {/*  type="media"*/}
                    {/*/>*/}

                    <Form.Field
                      width={10}
                      control={Input}
                      placeholder={
                        cubeType === CubeType.Video
                          ? '??????????????? ????????? cp??? ?????? ?????? ????????? ??????????????????.'
                          : '??????????????? ????????? cp??? ????????? ?????? ????????? ??????????????????.'
                      }
                      value={
                        (media &&
                          media.mediaContents &&
                          media.mediaContents.contentsProvider &&
                          media.mediaContents.contentsProvider.url) ||
                        ''
                      }
                      onChange={(e: any) => onChangeMediaProps('mediaContents.contentsProvider.url', e.target.value)}
                    />
                    <Form.Field style={{ whiteSpace: 'nowrap' }}>??????????????????:</Form.Field>
                    <div className="ui input right icon">
                      <DatePicker
                        readOnly={readonly}
                        placeholderText="?????? ????????? ??????????????????."
                        selected={
                          media &&
                          media.mediaContents &&
                          media.mediaContents.contentsProvider &&
                          media.mediaContents.contentsProvider.expiryDateObj
                        }
                        onChange={(date: Date) =>
                          onChangeMediaDateProps(
                            'mediaContents.contentsProvider.expiryDateMoment',
                            moment(date).startOf('day')
                          )
                        }
                        dateFormat="yyyy.MM.dd"
                        disabled={
                          media &&
                          media.mediaContents &&
                          media.mediaContents.contentsProvider &&
                          media.mediaContents.contentsProvider.expiryDateDot === String('2100.12.30')
                        }
                      />
                      <Icon name="calendar alternate outline" />
                    </div>
                    <Form.Field
                      disabled={readonly}
                      control={Checkbox}
                      label="?????? ?????????"
                      checked={
                        media &&
                        media.mediaContents &&
                        media.mediaContents.contentsProvider &&
                        media.mediaContents.contentsProvider.expiryDateDot === String('2100.12.30')
                      }
                      onChange={(e: any, data: any) => this.onClickExpiryUnlimited()}
                      style={{ whiteSpace: 'nowrap' }}
                    />
                  </Form.Group>
                )
              ) : (
                ''
              )}
            </Table.Cell>
          </Table.Row>

          {!readonly &&
            media &&
            media.mediaContents &&
            media.mediaType === 'InternalMedia' &&
            media.mediaContents.internalMedias.length > 0 && (
              <Table.Row>
                <Table.Cell className="tb-header">????????????</Table.Cell>
                <Table.Cell>
                  <button
                    className="ui button"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.showCreateQuizModal(true)}
                  >
                    ??????
                  </button>
                  <QuizInfoListView
                    createQuizModalOpen={createQuizModalOpen}
                    findQuizData={this.findQuizData}
                    updateQuizTable={this.updateQuizTable}
                    mediaService={mediaService}
                  />
                </Table.Cell>
              </Table.Row>
            )}

          {createQuizModalOpen && (
            <CreateQuizModalContainer
              open={createQuizModalOpen}
              show={this.showCreateQuizModal}
              mediaService={mediaService}
              findQuizList={this.findQuizData}
              updateQuiz={updateQuiz}
            />
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default AdditionalInfoForMediaView;
