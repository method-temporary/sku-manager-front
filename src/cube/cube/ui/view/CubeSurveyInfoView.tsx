import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Button, Icon, Table } from 'semantic-ui-react';
import SurveyModal from '../logic/SurveyModal';
import { CubeModel } from '../../model/CubeModel';

interface Props {
  onClickSurveyForm: (surveyFormId: string) => void;
  onClickSurveyDeleteRow: () => void;
  cube: CubeModel;
  readonly?: boolean;
}

@observer
@reactAutobind
class CubeSurveyInfoView extends ReactComponent<Props, {}> {
  //
  render() {
    //
    const { onClickSurveyForm, onClickSurveyDeleteRow } = this.props;
    const { cube, readonly } = this.props;

    return (
      <Table celled>
        <colgroup>
          {readonly ? null : <col width="5%" />}
          <col width="" />
          {/*<col width="30%" />*/}
          <col width="25%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            {readonly ? null : <Table.HeaderCell textAlign="center" />}
            <Table.HeaderCell textAlign="center">설문 제목</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">설문 작성자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <SurveyModal
            surveyId={cube.cubeContents.surveyId}
            trigger={
              <Table.Row className="pointer" onClick={() => onClickSurveyForm(cube.cubeContents.surveyId)}>
                {readonly ? null : (
                  <Table.Cell onClick={(event: any) => event.stopPropagation()}>
                    <Button size="mini" basic onClick={() => onClickSurveyDeleteRow()}>
                      <Icon name="minus" />
                    </Button>
                  </Table.Cell>
                )}

                <Table.Cell>{cube.cubeContents.surveyTitle}</Table.Cell>
                <Table.Cell>{cube.cubeContents.surveyDesignerName}</Table.Cell>
              </Table.Row>
            }
          />
        </Table.Body>
      </Table>
    );
  }
}

export default CubeSurveyInfoView;
