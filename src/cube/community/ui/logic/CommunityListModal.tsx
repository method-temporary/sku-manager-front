import * as React from 'react';
import { Button, Modal, Form, Radio, Table, Pagination } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { responseToNaOffsetElementList } from 'shared/helper';

import Community from 'community/community/model/Community';
import { CommunityQueryModel } from 'community/community/model/CommunityQueryModel';
import { findAllCohortCommunities, findAllOpenCommunities } from 'community/community/api/CommunityApi';
import CommunityStore from 'community/community/mobx/CommunityStore';
import '@nara.drama/approval/lib/snap.css';

interface Props {
  handleOk: (community: Community) => void;
  classroomIndex?: number;
  type: string;
  readonly?: boolean;
}

interface Injected {
  sharedService: SharedService;
  communityStore: CommunityStore;
}

interface States {
  open: boolean;
}

@inject('sharedService', 'communityStore')
@observer
@reactAutobind
class CommunityListModal extends ReactComponent<Props, States, Injected> {
  //
  PAGE_SIZE = 10;

  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  componentDidMount() {
    this.requestAllCommunities();
  }

  requestAllCommunities() {
    //
    const { type } = this.props;
    const communityStore = CommunityStore.instance;
    const sharedService = SharedService.instance;

    //communityStore.clearCommunityQuery();
    const communityQueryModel = communityStore.selectedCommunityQuery;

    if (sharedService) {
      if (communityQueryModel.page) {
        communityStore.setCommunityQuery(
          communityStore.selectedCommunityQuery,
          'offset',
          (communityQueryModel.page - 1) * communityQueryModel.limit
        );
        communityStore.setCommunityQuery(
          communityStore.selectedCommunityQuery,
          'pageIndex',
          (communityQueryModel.page - 1) * communityQueryModel.limit
        );
        sharedService.setPage('community', communityQueryModel.page);
      } else {
        sharedService.setPageMap('community', 0, communityQueryModel.limit);
      }
    }

    if (type === 'cube') {
      findAllCohortCommunities(CommunityQueryModel.asCommunityRdo(communityQueryModel)).then((response) => {
        const next = responseToNaOffsetElementList<Community>(response);
        next.limit = communityQueryModel.limit;
        next.offset = communityQueryModel.offset;
        sharedService.setCount('community', next.totalCount);
        communityStore.setCommunityList(next);
      });
    } else if (type === 'card') {
      findAllOpenCommunities(CommunityQueryModel.asCommunityRdo(communityQueryModel)).then((response) => {
        const next = responseToNaOffsetElementList<Community>(response);
        next.limit = communityQueryModel.limit;
        next.offset = communityQueryModel.offset;
        sharedService.setCount('community', next.totalCount);
        communityStore.setCommunityList(next);
      });
    }
  }

  handlePageChange(page: number) {
    const communityStore = CommunityStore.instance;
    communityStore.selectedCommunityQuery.page = page;

    this.requestAllCommunities();
  }

  handleClickRadioButton(community: Community) {
    const { select } = this.injected.communityStore;
    select(community);
  }

  onOpenModal() {
    this.setState({
      open: true,
    });
  }

  onCloseModal() {
    this.setState({
      open: false,
    });
  }

  handleOk(community: Community) {
    const { handleOk } = this.props;
    handleOk(community);
    this.onCloseModal();
  }

  render() {
    const { selected: selectedCommunity, communityList } = this.injected.communityStore;
    const { pageMap } = this.injected.sharedService;
    const { type, readonly } = this.props;

    return (
      <>
        <React.Fragment>
          <Modal
            size="small"
            open={this.state.open}
            onOpen={this.onOpenModal}
            onClose={this.onCloseModal}
            trigger={
              <Button type="button" disabled={readonly}>
                Community 찾기
              </Button>
            }
          >
            <Modal.Header>Community 선택</Modal.Header>
            <Modal.Content scrolling className="fit-layout">
              <Form>
                <Table>
                  <colgroup>
                    <col width="10%" />
                    <col width="50%" />
                    <col width="20%" />
                    <col width="20%" />
                  </colgroup>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="center">Select</Table.HeaderCell>
                      <Table.HeaderCell>제목</Table.HeaderCell>
                      <Table.HeaderCell>관리자</Table.HeaderCell>
                      <Table.HeaderCell>멤버</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {(communityList &&
                      communityList.results.length &&
                      communityList.results.map((community, index) => (
                        <Table.Row key={index}>
                          <Table.Cell textAlign="center">
                            <Form.Field
                              control={Radio}
                              value="1"
                              checked={community.communityId === selectedCommunity.communityId}
                              onChange={() => this.handleClickRadioButton(community)}
                            />
                          </Table.Cell>
                          <Table.Cell>{community.name}</Table.Cell>
                          <Table.Cell textAlign="center">{community.managerName}</Table.Cell>
                          <Table.Cell textAlign="center">{community.memberCount || 0}</Table.Cell>
                        </Table.Row>
                      ))) ||
                      null}
                  </Table.Body>
                </Table>
                {communityList && communityList.results.length === 0 ? null : (
                  <div className="center pagination-area">
                    <Pagination
                      activePage={pageMap.get('community') ? pageMap.get('community').page : 1}
                      totalPages={pageMap.get('community') ? pageMap.get('community').totalPages : 1}
                      onPageChange={(e, data) => this.handlePageChange(data.activePage as number)}
                    />
                  </div>
                )}
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button className="w190 d" onClick={() => this.onCloseModal()} type="button">
                Cancel
              </Button>
              {type === 'classroom' ? (
                <Button className="w190 p" onClick={() => this.handleOk(selectedCommunity)} type="button">
                  OK
                </Button>
              ) : (
                <Button className="w190 p" onClick={() => this.handleOk(selectedCommunity)} type="button">
                  OK
                </Button>
              )}
            </Modal.Actions>
          </Modal>
        </React.Fragment>
      </>
    );
  }
}

export default CommunityListModal;
