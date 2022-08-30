import React from 'react';
import { observer } from 'mobx-react';
import { Divider, Input, Table } from 'semantic-ui-react';
import { CriterionModel } from '../../../form/model/CriterionModel';

interface Props {
  lang: string;
  criterionList: CriterionModel[];
  supportedLanguages: string[];
  onChangeCriterion: (number: string, prop: string, value: any) => void;
  onChangeCriterionLangString: (number: string, prop: string, lang: string, string: string) => void;
  calculateCriterionItems: (number: string) => void;
}

interface State {
  selectedCriterion: CriterionModel;
}

@observer
export default class CriterionCreationView extends React.Component<Props, State> {
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
    const { lang, criterionList, onChangeCriterion, onChangeCriterionLangString, calculateCriterionItems } = this.props;

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
                    <Table.Cell>
                      <Input
                        maxLength={100}
                        className={CriterionModel.checkValidation('minValue', criterion) ? '' : 'invalid'}
                        defaultValue={criterion.minValue}
                        onChange={(event, data) =>
                          onChangeCriterion(criterion.number, 'minValue', Number.parseInt(data.value, 10))
                        }
                        onBlur={() => calculateCriterionItems(criterion.number)}
                      /> 부터
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        maxLength={100}
                        className={CriterionModel.checkValidation('maxValue', criterion) ? '' : 'invalid'}
                        defaultValue={criterion.maxValue}
                        onChange={(event, data) =>
                          onChangeCriterion(criterion.number, 'maxValue', Number.parseInt(data.value, 10))
                        }
                        onBlur={() => calculateCriterionItems(criterion.number)}
                      /> 까지
                    </Table.Cell>
                    <Table.Cell>
                      +
                      <Input
                        maxLength={100}
                        className={CriterionModel.checkValidation('increase', criterion) ? '' : 'invalid'}
                        defaultValue={criterion.increase}
                        onChange={(event, data) =>
                          onChangeCriterion(criterion.number, 'increase', Number.parseInt(data.value, 10))
                        }
                        onBlur={() => calculateCriterionItems(criterion.number)}
                      />
                    </Table.Cell>
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
              {selectedCriterion.criteriaItems.map((criteriaItem, index) => (
                // <Form.Field>
                <Input
                  className="criterion-input labeled"
                  // maxLength={100}
                  key={`item-${criteriaItem.index}`}
                  label={criteriaItem.value}
                  value={
                    (criteriaItem.names.langStringMap.get(lang) && criteriaItem.names.langStringMap.get(lang)) || ''
                  }
                  onChange={(event, data) =>
                    onChangeCriterionLangString(
                      selectedCriterion.number,
                      `criteriaItems[${index}].names`,
                      lang,
                      data.value
                    )
                  }
                />
                // </Form.Field>
              ))}
            </>
          )}
        </>
      );
    } else {
      return <>척도를 추가해 주세요.</>;
    }
  }
}
