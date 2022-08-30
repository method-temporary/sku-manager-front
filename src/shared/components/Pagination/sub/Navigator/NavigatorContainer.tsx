import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer, inject } from 'mobx-react';

import {
  PaginationProps as SemanticPaginationProps,
  Pagination as SemanticPagination,
  Grid,
  SemanticWIDTHS,
} from 'semantic-ui-react';
import { SharedService } from '../../../../present';
import PaginationContext from '../../context/PaginationContext';

interface Props extends Omit<SemanticPaginationProps, 'totalPages' | 'onPageChange'> {
  siblingRange?: SemanticPaginationProps['siblingRange'];
}

interface Injected {
  sharedService: SharedService;
}

@inject('sharedService')
@reactAutobind
@observer
class NavigatorContainer extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    siblingRange: 3,
  };

  static contextType = PaginationContext;

  context!: React.ContextType<typeof PaginationContext>;

  async onPageChange(e: React.MouseEvent<HTMLAnchorElement>, data: SemanticPaginationProps) {
    //
    const { sharedService } = this.injected;
    const { name, onChange } = this.context;
    const activePage = data.activePage as number;

    await onChange(activePage);
    await sharedService.setPage(name, activePage);
  }

  render() {
    //
    const { totalPages, sharedService, ...rest } = this.props;
    const { name } = this.context;
    const pageModel = this.injected.sharedService.getPageModel(name);
    const childrenCount = React.Children.count(rest.children) as SemanticWIDTHS;

    if (!pageModel || pageModel.count < 1) {
      return null;
    }

    return (
      <Grid columns={childrenCount || 1} className="list-info">
        <Grid.Row>
          <Grid.Column>
            <div className="center">
              <SemanticPagination
                activePage={pageModel.page}
                totalPages={pageModel.totalPages || 1}
                {...rest}
                onPageChange={this.onPageChange}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default NavigatorContainer;
