import { observer } from 'mobx-react';
import { Grid, Pagination, PaginationProps } from 'semantic-ui-react';
import React from 'react';

interface Props {
  offset: number;
  totalPages: number;
  onPageChange: (_: React.MouseEvent, data: PaginationProps) => void;
}

export const LinkedInPagination = observer((props: Props) => {
  //
  const { offset, totalPages, onPageChange } = props;

  return (
    <Grid className="list-info">
      <Grid.Row>
        <Grid.Column>
          <div className="center">
            <Pagination activePage={offset} totalPages={totalPages} onPageChange={onPageChange} />
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});
