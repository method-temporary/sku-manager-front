import * as React from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';

import { PolyglotModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { AdditionalUserInfo } from '../../model/AdditionalUserInfo';
import { JobDutyModel } from '../../../college/model/JobDutyModel';
import { JobGroupModel } from '../../../college/model/JobGroupModel';

interface Props {
  additionalUserInfo: AdditionalUserInfo;
  channelMap: Map<string, string>;
  jobDutyMap: Map<string, JobDutyModel>;
  jobGroupMap: Map<string, JobGroupModel>;
}

@observer
@reactAutobind
class FavoriteInfoView extends React.Component<Props> {
  render() {
    const { additionalUserInfo, channelMap, jobDutyMap, jobGroupMap } = this.props;

    const { favoriteChannelIds, favoriteJobDutyId, favoriteJobGroupId, favoriteLearningTypes } = additionalUserInfo;

    const favoriteJobGroupName = getPolyglotToAnyString(
      jobGroupMap.get(favoriteJobGroupId)?.name || new PolyglotModel()
    );
    const favoriteJobDutyName = getPolyglotToAnyString(jobDutyMap.get(favoriteJobDutyId)?.name || new PolyglotModel());
    // favoriteJobGroup && favoriteJobGroup.favoriteJobDuty && favoriteJobGroup.favoriteJobDuty.name;

    let favoriteChannelName: string = '';

    if (favoriteChannelIds) {
      favoriteChannelIds?.forEach((channelId, index) => {
        if (!channelMap.get(channelId))

        favoriteChannelName += index === 0 ? channelMap.get(channelId) : ', ' + channelMap.get(channelId);
      });
    }

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} className="title-header">
              관심 정보
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">관심 직군(직무)</Table.Cell>
            <Table.Cell>
              {`${favoriteJobGroupName}${favoriteJobDutyName ? '(' + favoriteJobDutyName + ')' : ''}`}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">Category & Channel 정보</Table.Cell>
            <Table.Cell>{favoriteChannelName}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default FavoriteInfoView;
