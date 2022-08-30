import React from 'react';
import { observer } from 'mobx-react';

import { useFindAssessmentResults } from '../capability.hook';
import CapabilityStore from '../capability.store';
import { Pagination } from 'shared/ui';
import { PaginationProps } from 'semantic-ui-react';

const CapabilityPagination = observer(() => {
  //
  const { qdo, assessmentResultQuery, changeAssessmentResultQueryProps, setQdo } = CapabilityStore.instance;
  const { data } = useFindAssessmentResults(qdo);

  const getTotalPages = () => {
    if (!data?.results) {
      return 0;
    }

    return Math.ceil(data.totalCount / qdo.limit);
  };

  const onPageChange = (_: React.MouseEvent, data: PaginationProps) => {
    changeAssessmentResultQueryProps('offset', data.activePage);
    setQdo();
  };

  return <Pagination offset={assessmentResultQuery.offset} totalPages={getTotalPages()} onPageChange={onPageChange} />;
});

export default CapabilityPagination;
