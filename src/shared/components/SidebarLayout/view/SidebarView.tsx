import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Menu, Header, Segment } from 'semantic-ui-react';
import { exampleUrl } from '../../../../Routes';

interface Props extends RouteComponentProps {
  activeItem: string;
  onClickItem: (name: string, url: string) => void;
}

@reactAutobind
class ExampleSideBarView extends ReactComponent<Props> {
  //

  render() {
    //
    const { activeItem, onClickItem } = this.props;

    return (
      <div className="m-lnb">
        <Segment basic>
          <Header as="h3">컴포넌트 예제</Header>
        </Segment>

        <Menu vertical>
          <Menu.Item>
            {/*<Menu.Header>FormTable</Menu.Header>*/}
            <Menu.Menu>
              <Menu.Item
                name="page-title"
                active={activeItem === 'page-title'}
                onClick={() => onClickItem('page-title', `/${exampleUrl}/page-title`)}
              >
                PageTitle1
              </Menu.Item>
            </Menu.Menu>
            <Menu.Menu>
              <Menu.Item
                name="sub-actions"
                active={activeItem === 'sub-actions'}
                onClick={() => onClickItem('sub-actions', `/${exampleUrl}/sub-actions`)}
              >
                SubActions
              </Menu.Item>
            </Menu.Menu>
            <Menu.Menu>
              <Menu.Item
                name="form-table"
                active={activeItem === 'form-table'}
                onClick={() => onClickItem('form-table', `/${exampleUrl}/form-table`)}
              >
                FormTable
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default withRouter(ExampleSideBarView);
