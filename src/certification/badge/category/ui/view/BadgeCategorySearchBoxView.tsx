import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { SelectTypeModel } from 'shared/model';
import { SearchBox } from 'shared/components';
import { addSelectTypeBoxAllOption } from 'shared/helper';
import { BadgeCategoryQueryModel } from '../../model/BadgeCategoryQueryModel';

interface Props {
  //
  changeBadgeCategoryQueryProps: (name: string, value: any) => void;
  onSearch: () => void;

  badgeCategoryQuery: BadgeCategoryQueryModel;
  paginationKey: string;
  userWorkspaceSelect: SelectTypeModel[];
  cineroomId: string;
}

@observer
@reactAutobind
class BadgeCategorySearchBoxView extends ReactComponent<Props> {
  //
  render() {
    //
    const {
      changeBadgeCategoryQueryProps,
      onSearch,
      badgeCategoryQuery,
      paginationKey,
      userWorkspaceSelect,
      cineroomId,
    } = this.props;

    if (cineroomId !== 'ne1-m2-c2') {
      changeBadgeCategoryQueryProps('cineroomId', cineroomId);
    } else {
      changeBadgeCategoryQueryProps('cineroomId', '');
    }

    return (
      <SearchBox
        onSearch={onSearch}
        changeProps={changeBadgeCategoryQueryProps}
        queryModel={badgeCategoryQuery}
        name={paginationKey}
      >
        <SearchBox.Group name="사용처">
          <SearchBox.Select
            fieldName="cineroomId"
            options={addSelectTypeBoxAllOption(userWorkspaceSelect)}
            placeholder="전체"
            disabled={cineroomId !== 'ne1-m2-c2'}
          />
        </SearchBox.Group>
      </SearchBox>
    );
  }
}

export default BadgeCategorySearchBoxView;
