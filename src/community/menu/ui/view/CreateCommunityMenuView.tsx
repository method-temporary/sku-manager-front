import React, { useCallback, Fragment } from 'react';
import { Grid, Button, List, ButtonGroup, Table, Dimmer, Loader } from 'semantic-ui-react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { reactConfirm } from '@nara.platform/accent';

import { AlertWin } from 'shared/ui';

import MenuSurveyCdo from 'community/menu/model/MenuSurveyCdo';
import CommunityStore from 'community/community/mobx/CommunityStore';
import MenuDiscussionCdo from 'community/menu/model/MenuDiscussionCdo';
import { MenuViewModel } from '../../model/Menu';
import { AppendMenu, AppendSubMenu, RemoveMenu, Save, Loading } from '../../service/useMenuList';
import {
  ChangeName,
  ChangeType,
  ChangeGroupId,
  ChangeUrl,
  Select,
  StopEditing,
  ChangeAccessTypeToCommunityAllMember,
  ChangeAccessTypeToCommunityGroup,
  ChangeHtml,
  ChangeDiscussionTopic,
  ChangeSurveyInformation,
  ChangeDiscussionFileBoxId,
  ChangeDiscussionContent,
  ChangeDiscussionRelatedUrlList,
  SetDiscussionRelatedUrlList,
  ChangeDiscussionPrivateComment,
  MinusDiscussionRelatedUrlList,
} from '../../service/useSelectedMenu';
import MenuStore from '../../mobx/MenuStore';
import MenuInputView from './MenuInputView';
import MenuManagementIntroView from './MenuManagementIntroView';

interface CreateCommunityMenuViewProps {
  menus: MenuViewModel[];
  appendMenu: AppendMenu;
  appendSubMenu: AppendSubMenu;
  removeMenu: RemoveMenu;
  selectedMenu?: MenuViewModel;
  selectedMenuSurvey?: MenuSurveyCdo;
  select: Select;
  changeName: ChangeName;
  changeType: ChangeType;
  changeAccessTypeToCommunityAllMember: ChangeAccessTypeToCommunityAllMember;
  changeAccessTypeToCommunityGroup: ChangeAccessTypeToCommunityGroup;
  changeGroupId: ChangeGroupId;
  changeUrl: ChangeUrl;
  changeHtml: ChangeHtml;
  changeDiscussionTopic: ChangeDiscussionTopic;
  changeSurveyInformation: ChangeSurveyInformation;
  stopEditing: StopEditing;
  save: Save;
  loading: Loading;
  //getInnerSelected: MenuViewModel;
  changeDiscussionFileBoxId: ChangeDiscussionFileBoxId;
  changeDiscussionContent: ChangeDiscussionContent;
  changeDiscussionRelatedUrlList: ChangeDiscussionRelatedUrlList;
  setDiscussionRelatedUrlList: SetDiscussionRelatedUrlList;
  changeDiscussionPrivateComment: ChangeDiscussionPrivateComment;
  minusDiscussionRelatedUrlList: MinusDiscussionRelatedUrlList;
  menuDiscussionCdo?: MenuDiscussionCdo;
}

interface MenuItemProps {
  removeMenu: RemoveMenu;
  select: Select;
  name?: string;
  parentId?: string;
  id: string;
  selected?: boolean;
}

interface EditingMenuItemProps {
  name?: string;
  parentId?: string;
  changeName: ChangeName;
  stopEditing: StopEditing;
}

const EditingMenuItem: React.FC<EditingMenuItemProps> = function EdtingMenuItem({
  name,
  parentId,
  changeName,
  stopEditing,
}) {
  const onKeyDown = useCallback((e) => {
    if (e.keyCode === 13) {
      e.target.blur();
    }
  }, []);
  return (
    <List.Item>
      <List.Icon name={parentId === undefined ? 'circle' : 'minus'} size="mini" verticalAlign="middle" />
      <List.Content>
        <input
          className="menu-input"
          placeholder="???????????? ???????????????"
          value={name}
          onChange={changeName}
          onKeyDown={onKeyDown}
          onBlur={stopEditing}
        />
      </List.Content>
    </List.Item>
  );
};

const MenuItem: React.FC<MenuItemProps> = function MenuItem({ removeMenu, select, name, parentId, id, selected }) {
  return (
    <List.Item onClick={() => select(id)}>
      <List.Icon name={parentId === undefined ? 'circle' : 'minus'} size="mini" verticalAlign="middle" />
      <List.Content>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <div
            style={
              (selected && {
                color: 'black',
                paddingTop: 4,
                paddingBottom: 5,
                flex: 1,
              }) || { paddingTop: 4, paddingBottom: 5, flex: 1 }
            }
          >
            {name}
          </div>
          <Button basic icon="delete" size="mini" className="small-delete" onClick={() => removeMenu(id)} />
        </div>
      </List.Content>
    </List.Item>
  );
};

interface Params {
  cineroomId: string;
  communityId: string;
}

