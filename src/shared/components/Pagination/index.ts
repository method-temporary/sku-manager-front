import * as PaginationTypes from './type';
import PaginationContainer from './PaginationContainer';
import Navigator from './sub/Navigator';
import LimitSelect from './sub/LimitSelect';
import SortFilter from './sub/SortFilter';

type PaginationComp = typeof PaginationContainer & {
  Navigator: typeof Navigator;
  LimitSelect: typeof LimitSelect;
  SortFilter: typeof SortFilter;
};

const Pagination = PaginationContainer as PaginationComp;
Pagination.Navigator = Navigator;
Pagination.LimitSelect = LimitSelect;
Pagination.SortFilter = SortFilter;

export default Pagination;
export { PaginationTypes };
