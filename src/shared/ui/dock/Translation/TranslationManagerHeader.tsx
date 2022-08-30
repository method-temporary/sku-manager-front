import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { Menu, Select } from 'semantic-ui-react';
import { reactAutobind, axiosApi, setCookie, WorkSpace, StorageModel, deleteCookie } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';
import { SharedService } from '../../../present';
import { CollegeService } from '../../../../college';
import { UserService } from '../../../../user';
import { UserWorkspaceService } from '../../../../userworkspace';
import SelectTypeModel from '../../../model/SelectTypeModel';
import TranslationMenuSection from './TranslationMenuSection';
import { onLogin, logoutClick } from 'lib/common';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  sharedService?: SharedService;
  collegeService?: CollegeService;
  userService?: UserService;
  userWorkspaceService?: UserWorkspaceService;
}
@inject('sharedService', 'collegeService', 'userService', 'userWorkspaceService')
@reactAutobind
class ManagerHeader extends Component<Props> {
  state = { activeItem: 'home', id: 'myutopia@sk.com', userWorkspace: new Map<string, string>() };

  constructor(props: Props) {
    super(props);

    this.init();
  }

  async init() {
    //
    const { userWorkspaceService, userService } = this.props;

    if (userWorkspaceService) {
      const userWorkspace = await userWorkspaceService.findAllUserWorkspacesMap();
      this.setState({ userWorkspace });
    }

    if (process.env.NODE_ENV !== 'development') {
      if (userService) {
        const user = await userService.findUser();

        localStorage.setItem('language', user.language);
      }
    }
  }

  handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name });

  getLanguageOptions() {
    //
    const options: SelectTypeModel[] = [];

    options.push(new SelectTypeModel('1', 'Korean', 'Korean'));
    options.push(new SelectTypeModel('2', 'English', 'English'));
    options.push(new SelectTypeModel('3', 'Chinese', 'Chinese'));

    return options;
  }

  render() {
    const { id, activeItem, userWorkspace } = this.state;
    const { cineroomId } = this.props.match.params;
    let cinerooms: any[] = [];

    if (patronInfo.getCinerooms() && patronInfo.getCinerooms().length) {
      cinerooms = patronInfo
        .getCinerooms()
        .filter(
          (cineroom: WorkSpace) =>
            cineroom.roles.includes('CollegeManager') ||
            cineroom.roles.includes('CompanyManager') ||
            cineroom.roles.includes('Translator')
        )
        .map((cineroom: WorkSpace) => ({
          key: cineroom.id,
          value: cineroom.id,
          text: userWorkspace.get(cineroom.id) || '',
        }));
    }

    const languageOptions = this.getLanguageOptions();

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
          <TranslationMenuSection />
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item className="login-info">
            {process.env.NODE_ENV === 'development' && (
              <>
                <input value={this.state.id} onChange={(e) => this.setState({ id: e.target.value })} />
                <button onClick={() => onLogin(id)} type="button">
                  로그인
                </button>
                <Select
                  options={languageOptions}
                  value={localStorage.getItem('language') || ''}
                  onChange={(e, data) => {
                    localStorage.setItem('language', data?.value?.toString() || '');
                    window.location.href = window.location.href;
                  }}
                />
              </>
            )}
          </Menu.Item>
          <Menu.Item>
            <Select
              options={cinerooms}
              value={cineroomId}
              onChange={(e: any, data: any) => {
                if (cineroomId && window.location.pathname.includes(cineroomId)) {
                  const paths = window.location.pathname.split(cineroomId);
                  if (paths.length >= 2) {
                    patronInfo.setCineroomId(data.value);
                    this.props.userService && this.props.userService.clearUserQuery();
                    this.props.sharedService && this.props.sharedService.setHeaderActiveItem('Translation 관리');
                    this.props.collegeService && this.props.collegeService.findAllCollegesForCurrentCineroom();
                    this.props.collegeService && this.props.collegeService.findFamilyCollegesForCurrentCineroom();
                    this.props.history.push(`/cineroom/${data.value}/translation-management/cubes/cube-list`);
                  }
                }
              }}
            />
          </Menu.Item>
          <Menu.Item className="btn-logout" name="로그아웃" active={activeItem === '로그아웃'} onClick={logoutClick} />
        </Menu.Menu>
      </Menu>
    );
  }
}

export default withRouter(ManagerHeader);
