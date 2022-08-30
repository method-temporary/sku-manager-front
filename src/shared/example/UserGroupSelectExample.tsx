import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { UserGroupSelect } from '../components';
import { Container } from 'semantic-ui-react';
import UserGroupRuleModel from '../model/UserGroupRuleModel';

@reactAutobind
@observer
class UserGroupSelectExample extends ReactComponent {
  //
  onChange(selectedRules: UserGroupRuleModel[]) {
    //
    console.log('onChange', selectedRules);
  }

  render() {
    //
    return (
      <Container>
        <UserGroupSelect onChange={this.onChange} />
      </Container>
    );
  }
}

export default UserGroupSelectExample;
