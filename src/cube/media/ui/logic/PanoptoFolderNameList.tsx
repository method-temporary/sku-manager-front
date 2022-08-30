import * as React from 'react';
import { Button, Modal, Form, Table, Radio } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, setCookie } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';

import { CubeType } from 'shared/model';
import { SharedService } from 'shared/present';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { MediaService } from '../../index';
import { CollegeService } from '../../../../college';
import { CollegeModel } from '../../../../college/model/CollegeModel';

interface Props {
  mediaService?: MediaService;
  sharedService?: SharedService;
  collegeService?: CollegeService;
  cubeType: string;
  showPanoptoListModal: (open: boolean) => void;
}

interface States {
  open: boolean;
  type: string;
}

@inject('mediaService', 'sharedService', 'collegeService')
@observer
@reactAutobind
class PanoptoFolderNameList extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = { open: false, type: '' };
  }

  componentDidMount(): void {
    const { collegeService } = this.props;
    const { collegesForPanopto } = collegeService || ({} as CollegeService);
    if (collegeService && collegesForPanopto && collegesForPanopto.length === 1) {
      collegeService.setCollegeForPanopto(collegesForPanopto[0]);
    }
  }

  show(open: boolean, type?: string) {
    //
    this.setState({ open, type: type || '' });
  }

  handleOK(type: string) {
    const { collegeService, showPanoptoListModal, mediaService } = this.props;
    const { collegeForPanopto } = collegeService || ({} as CollegeService);
    if (type === 'select' && mediaService) {
      Promise.resolve()
        .then(() => mediaService.changePanoptoCdoProps('folderId', collegeForPanopto.panoptoFolderId))
        .then(() => this.findPanoptoList())
        .then(() => {
          showPanoptoListModal(true);
          this.show(false);
        });
    } else {
      const uploadURL = process.env.NODE_ENV === 'development' ? '/panoptoindex.html' : '/manager/panoptoindex.html';
      // const role = window.sessionStorage.getItem("")

      const uploardWin = window.open(uploadURL, 'test');

      if (uploardWin) {
        setCookie('folderId', collegeForPanopto.panoptoFolderId);
      }
      this.show(false);
    }

    if (collegeService) collegeService.clearCollegeForPanopto();
  }

  findPanoptoList(page?: number) {
    const { sharedService, mediaService } = this.props;
    const { panoptoCdo } = this.props.mediaService || ({} as MediaService);
    if (sharedService && mediaService) {
      if (page) {
        sharedService.setPage('panopto', page);
        mediaService.changePanoptoCdoProps('currentPage', page);
      } else sharedService.setPageMap('panopto', 0, Number(panoptoCdo.page_size));
      mediaService.initPanoptoList().then(() => {
        sharedService.setCount('panopto', mediaService.panoptos.totalCount);
      });
    }
  }

  handleCancel() {
    //
    const { collegeService } = this.props;
    if (collegeService) collegeService.clearCollegeForPanopto();
    this.show(false);
  }

  onSetCollegeForPanopto(selectedCollege: CollegeModel) {
    //
    const { collegeService } = this.props;
    if (collegeService) collegeService.setCollegeForPanopto(selectedCollege);
  }

  render() {
    const { collegesForPanopto, collegeForPanopto } = this.props.collegeService || ({} as CollegeService);
    const { open, type } = this.state;
    const { cubeType } = this.props;
    const cineroomId = patronInfo.getCineroomId() || '';

    return (
      <>
        {cubeType === CubeType.Video ? (
          <>
            {/*<Button onClick={() => this.show(true, 'upload')} type="button">동영상 업로드</Button>*/}
            <Button onClick={() => this.show(true, 'select')} type="button">
              동영상 가져오기
            </Button>
          </>
        ) : (
          <>
            {/*<Button onClick={() => this.show(true, 'upload')} type="button">오디오 업로드</Button>*/}
            <Button onClick={() => this.show(true, 'select')} type="button">
              오디오 가져오기
            </Button>
          </>
        )}
        <Modal size="mini" open={open} onClose={() => this.show(false)}>
          <Modal.Header>폴더 선택</Modal.Header>
          <Modal.Content>
            <Form>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">Select</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {(collegesForPanopto &&
                    collegesForPanopto.length &&
                    collegesForPanopto.map((college, index) => (
                      <Table.Row key={index}>
                        <Table.Cell textAlign="center">
                          <Form.Field
                            control={Radio}
                            label={getPolyglotToAnyString(college.name, getDefaultLanguage(college.langSupports))}
                            value={college.panoptoFolderId}
                            checked={
                              cineroomId !== 'ne1-m2-c2' ||
                              collegeForPanopto.panoptoFolderId === college.panoptoFolderId
                            }
                            onChange={() => this.onSetCollegeForPanopto(college)}
                            disabled={cineroomId !== 'ne1-m2-c2'}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))) ||
                    null}
                </Table.Body>
              </Table>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => this.handleCancel()} type="button">
              Cancel
            </Button>
            <Button primary onClick={() => this.handleOK(type)} type="button">
              OK
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}
export default PanoptoFolderNameList;
