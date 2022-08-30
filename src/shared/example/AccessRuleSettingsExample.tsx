import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { Container } from 'semantic-ui-react';
import { GroupBasedAccessRuleModel } from '../model';
import { AccessRuleSettings } from '../components';

@reactAutobind
@observer
class AccessRuleSettingsExample extends ReactComponent {
  //
  onChange(groupBasedAccessRule: GroupBasedAccessRuleModel) {
    //
    // console.log('onChange', groupBasedAccessRule);
  }

  render() {
    //
    return (
      <Container>
        <AccessRuleSettings onChange={this.onChange} />

        <AccessRuleSettings readOnly onChange={this.onChange} />
      </Container>
    );
  }
}

export default AccessRuleSettingsExample;
