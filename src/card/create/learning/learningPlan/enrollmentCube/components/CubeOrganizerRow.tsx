import React from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Table } from 'semantic-ui-react';
import { ContentsProviderService } from '../../../../../../college';
import { getPolyglotToAnyString } from '../../../../../../shared/components/Polyglot';
import EnrollmentCubeStore from '../EnrollmentCube.store';

interface props {
  readonly?: boolean;
}
export const CubeOrganizerRow = observer(({ readonly }: props) => {
  //

  const { organizerId, setOrganizerId, otherOrganizerName, setOtherOrganizerName } = EnrollmentCubeStore.instance;

  const onChangeSelector = (value: string) => {
    //
    setOrganizerId(value);
  };

  const onChangeOtherOrganizerName = (value: string) => {
    //
    setOtherOrganizerName(value);
  };

  const getProvider = () => {
    const { contentsProviders } = ContentsProviderService.instance;
    const selectContentsProviderType: {
      key: string;
      text: string;
      value: string;
    }[] = [];

    contentsProviders.forEach((contentsProvider) => {
      selectContentsProviderType.push({
        key: contentsProvider.id,
        text: getPolyglotToAnyString(contentsProvider.name),
        value: contentsProvider.id,
      });
    });
    return selectContentsProviderType;
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">
        교육기관/출처<span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        {readonly ? (
          `${(getProvider() && getProvider().find((provider) => provider.value === organizerId)?.text) || '-'} ${
            (organizerId === ETC_PROVIDER_ID && `: ${otherOrganizerName}`) || ''
          }`
        ) : (
          <Form.Group>
            <Form.Select
              placeholder="Select..."
              width={4}
              options={getProvider()}
              onChange={(e: any, data: any) => onChangeSelector(data.value)}
              value={organizerId}
              search
            />
            {organizerId === ETC_PROVIDER_ID && (
              <Form.Field
                fluid
                control={Input}
                width={13}
                placeholder="선택사항이 없는 경우, 교육기관/출처를 입력해주세요."
                value={otherOrganizerName}
                onChange={(e: any) => onChangeOtherOrganizerName(e.target.value)}
              />
            )}
          </Form.Group>
        )}
      </Table.Cell>
    </Table.Row>
  );
});

export const ETC_PROVIDER_ID = 'PVD00018';