const CreateCommunityMenuView: React.FC<CreateCommunityMenuViewProps> = function CreateCommunityMenuView({
  menus,
  appendMenu,
  appendSubMenu,
  removeMenu,
  selectedMenu,
  selectedMenuSurvey,
  select,
  changeName,
  changeType,
  changeAccessTypeToCommunityAllMember,
  changeAccessTypeToCommunityGroup,
  changeGroupId,
  changeUrl,
  changeHtml,
  changeDiscussionTopic,
  changeSurveyInformation,
  stopEditing,
  save,
  loading,
  changeDiscussionFileBoxId,
  changeDiscussionContent,
  changeDiscussionRelatedUrlList,
  setDiscussionRelatedUrlList,
  changeDiscussionPrivateComment,
  minusDiscussionRelatedUrlList,
  menuDiscussionCdo,
}) {
  const history = useHistory();
  const { params } = useRouteMatch<Params>();
  const routeToCommunityList = useCallback(() => {
    history.push(`/cineroom/${params.cineroomId}/community-management/community/community-list`);
  }, [history, params]);

  const [alertWin, setAlertWin] = React.useState<{
    alertMessage: string;
    alertWinOpen: boolean;
    alertTitle: string;
    alertIcon: string;
    alertType: string;
  }>({
    alertMessage: '?????? ???????????????????',
    alertWinOpen: false,
    alertTitle: '?????? ??????',
    alertIcon: 'circle',
    alertType: 'save',
  });

  const handleCloseAlertWin = useCallback(() => {
    setAlertWin({ ...alertWin, alertWinOpen: false });
  }, [setAlertWin]);

  const handleAlertOk = useCallback(
    (type: string) => {
      if (type === 'justOk') handleCloseAlertWin();
    },
    [handleCloseAlertWin]
  );

  const beforeSave = useCallback(() => {
    const name = selectedMenu?.name;
    const type = selectedMenu?.type;
    const discussionTopic = selectedMenu?.discussionTopic;
    const surveyInformation = selectedMenu?.surveyInformation;
    const surveyId = selectedMenu?.surveyId;

    const menuTypeList = MenuStore.instance.menuList.map((m) => m.type);
    const menuListCount = menuTypeList.filter((type) => type === 'SURVEY').length;
    const surveyList = MenuStore.instance.menuList.map((m) => m.surveyId);
    const surveyNullCount = surveyList.filter((surveyId) => surveyId === null || surveyId === '').length;

    const linkUrl = selectedMenu?.url;

    if (menuTypeList?.includes('SURVEY')) {
      if (surveyList.length - menuListCount !== surveyNullCount) {
        setAlertWin({
          alertMessage: '???????????? ???????????? ????????? ????????? ?????????.',
          alertWinOpen: true,
          alertTitle: '?????? ?????? ?????? ??????',
          alertIcon: 'triangle',
          alertType: 'justOk',
        });
      } else {
        save();
        setAlertWin({
          alertMessage: '?????????????????????.',
          alertWinOpen: true,
          alertTitle: '',
          alertIcon: 'triangle',
          alertType: '??????',
        });
      }
    }
    if (type === 'CATEGORY' && name === '') {
      setAlertWin({
        alertMessage: '?????????????????? ???????????????',
        alertWinOpen: true,
        alertTitle: '?????? ?????? ?????? ??????',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
    } else if (type !== 'CATEGORY' && name === '') {
      setAlertWin({
        alertMessage: '???????????? ???????????????',
        alertWinOpen: true,
        alertTitle: '?????? ?????? ?????? ??????',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
    } else if (type === 'DISCUSSION' && discussionTopic === '') {
      setAlertWin({
        alertMessage: '????????? ???????????????',
        alertWinOpen: true,
        alertTitle: '?????? ?????? ?????? ??????',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
    } else if (type === 'SURVEY' && surveyInformation === '') {
      setAlertWin({
        alertMessage: '?????? ???????????? ???????????????',
        alertWinOpen: true,
        alertTitle: '?????? ?????? ?????? ??????',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
    } else if (type === 'LINK' && linkUrl === '') {
      setAlertWin({
        alertMessage: 'URL??? ??????????????????.',
        alertWinOpen: true,
        alertTitle: '?????? ?????? ?????? ??????',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
    } else if (type === 'LINK' && !linkUrl?.includes('http://') && !linkUrl?.includes('https://')) {
      setAlertWin({
        alertMessage: '????????? http:// ?????? https:// ?????? ??????????????? ?????????.',
        alertWinOpen: true,
        alertTitle: '?????? ?????? ?????? ??????',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
    } else {
      save();
      setAlertWin({
        alertMessage: '?????????????????????.',
        alertWinOpen: true,
        alertTitle: '',
        alertIcon: 'triangle',
        alertType: '??????',
      });
    }
  }, [selectedMenu, setAlertWin, save]);

  const remove = useCallback((id) => {
    reactConfirm({
      title: '',
      message: `?????? ?????? ??? ????????? ????????? ???????????? ?????? ???????????????.`,
      onOk: () => {
        removeMenu(id);
      },
    });
  }, []);

  return (
    <>
      <Table celled>
        <colgroup>
          <col width="100%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="title-header">??????</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Grid celled>
                <Grid.Row className="min-height-600">
                  <div
                    style={{
                      width: 300,
                      padding: '1em',
                      borderRightWidth: 1,
                      borderRightColor: '#D4D4D5',
                      borderRightStyle: 'solid',
                    }}
                  >
                    <Grid.Column width={16}>
                      <ButtonGroup basic className="hover-button-default">
                        <Button icon="angle up" onClick={MenuStore.instance.upMenu} />
                        <Button icon="angle down" onClick={MenuStore.instance.downMenu} />
                        <Button onClick={appendMenu}>????????????</Button>
                        <Button onClick={appendSubMenu}>????????????</Button>
                      </ButtonGroup>
                      <List verticalAlign="middle" relaxed selection>
                        <List.Item key="Home">
                          <List.Icon name="home" verticalAlign="middle" />
                          <List.Content>
                            <div style={{ paddingTop: 4, paddingBottom: 5 }}>Home</div>
                          </List.Content>
                        </List.Item>

                        {CommunityStore.instance.communityCdo.communityId.includes('COMMUNITY-a') ? null : (
                          <List.Item key="All">
                            <List.Icon name="circle" size="mini" verticalAlign="middle" />
                            <List.Content>
                              <div style={{ paddingTop: 4, paddingBottom: 5 }}>?????? ???(?????? ??????)</div>
                            </List.Content>
                          </List.Item>
                        )}

                        <List.Item key="Notice">
                          <List.Icon name="circle" size="mini" verticalAlign="middle" />
                          <List.Content>
                            <div style={{ paddingTop: 4, paddingBottom: 5 }}>????????????(?????? ??????)</div>
                          </List.Content>
                        </List.Item>
                        {menus.map(({ id, name, parentId, editing }) => (
                          <Fragment key={id}>
                            {editing !== true && (
                              <MenuItem
                                id={id}
                                name={name}
                                parentId={parentId}
                                select={select}
                                removeMenu={remove}
                                selected={selectedMenu?.id === id}
                              />
                            )}
                            {editing === true && (
                              <EditingMenuItem
                                name={name}
                                parentId={parentId}
                                changeName={changeName}
                                stopEditing={stopEditing}
                              />
                            )}
                          </Fragment>
                        ))}
                      </List>
                    </Grid.Column>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Grid.Column width={16}>
                      {selectedMenu === undefined && <MenuManagementIntroView />}
                      {selectedMenu !== undefined && selectedMenu.type !== undefined && (
                        <MenuInputView
                          menuId={selectedMenu.menuId}
                          type={selectedMenu.type}
                          accessType={selectedMenu.accessType}
                          groupId={selectedMenu.groupId}
                          name={selectedMenu.name}
                          url={selectedMenu.url}
                          html={selectedMenu.html}
                          discussionTopic={selectedMenu.discussionTopic}
                          surveyInformation={selectedMenu.surveyInformation}
                          surveyTitle={selectedMenuSurvey?.title}
                          surveyCreatorName={selectedMenuSurvey?.creatorName}
                          changeType={changeType}
                          changeAccessTypeToCommunityAllMember={changeAccessTypeToCommunityAllMember}
                          changeAccessTypeToCommunityGroup={changeAccessTypeToCommunityGroup}
                          changeGroupId={changeGroupId}
                          changeName={changeName}
                          changeUrl={changeUrl}
                          changeHtml={changeHtml}
                          changeDiscussionTopic={changeDiscussionTopic}
                          changeSurveyInformation={changeSurveyInformation}
                          relatedUrlList={MenuStore.instance.selected.relatedUrlList}
                          fileBoxId={MenuStore.instance.selected.fileBoxId}
                          content={MenuStore.instance.selected.content}
                          privateComment={MenuStore.instance.selected.privateComment}
                          feedbackId={menuDiscussionCdo?.commentFeedbackId}
                          changeDiscussionFileBoxId={changeDiscussionFileBoxId}
                          changeDiscussionContent={changeDiscussionContent}
                          changeDiscussionRelatedUrlList={changeDiscussionRelatedUrlList}
                          setDiscussionRelatedUrlList={setDiscussionRelatedUrlList}
                          changeDiscussionPrivateComment={changeDiscussionPrivateComment}
                          minusDiscussionRelatedUrlList={minusDiscussionRelatedUrlList}
                        />
                      )}
                    </Grid.Column>
                  </div>
                </Grid.Row>
              </Grid>
              <div className="btn-group">
                <div className="fl-right">
                  <Button onClick={routeToCommunityList}>??????</Button>
                  <Button primary onClick={beforeSave}>
                    ??????
                  </Button>
                </div>
              </div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Dimmer active={loading} page inverted>
        <Loader />
      </Dimmer>

      <AlertWin
        message={alertWin.alertMessage}
        handleClose={handleCloseAlertWin}
        open={alertWin.alertWinOpen}
        alertIcon={alertWin.alertIcon}
        title={alertWin.alertTitle}
        type={alertWin.alertType}
        handleOk={handleAlertOk}
      />
    </>
  );
};

export default CreateCommunityMenuView;
