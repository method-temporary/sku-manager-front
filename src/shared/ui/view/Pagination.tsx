import { observer } from 'mobx-react';
import { Grid, Pagination as SPagination, PaginationProps } from 'semantic-ui-react';
import React from 'react';

interface Props {
  offset: number;
  totalPages: number;
  onPageChange: (_: React.MouseEvent, data: PaginationProps) => void;
}

const Pagination = observer((props: Props) => {
  //
  const { offset, totalPages, onPageChange } = props;

  return (
    <>
      {totalPages > 1 && (
        <Grid className="list-info">
          <Grid.Row>
            <Grid.Column>
              <div className="center">
                <SPagination activePage={offset} totalPages={totalPages} onPageChange={onPageChange} />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </>
  );
});

export default Pagination;
