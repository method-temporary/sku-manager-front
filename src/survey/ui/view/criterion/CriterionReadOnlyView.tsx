import React from 'react';
import { observer } from 'mobx-react';
import { Divider, Table } from 'semantic-ui-react';
import CriterionTabReadOnlyView from './CriterionTabReadOnlyView';
import { CriterionModel } from '../../../form/model/CriterionModel';

interface Props {
  criterionList: CriterionModel[];
}

interface State {
  selectedCriterion: CriterionModel;
}

@observer
export default class CriterionReadOnlyView extends React.Component<Props, State> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedCriterion: new CriterionModel(),
    };
  }

  select(criterion: CriterionModel) {
    this.setState(() => ({
      selectedCriterion: criterion,
    }));
  }

  render() {
    const { criterionList } = this.props;

    const { selectedCriterion } = this.state;

    if (criterionList && criterionList.length) {
      return (
        <>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                <Table.HeaderCell>하위값</Table.HeaderCell>
                <Table.HeaderCell>상위값</Table.HeaderCell>
                <Table.HeaderCell>증가값</Table.HeaderCell>
                <Table.HeaderCell>보기 개수</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {criterionList &&
                criterionList.map((criterion) => (
                  <Table.Row
                    key={criterion.number}
                    active={criterion.number === selectedCriterion.number}
                    onClick={() => this.select(criterion)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Table.Cell textAlign="center">{criterion.number}</Table.Cell>
                    <Table.Cell>{criterion.minValue} 부터</Table.Cell>
                    <Table.Cell>{criterion.maxValue} 까지</Table.Cell>
                    <Table.Cell>+ {criterion.increase}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {(criterion.criteriaItems && criterion.criteriaItems.length) || 0}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
          {selectedCriterion && selectedCriterion.criteriaItems && selectedCriterion.criteriaItems.length > 0 && (
            <>
              <Divider />
              <CriterionTabReadOnlyView criterion={selectedCriterion} />
            </>
          )}
        </>
      );
    } else {
      return <>척도 없음</>;
    }
  }
}
