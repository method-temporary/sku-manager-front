import * as React from 'react';
import { observer } from 'mobx-react';
import { Form } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { FormTable } from 'shared/components';
import { SearchBoxFieldView } from 'shared/ui';

import { PageElementModel } from '_data/arrange/pageElements/model';
import { PageElementPosition, PageElementType } from '_data/arrange/pageElements/model/vo';

import { getPositionName } from '../pageElementHelper';

interface Props {
  onChangePostQueryProps: (name: string, value: string) => void;

  pageElement: PageElementModel;
  isUpdatable: boolean;
}

@observer
@reactAutobind
class ElementManagementCreateBasicInfoView extends ReactComponent<Props> {
  //
  componentDidMount(): void {}

  render() {
    const { onChangePostQueryProps, pageElement, isUpdatable } = this.props;

    return (
      <FormTable colWidths={['10%', '90%']} title="기본정보">
        <FormTable.Row name="구분" required>
          {isUpdatable ? (
            <SearchBoxFieldView
              fieldTitle=""
              fieldOption={SelectType.pageElementPosition}
              onChangeQueryProps={onChangePostQueryProps}
              targetValue={(pageElement && pageElement.position) || PageElementPosition.Select}
              queryFieldName="position"
            />
          ) : (
            <p>{getPositionName(pageElement.position)}</p>
          )}
        </FormTable.Row>
        <FormTable.Row name="타입" required>
          <Form.Field>
            {isUpdatable ? (
              <SearchBoxFieldView
                fieldTitle=""
                fieldOption={
                  (pageElement.position === PageElementPosition.TopMenu && SelectType.pageElementTopType) ||
                  (pageElement.position === PageElementPosition.Footer && SelectType.pageElementFloatingType) ||
                  (pageElement.position === PageElementPosition.HomeElement && SelectType.pageElementHomeType) || [
                    ...SelectType.pageElementTopType,
                    ...SelectType.pageElementFloatingType,
                    ...SelectType.pageElementHomeType,
                  ]
                }
                onChangeQueryProps={onChangePostQueryProps}
                targetValue={(pageElement && pageElement.type) || PageElementType.Default}
                queryFieldName="type"
              />
            ) : (
              <p>{pageElement.type}</p>
            )}
          </Form.Field>
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default ElementManagementCreateBasicInfoView;
