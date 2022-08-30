import * as React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PatronKey } from 'shared/model';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CollegeChannelRom } from '../../model/dto/CollegeChannelRom';

interface Props {
  getUserWorkspaceName: (id: string) => string;
  routeToCollegeDetailPage: (id: string) => void;

  colleges: CollegeChannelRom[];
  startNo: number;
}

@observer
@reactAutobind
class CollegeListView extends ReactComponent<Props, {}> {
  //
  render() {
    //
    const { getUserWorkspaceName, routeToCollegeDetailPage } = this.props;
    const { colleges, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col />
          <col />
          <col width="10%" />
          <col width="15%" />
          <col width="15%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">사용자 소속</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Category 명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">정렬 순서</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">사용 여부</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {colleges &&
            colleges.length > 0 &&
            colleges.map((college, index) => (
              <Table.Row key={index} onClick={() => routeToCollegeDetailPage(college.id)}>
                <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                <Table.Cell textAlign="center">{`${getUserWorkspaceName(
                  PatronKey.getCineroomId(college.patronKey)
                )}`}</Table.Cell>
                <Table.Cell textAlign="center">
                  {getPolyglotToAnyString(college.name, getDefaultLanguage(college.langSupports))}
                </Table.Cell>
                <Table.Cell textAlign="center">{college.displayOrder}</Table.Cell>
                <Table.Cell textAlign="center">
                  {getPolyglotToAnyString(college.creator.name, getDefaultLanguage(college.langSupports))}
                </Table.Cell>
                <Table.Cell textAlign="center">{moment(college.registeredTime).format('YYYY.MM.DD')}</Table.Cell>
                <Table.Cell textAlign="center">{college.enabled ? 'O' : 'X'}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    );
  }
}

export default CollegeListView;
