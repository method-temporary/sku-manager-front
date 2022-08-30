import React from 'react';
import { observer } from 'mobx-react';
import { Container, PaginationProps } from 'semantic-ui-react';

import { DimmerLoader, PageTitle } from 'shared/components';
import { Pagination } from 'shared/ui';

import TempSearchBoxService from 'shared/components/TempSearchBox/logic/TempSearchBoxService';

import { cardApprovalBreadcrumb } from '../../shared/utiles';

import { useFindCardApprovalByRdo } from './CardApproval.hook';
import CardApprovalListStore from './CardApprovalList.store';

import CardApprovalSearchBox from './components/CardApprovalSearchBox';
import CardApprovalSubActions from './components/CardApprovalSubActions';
import CardApprovalList from './components/CardApprovalList';

const CardApprovalListPage = observer(() => {
  //
  const { offset, limit, cardApprovalRdo, setOffset, setCardApprovalRdo, setCardApprovalRdoForPage } =
    CardApprovalListStore.instance;

  const { data, isLoading, isRefetching } = useFindCardApprovalByRdo(cardApprovalRdo);

  const totalPages = () => {
    if (data === undefined) {
      return 0;
    }

    return Math.ceil(data.totalCount / limit);
  };

  const onPageChange = (_: React.MouseEvent, data: PaginationProps) => {
    //
    const { isSearch } = TempSearchBoxService.instance;
    const offset = data.activePage as number;
    setOffset(offset);
    setCardApprovalRdoForPage(isSearch);
  };

  const onSearch = () => {
    //
    setOffset(1);
    setCardApprovalRdo();
  };

  return (
    <Container>
      <PageTitle breadcrumb={cardApprovalBreadcrumb} />
      <CardApprovalSearchBox onSearch={onSearch} />
      <CardApprovalSubActions />
      <DimmerLoader active={isRefetching || isLoading}>
        <CardApprovalList cards={data?.results || []} startNo={(data?.totalCount || 0) - (offset - 1) * limit} />
      </DimmerLoader>
      <Pagination offset={offset} totalPages={totalPages()} onPageChange={onPageChange} />
    </Container>
  );
});

export default CardApprovalListPage;
