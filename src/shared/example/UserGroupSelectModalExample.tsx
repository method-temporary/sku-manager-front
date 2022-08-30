import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { UserGroupSelectModal } from '../components';
import { Container } from 'semantic-ui-react';
import UserGroupRuleModel from '../model/UserGroupRuleModel';

@reactAutobind
@observer
class UserGroupSelectModalExample extends ReactComponent {
  //
  onConfirm(selectedRules: UserGroupRuleModel[]) {
    //
    // console.log('onConfirm', selectedRules);
  }

  render() {
    //
    return (
      <Container>
        <UserGroupSelectModal button="UserGroupSelectModal Button" onConfirm={this.onConfirm} />

        <UserGroupSelectModal
          // initialize={() => console.log('초기화 함수')}
          // onClose={() => console.log('창 닫음')}
          // onConfirm={() => console.log('데이터 저장 후 닫음')}
          button="Button Name"
        />
      </Container>
    );
  }
}

export default UserGroupSelectModalExample;
