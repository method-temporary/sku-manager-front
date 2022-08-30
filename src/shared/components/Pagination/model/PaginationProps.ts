import { PaginationProps as SemanticPaginationProps } from 'semantic-ui-react';
import { PageModel } from '../../../model';

export default interface PaginationProps extends Omit<SemanticPaginationProps, 'activePage'> {
  activePage: number;
  pageModel: PageModel;
}
