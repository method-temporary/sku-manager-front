import React, { Component } from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { Menu, Select } from 'semantic-ui-react';
import { inject } from 'mobx-react';

import { reactAutobind, WorkSpace } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { mySUNIFirst } from 'shared/hooks';

import MenuSection from './MenuSection';
import { SharedService } from '../../present';
import { CollegeService } from '../../../college';
import { UserService } from '../../../user';
import { UserWorkspaceService } from '../../../userworkspace';
import { LoginButton } from '../LoginButton';
import { logoutClick } from 'lib/common';
import { isSuperManager } from '../logic/isSuperManager';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  sharedService?: SharedService;
  collegeService?: CollegeService;
  userService?: UserService;
  userWorkspaceService?: UserWorkspaceService;
}
@inject('sharedService', 'collegeService', 'userService', 'userWorkspaceService')
@reactAutobind
class ManagerHeader extends Component<Props> {
  state = { activeItem: 'home', userWorkspace: new Map<string, string>() };

  constructor(props: Props) {
    super(props);
    this.init();
  }

  async init() {
    // patronInfo.setCineroomId(this.props.match.params.cineroomId);
    this.getUserWorkspaces();
    if (process.env.NODE_ENV !== 'development') {
      this.setLanguage();
    }
  }

  async setLanguage() {
    const { userService } = this.props;
    if (userService) {
      const user = await userService.findUser();
      localStorage.setItem('language', user.language);
    }
  }

  async getUserWorkspaces() {
    const { userWorkspaceService } = this.props;
    if (userWorkspaceService) {
      const userWorkspace = await userWorkspaceService.findAllUserWorkspacesMap();
      this.setState({ userWorkspace });
    }
  }

  handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name });

  onSelectCompany(e: any, data: any) {
    const cineroomId = patronInfo.getCineroomId();
    const { userService, sharedService, collegeService, history } = this.props;

    if (cineroomId && window.location.pathname.includes(cineroomId)) {
      const paths = window.location.pathname.split(cineroomId);
      if (paths.length >= 2) {
        patronInfo.setCineroomId(data.value);
        userService && userService.clearUserQuery();
        sharedService && sharedService.setHeaderActiveItem('Learning 관리');
        collegeService && collegeService.init();
        history.push(`/cineroom/${data.value}/learning-management/cubes/cube-list`);
      }
    }
  }

  getCinerooms() {
    const { userWorkspace } = this.state;
    const { userWorkspaceService } = this.props;
    let cinerooms: any[] = [];

    if (isSuperManager()) {
      if (userWorkspaceService) {
        const { allUserWorkspaces } = userWorkspaceService;
        cinerooms = allUserWorkspaces.sort(mySUNIFirst).map((workspace) => {
          return {
            key: workspace.id,
            value: workspace.id,
            text: getPolyglotToAnyString(workspace.name),
          };
        });
      }
    } else {
      if (patronInfo.getCinerooms() && patronInfo.getCinerooms().length) {
        cinerooms = patronInfo
          .getCinerooms()
          .filter(
            (cineroom: WorkSpace) =>
              cineroom.roles.includes('CollegeManager') || cineroom.roles.includes('CompanyManager')
          )
          .map((cineroom: WorkSpace) => ({
            key: cineroom.id,
            value: cineroom.id,
            text: userWorkspace.get(cineroom.id) || '',
          }));
      }
    }
    return cinerooms;
  }

  render() {
    const { activeItem } = this.state;
    const currentCineroomId = patronInfo.getCineroomId();

    return (
      <Menu secondary className="m-gnb">
        <Menu.Item>
          <div className="g-logo">
            <Link to="/">
              <i className="sk-university icon">
                <span className="blind">SUNI</span>
              </i>
            </Link>
          </div>
        </Menu.Item>
        <Menu.Item>
          <MenuSection />
        </Menu.Item>
        <Menu.Menu position="right">
          {process.env.NODE_ENV === 'development' && <LoginButton />}
          <Menu.Item>
            <Select options={this.getCinerooms()} value={currentCineroomId} onChange={this.onSelectCompany} />
          </Menu.Item>
          <Menu.Item
            className="btn-info-management"
            name="정보관리"
            active={activeItem === '정보관리'}
            onClick={this.handleItemClick}
          />
          <Menu.Item className="btn-logout" name="로그아웃" active={activeItem === '로그아웃'} onClick={logoutClick} />
        </Menu.Menu>
      </Menu>
    );
  }
}

export default withRouter(ManagerHeader);
