import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import UserGroupSelectContainer from './UserGroupSelectContainer';
import { Table } from 'semantic-ui-react';
import UserGroupRuleModel from '../../model/UserGroupRuleModel';

interface Props {
  onChange: (selectedRules: UserGroupRuleModel[]) => void;
  multiple?: boolean;
  cineroomId?: string;
  companyCode?: string;
  readonly?: boolean;
}

@observer
@reactAutobind
class UserGroupSelectForm extends ReactComponent<Props> {
  //
  style = {
    headerCell: {
      paddingLeft: 0,
    },
  };

  render() {
    //
    const { multiple, onChange, cineroomId, companyCode, readonly } = this.props;
    const { style } = this;

    return (
      <UserGroupSelectContainer
        readonly={readonly}
        multiple={multiple}
        onChange={onChange}
        cineroomId={cineroomId}
        companyCode={companyCode}
        renderTable={(selectedCount, children) => (
          <div className="channel-change">
            <Table celled className="table-css">
              <colgroup>
                <col width="30%" />
                <col width="35%" />
                <col width="45%" />
              </colgroup>
              <Table.Header className="head">
                <Table.Row>
                  <Table.HeaderCell className="title-header" colSpan={3}>
                    그룹 정보
                  </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  <Table.HeaderCell className="cell" style={style.headerCell}>
                    사용자 그룹 분류
                  </Table.HeaderCell>
                  <Table.HeaderCell className="cell" style={style.headerCell}>
                    사용자 그룹
                  </Table.HeaderCell>
                  <Table.HeaderCell className="cell" style={style.headerCell}>
                    선택
                    {selectedCount > 0 && (
                      <span className="count">
                        <span style={{ color: '#ff664d' }}> {selectedCount}</span>개
                      </span>
                    )}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>{children}</Table.Body>
            </Table>
          </div>
        )}
      />
    );
  }
}

export default UserGroupSelectForm;
