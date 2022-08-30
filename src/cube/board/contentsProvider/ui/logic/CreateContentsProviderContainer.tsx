import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useCreateContentsProviderBasicInfo } from '../../service/useCreateContentsProviderBasicInfo';
import CreateContentsProviderBasicInfoView from '../view/CreateContentsProviderView';

interface CreateContentsProviderContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    communityId: string;
    contentsProviderId: string;
  }> {}
const CreateContentsProviderContainer: React.FC<CreateContentsProviderContainerProps> = function CreateContentsProviderContainer(
  props
) {
  const history = useHistory();
  function routeToContentsProviderList() {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/service-management/boards/contentsProvider-list`
    );
  }
  const [
    contentsProvider,
    uploadFile,
    saveContentsProvider,
    changeContentsProviderCdoProps,
    contentsProviderCdo,
    findContentsProviderById,
    deleteContentsProvider,
  ] = useCreateContentsProviderBasicInfo();

  if (contentsProvider === undefined || contentsProviderCdo === undefined) {
    return null;
  } else if (
    props.match.params.contentsProviderId &&
    contentsProviderCdo.id === ''
  ) {
    findContentsProviderById(
      props.match.params.communityId,
      props.match.params.contentsProviderId
    );
    changeContentsProviderCdoProps(
      'id',
      props.match.params.contentsProviderId
    );
  }

  return (
    <CreateContentsProviderBasicInfoView
      uploadFile={uploadFile}
      routeToContentsProviderList={routeToContentsProviderList}
      saveContentsProvider={saveContentsProvider}
      changeContentsProviderCdoProps={changeContentsProviderCdoProps}
      contentsProviderCdo={contentsProviderCdo}
      deleteContentsProvider={deleteContentsProvider}
    />
  );
};

export default withRouter(CreateContentsProviderContainer);
