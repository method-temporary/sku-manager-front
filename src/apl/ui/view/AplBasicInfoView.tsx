import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { EnumUtil, AplStateView } from 'shared/ui';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { AplService } from '../..';
import { AplState } from '../../model/AplState';

interface Props {
  aplService?: AplService;
}

@inject('aplService', 'sharedService')
@observer
@reactAutobind
class AplBasicInfoView extends React.Component<Props> {
  componentDidMount() {
    //
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {}

  render() {
    const { apl } = this.props.aplService || ({} as AplService);

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} className="title-header">
              기본 정보
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">생성자 및 등록일자</Table.Cell>
            <Table.Cell>
              <Form.Field>
                <div>
                  {((apl && getPolyglotToAnyString(apl.registrantUserIdentity.name)) || '') +
                    '   |   ' +
                    (moment(apl.registeredTime).format('YYYY.MM.DD HH:mm') || '')}
                </div>
              </Form.Field>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">처리상태</Table.Cell>
            <Table.Cell>
              {((apl.state === AplState.Opened || apl.state === AplState.Rejected) &&
                (EnumUtil.getEnumValue(AplStateView, apl.state).get(apl.state) +
                  '   |   ' +
                  moment(apl.allowTime || '').format('YYYY.MM.DD HH:mm') ||
                  '')) ||
                (apl.state === AplState.OpenApproval &&
                  (EnumUtil.getEnumValue(AplStateView, apl.state).get(apl.state) +
                    '   |   ' +
                    moment(apl.registeredTime || '').format('YYYY.MM.DD HH:mm') ||
                    ''))}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default AplBasicInfoView;
