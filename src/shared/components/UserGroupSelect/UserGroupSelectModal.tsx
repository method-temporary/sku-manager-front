import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { inject, observer } from 'mobx-react';

import { ButtonProps, Button } from 'semantic-ui-react';
import Modal from '../Modal';
import UserGroupSelectContainer from './UserGroupSelectContainer';
import { UserGroupRuleModel } from '../../model';
import AccessRuleService from '../../present/logic/AccessRuleService';
import UserGroupSelectService from './present/logic/UserGroupSelectService';

interface Props {
  initialize?: () => void;
  onConfirm?: (selectedRules: UserGroupRuleModel[]) => void;
  onClose?: () => void;

  multiple?: boolean;
  button: string | React.ReactNode | ButtonProps;
  modSuper?: boolean;
  title?: string;
  description?: string;
  cineroomId?: string;
}

interface State {
  selectedRules: UserGroupRuleModel[];
}

interface Injected {
  accessRuleService: AccessRuleService;
  userGroupSelectService: UserGroupSelectService;
}

@inject('accessRuleService', 'userGroupSelectService')
@observer
@reactAutobind
class UserGroupSelectModal extends ReactComponent<Props, State, Injected> {
  //
  static defaultProps = {
    initialize: () => {},
    onConfirm: () => {},
    onClose: () => {},
  };

  state: State = {
    selectedRules: [],
  };

  initialize(): void {
    //
    this.propsWithDefault.initialize();
  }

  onChange(selectedRules: UserGroupRuleModel[]) {
    //
    this.setState({ selectedRules });
  }

  onCloseModal(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, close: () => void) {
    //
    this.propsWithDefault.onClose();
    this.injected.accessRuleService.clearAccessRules();
    close();
  }

  onSaveAccessRule(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, close: () => void) {
    //
    const { onConfirm } = this.propsWithDefault;
    const { selectedRules } = this.state;

    onConfirm(selectedRules);
    this.injected.accessRuleService.clearAccessRules();
    close();
  }

  renderTriggerButton() {
    //
    const { button, modSuper } = this.props;

    if (typeof button === 'string') {
      return (
        <Button disabled={modSuper} type="button" onClick={this.initialize}>
          {button}
        </Button>
      );
    } else if (React.isValidElement(button)) {
      return (
        <Button disabled={modSuper} type="button" onClick={this.initialize}>
          {button}
        </Button>
      );
    } else {
      return <Button disabled={modSuper} type="button" onClick={this.initialize} {...button} />;
    }
  }

  render() {
    //
    const { multiple, modSuper, title, description, cineroomId } = this.props;
    const { selectedRules } = this.state;

    return (
      <Modal size="large" triggerAs="a" trigger={this.renderTriggerButton()} modSuper={modSuper}>
        <Modal.Header className="res">
          <span> {title ? `${title}` : `접근 제어 규칙 추가`} </span>
          <span className="sub f12">{description ? `${description}` : `접근 제어 규칙을 선택해주세요`}</span>
        </Modal.Header>
        <Modal.Content className="fit-layout">
          <UserGroupSelectContainer multiple={multiple} onChange={this.onChange} cineroomId={cineroomId} />
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton className="w190 d" onClickWithClose={this.onCloseModal}>
            Cancel
          </Modal.CloseButton>
          <Modal.CloseButton
            disabled={selectedRules.length < 1}
            className="w190 p"
            onClickWithClose={this.onSaveAccessRule}
          >
            OK
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default UserGroupSelectModal;
