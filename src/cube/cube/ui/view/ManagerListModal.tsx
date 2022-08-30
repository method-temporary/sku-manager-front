import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';
import { Chart, MemberViewModel } from '@nara.drama/approval';
import '@nara.drama/approval/lib/snap.css';

import { Language } from 'shared/components/Polyglot';

import { UserService } from '../../../../user';

interface Props {
  userService?: UserService;
  handleOk: (member: MemberViewModel, memberList: MemberViewModel[]) => void;
  buttonName: string;
  multiSelect: boolean;
  focused?: boolean;
  sequence?: number;
  readonly?: boolean;
  companyCode?: string;
  language?: Language;
}

interface States {
  open: boolean;
}

@inject('userService')
@observer
@reactAutobind
class ManagerListModal extends React.Component<Props, States> {
  //
  static defaultProps = {
    language: localStorage.getItem('language') || '',
  };

  private buttonRef: any = React.createRef();

  constructor(props: Props) {
    //
    super(props);
    this.state = { open: false };
  }

  componentDidMount(): void {
    //
    // const { userService, focused } = this.props;
    // if (userService) {
    //   userService.findSkProfile();
    // }
  }

  componentDidUpdate(): void {
    const { focused } = this.props;
    if (focused && this.buttonRef.current) {
      this.buttonRef.current.focus();
    }
  }

  show(open: boolean) {
    //

    this.setState({ open });
    const { userService } = this.props;
    if (userService) {
      userService.findUser();
    }
  }

  handleOk(member: MemberViewModel, memberList: MemberViewModel[]) {
    const { handleOk } = this.props;
    handleOk(member, memberList);
    this.show(false);
  }

  render() {
    const { open } = this.state;
    const { user } = this.props.userService || ({} as UserService);
    const { buttonName, multiSelect, sequence, readonly, companyCode, language } = this.props;
    const cineroomId = patronInfo.getCineroomId();
    const targetCompanyCode = companyCode && companyCode !== 'mySUNI' ? companyCode : patronInfo.getPatronCompanyCode();

    return (
      <>
        {!readonly ? (
          <Button onClick={() => this.show(true)} type="button" ref={this.buttonRef}>
            {buttonName}
          </Button>
        ) : null}

        <Chart
          open={open}
          handleOk={this.handleOk}
          handleCancel={this.show}
          companyCode={(targetCompanyCode !== 'muSUNI' && targetCompanyCode) || ''}
          departmentCode={targetCompanyCode !== patronInfo.getPatronCompanyCode() ? '' : user.departmentCode}
          showAllCompanies={cineroomId === 'ne1-m2-c2'}
          multiSelect={multiSelect}
          userGroupSequence={sequence}
          // language={language}
          admin
        />
      </>
    );
  }
}

export default ManagerListModal;
