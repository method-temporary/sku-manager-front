import React from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';
import depot, { DepotFileViewModel } from '@nara.drama/depot';

import { CubeType } from 'shared/model';

import { OfficeWebModel } from '../../../officeweb/model/old/OfficeWebModel';

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
    const { officeWeb, filesMap, cubeType, structureType } = this.props;
    if (structureType === 'onlyRow') {
      return (
        <>
          <Table.Row>
            <Table.Cell className="tb-header">
              교육자료 {cubeType === CubeType.Documents ? <span className="required">*</span> : null}
            </Table.Cell>
            <Table.Cell>
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
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">교육자료(URL)</Table.Cell>
            <Table.Cell>{officeWeb && officeWeb.webPageUrl}</Table.Cell>
          </Table.Row>
        </>
      );
    } else {
      return (
        <Table celled key={3}>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={2} className="title-header">
                부가 정보
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header">
                교육자료 {cubeType === CubeType.Documents ? <span className="required">*</span> : null}
              </Table.Cell>
              <Table.Cell>
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
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">교육자료(URL)</Table.Cell>
              <Table.Cell>{officeWeb && officeWeb.webPageUrl}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
    }
  }
}

export default OfficeWebDetailView;
