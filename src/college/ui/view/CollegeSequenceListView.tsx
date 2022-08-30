import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Icon, Table } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { HtmlEditor } from 'shared/ui';
import { SelectType } from 'shared/model';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CollegeChannelRom } from '../../model/dto/CollegeChannelRom';

interface Props {
  changeCollegeSequence: (oldIndex: number, newIndex: number) => void;

  colleges: CollegeChannelRom[];
  startNo: number;
}

interface States {}

@observer
@reactAutobind
class CollegeSequenceListView extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { changeCollegeSequence } = this.props;
    const { colleges, startNo } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="5%" />
          <col width="10%" />
          <col />
          <col />
          <col width="15%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">순서</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">순서변경</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Category 명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Category 설명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">최종 변경 일시</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {colleges &&
            colleges.length > 0 &&
            colleges.map((college, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <div>
                      <Button
                        disabled={index === colleges.length - 1}
                        icon
                        size="mini"
                        basic
                        onClick={() => changeCollegeSequence(index, index + 1)}
                      >
                        <Icon name="angle down" />
                      </Button>
                      <Button
                        disabled={index === 0}
                        icon
                        size="mini"
                        basic
                        onClick={() => changeCollegeSequence(index, index - 1)}
                      >
                        <Icon name="angle up" />
                      </Button>
                    </div>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {getPolyglotToAnyString(college.name, getDefaultLanguage(college.langSupports))}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <HtmlEditor
                      modules={SelectType.modules}
                      formats={SelectType.formats}
                      value={getPolyglotToAnyString(college.description, getDefaultLanguage(college.langSupports))}
                      readOnly={true}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="center">2020.08.09 17:42:11</Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    );
  }
}

export default CollegeSequenceListView;
