import { OfficeWebModel } from '../../../officeweb/model/old/OfficeWebModel';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Table } from 'semantic-ui-react';
import depot, { DepotFileViewModel } from '@nara.drama/depot';
import { reactAutobind } from '@nara.platform/accent';
import { FormTable } from 'shared/components';

interface Props {
  officeWeb: OfficeWebModel;
  filesMap?: Map<string, any>;
  cubeType?: string;
  structureType?: string;
}

@observer
@reactAutobind
class OfficeWebDetailView extends React.Component<Props> {
  //
  render() {
    const { officeWeb, filesMap } = this.props;
    //
    return (
      <>
        <FormTable.Row name="교육자료">
          <Table celled>
            <colgroup>
              <col width="80%" />
              <col width="20%" />
            </colgroup>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">파일명</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  {(filesMap &&
                    filesMap.get('officeweb') &&
                    filesMap.get('officeweb').map((foundedFile: DepotFileViewModel, index: number) => (
                      <p key={index}>
                        <a onClick={() => depot.downloadDepotFile(foundedFile.id)}>{foundedFile.name}</a>
                      </p>
                    ))) ||
                    '-'}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </FormTable.Row>
        <FormTable.Row name="교육자료URL">{officeWeb && officeWeb.webPageUrl}</FormTable.Row>
      </>
    );
  }
}

export default OfficeWebDetailView;
