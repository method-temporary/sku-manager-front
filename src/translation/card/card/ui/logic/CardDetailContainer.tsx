import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Container, Form, Tab } from 'semantic-ui-react';

import { PageTitle, SubActions, Loader } from 'shared/components';
import { SelectType } from 'shared/model';

import { CardService } from '../../index';
import { UserGroupService } from 'usergroup';
import { CollegeService } from 'college';

import { translationManagementUrl } from 'Routes';
import CardBasicInfoContainer from './CardBasicInfoContainer';
import CardExposureInfoContainer from './CardExposureInfoContainer';
import CardContentsInfoContainer from './CardContentsInfoContainer';
import CardAdditionalInfoContainer from './CardAdditionalInfoContainer';
import { setCubeInfoAndTerm } from 'card/card/ui/logic/CardLoadQueryModelHelper';
import CubeService from 'cube/cube/present/logic/CubeService';
import { LoaderService } from 'shared/components/Loader/present/logic/LoaderService';
import Polyglot from 'shared/components/Polyglot';
import { UserWorkspaceService } from 'userworkspace';

interface Params {
  cineroomId: string;
  cardId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface State {
  isUpdatable: boolean;
  activeIndex: number;
}

interface Injected {
  cardService: CardService;
  collegeService: CollegeService;
  userGroupService: UserGroupService;
  cubeService: CubeService;
  loaderService: LoaderService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('cardService', 'collegeService', 'userGroupService', 'cubeService', 'loaderService', 'userWorkspaceService')
@observer
@reactAutobind
class CardDetailContainer extends ReactComponent<Props, State, Injected> {
  //
  state: State = {
    isUpdatable: false,
    activeIndex: 0,
  };

  constructor(props: Props) {
    super(props);

    const { cardId } = this.props.match.params;

    if (cardId) {
      this.findCard(cardId);
    } else {
      this.routeToCardList();
    }
  }

  async findCard(cardId: string) {
    //
    const { cardService, loaderService } = this.injected;

    loaderService.openLoader(true);
    await cardService.findCardById(cardId);
    loaderService.closeLoader(true, 'info');

    await this.setCardData();
  }

  async setCardData() {
    // Chapter / Cube / Talk List 정보
    this.setLearningContentsInfo();

    // 부가정보
    this.setContentsInfo();

    // 추가정보
    this.setAdditionalInfo();
  }

  async setLearningContentsInfo() {
    const { cardService, cubeService, collegeService, loaderService } = this.injected;
    const { collegesMap, channelMap } = collegeService;
    await setCubeInfoAndTerm(cardService, cubeService, collegesMap, channelMap);
    loaderService.closeLoader(true, 'learning');
  }

  async setContentsInfo() {
    //
    const { loaderService } = this.injected;
    loaderService.closeLoader(true, 'contents');
  }

  async setAdditionalInfo() {
    //   //
    const { loaderService } = this.injected;
    loaderService.closeLoader(true, 'additional');
  }

  routeToCardList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${translationManagementUrl}/cards/card-list`
    );
  }

  routeToCardCreate(cardId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${translationManagementUrl}/cards/card-modify/${cardId}`
    );
  }

  onTabChange(e: any, data: any) {
    //
    this.setState({ activeIndex: data.activeIndex });
    this.injected.loaderService.closeLoader(true, 'ALL');
  }

  getOpenedPanes() {
    //
    const { isUpdatable } = this.state;
    const { cineroomId } = this.props.match.params;
    const { cardService, collegeService, userWorkspaceService } = this.injected;

    const { collegesMap, channelMap } = collegeService;

    const userWorkspaces =
      cineroomId === 'ne1-m2-c2'
        ? userWorkspaceService.allUserWorkspaces
        : userWorkspaceService.userWorkspacesByUserWorkspaceId(cineroomId);

    const menuItems: { menuItem: string; render: () => JSX.Element }[] = [];

    menuItems.push({
      menuItem: 'Card 정보',
      render: () => (
        <Tab.Pane attached={false}>
          <Polyglot languages={cardService.cardQuery.langSupports}>
            <Form>
              {/*기본 정보*/}
              <Loader name="info">
                <CardBasicInfoContainer isUpdatable={isUpdatable} cardService={cardService} />
              </Loader>

              {/*노출 정보*/}
              <Loader name="exposure">
                <CardExposureInfoContainer
                  isUpdatable={isUpdatable}
                  cineroomId={cineroomId}
                  cardService={cardService}
                  userWorkspaces={userWorkspaces}
                />
              </Loader>

              {/*부가 정보*/}
              <Loader name="contents">
                <CardContentsInfoContainer
                  isUpdatable={isUpdatable}
                  cardService={cardService}
                  collegesMap={collegesMap}
                  channelMap={channelMap}
                />
              </Loader>

              {/*추가 정보*/}
              <Loader name="additional">
                <CardAdditionalInfoContainer isUpdatable={isUpdatable} cardService={cardService} />
              </Loader>
            </Form>
          </Polyglot>
        </Tab.Pane>
      ),
    });
    return menuItems;
  }

  render() {
    //
    const { cineroomId, cardId } = this.props.match.params;
    const { activeIndex } = this.state;
    const { patronKey } = this.injected.cardService.cardQuery;

    return (
      <>
        <Container fluid>
          <PageTitle breadcrumb={SelectType.translationCardSections}>Card 관리</PageTitle>
          <Form>
            <Tab
              panes={this.getOpenedPanes()}
              menu={{ secondary: true, pointing: true }}
              className="styled-tab tab-wrap"
              onTabChange={(e: any, data: any) => this.onTabChange(e, data)}
            />
          </Form>

          <SubActions form>
            {patronKey.keyString && patronKey.keyString.endsWith(cineroomId) ? (
              <>
                {activeIndex === 0 && (
                  <SubActions.Left>
                    {cardId && <Button onClick={() => this.routeToCardCreate(cardId)}>수정</Button>}
                  </SubActions.Left>
                )}
                <SubActions.Right>
                  <Button onClick={this.routeToCardList}>목록</Button>
                </SubActions.Right>
              </>
            ) : (
              <SubActions.Right>
                <Button onClick={this.routeToCardList}>목록</Button>
              </SubActions.Right>
            )}
          </SubActions>
        </Container>
      </>
    );
  }
}

export default CardDetailContainer;
