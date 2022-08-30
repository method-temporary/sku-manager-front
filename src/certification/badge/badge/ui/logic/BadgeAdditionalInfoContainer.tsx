import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { MemberViewModel } from '@nara.drama/approval';

import { BadgeModel } from '_data/badge/badges/model';
import BadgeAdditionalInfoView from '../view/BadgeAdditionalInfoView';
import { UserIdentityModel } from '../../../../../cube/user/model/UserIdentityModel';
import Polyglot from 'shared/components/Polyglot';

interface Props {
  isUpdatable: boolean;
  badge: BadgeModel;
  changeBadgeQueryProp: (name: string, value: any) => void;
  changeBadgeOperatorProp: (name: string, value: any) => void;
  badgeOperatorIdentity: UserIdentityModel;
}

@observer
@reactAutobind
class BadgeAdditionalInfoContainer extends ReactComponent<Props> {
  //

  onClickOperatorSelect(member: MemberViewModel) {
    //
    const { changeBadgeQueryProp, changeBadgeOperatorProp } = this.props;

    changeBadgeQueryProp('operator.keyString', member.id);

    changeBadgeOperatorProp('companyName', member.companyName);
    changeBadgeOperatorProp('name', member.name);
    changeBadgeOperatorProp('email', member.email);
    changeBadgeOperatorProp('id', member.id);
  }

  render() {
    //
    const { isUpdatable, badge, changeBadgeQueryProp, badgeOperatorIdentity } = this.props;

    return (
      <Polyglot languages={badge.langSupports}>
        <BadgeAdditionalInfoView
          isUpdatable={isUpdatable}
          badge={badge}
          changeBadgeQueryProp={changeBadgeQueryProp}
          onClickOperatorSelect={this.onClickOperatorSelect}
          badgeOperatorIdentity={badgeOperatorIdentity}
        />
      </Polyglot>
    );
  }
}

export default BadgeAdditionalInfoContainer;
