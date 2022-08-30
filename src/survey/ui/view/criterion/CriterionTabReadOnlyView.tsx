import React from 'react';
import { observer } from 'mobx-react';
import { Input } from 'semantic-ui-react';
import { CriterionModel } from '../../../form/model/CriterionModel';

interface Props {
  criterion: CriterionModel
}

@observer
export default class CriterionTabReadOnlyView extends React.Component<Props> {
  //
  render() {

    const { criterion } = this.props;

    return (
      <>
        {
          criterion.criteriaItems.map((criteriaItem, index) => (
            <Input
              className="criterion-input labeled"
              key={`item-${criteriaItem.index}-ko`}
              label={criteriaItem.value}
              defaultValue={criteriaItem.name}
              readOnly
            />
          ))
        }
      </>
    );
  }
}
