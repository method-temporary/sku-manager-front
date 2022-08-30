import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useContentsProviderList } from '../../service/useContentsProviderList';
import ContentsProviderListView from '../view/ContentsProviderListView';

interface ContentsProviderListContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    contentsProviderId: string;
  }> {}

const ContentsProviderListContainer: React.FC<ContentsProviderListContainerProps> = function ContentsProviderListContainer(
  props
) {
  const history = useHistory();

  function routeToContentsProviderCreate() {
    history.push(`/cineroom/${props.match.params.cineroomId}/service-management/boards/contentsProvider-create`);
  }

  function routeToContentsProviderDetail(contentsProviderId: string) {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/service-management/boards/contentsProvider-modify/${contentsProviderId}`
    );
  }

  const [
    contentsProviderList,
    changeContentsProviderQueryProps,
    searchQuery,
    contentsProviderQuery,
    clearContentsProviderQuery,
    sharedService,
  ] = useContentsProviderList();

  return (
    <ContentsProviderListView
      searchQuery={searchQuery}
      contentsProviderQueryModel={contentsProviderQuery}
      routeToContentsProviderCreate={routeToContentsProviderCreate}
      changeContentsProviderQueryProps={changeContentsProviderQueryProps}
      clearContentsProviderQuery={clearContentsProviderQuery}
      contentsProviderList={contentsProviderList}
      routeToContentsProviderDetail={routeToContentsProviderDetail}
      sharedService={sharedService}
    />
  );
};

export default withRouter(ContentsProviderListContainer);
