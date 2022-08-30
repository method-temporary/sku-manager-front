import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Responsive } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';
import { isTranslator } from 'lib/common'
import ManagerHeader from './ManagerHeader';
import TranslationManagerHeader from './Translation/TranslationManagerHeader';

interface Props extends RouteComponentProps {
  children?: any
}

interface InnerProps extends RouteComponentProps {
  isTranslator: boolean,
  children?: any
}

@reactAutobind
class ManagerLayoutView extends React.Component<Props> {

  state = {
    isTranslator: false,
  }

  componentDidMount(){
    this.setState({isTranslator: isTranslator()})
  }

  //
  public render() {
    const props = this.props;
    const { isTranslator } = this.state;

    return (
      <div>
        <DesktopContainer isTranslator={isTranslator} {...props}>{props.children}</DesktopContainer>
        <TabletContainer isTranslator={isTranslator} {...props}>{props.children}</TabletContainer>
        <MobileContainer isTranslator={isTranslator} {...props}>{props.children}</MobileContainer>
      </div>
    );
  }
}
// DesktopContainer
@reactAutobind
class DesktopContainer extends React.Component<InnerProps> {
  //
  render() {
    const { isTranslator, children } = this.props;
    return (
      <Responsive {...Responsive.onlyComputer}>
        { isTranslator ? <TranslationManagerHeader /> : <ManagerHeader /> }
        {children}
      </Responsive>
    );
  }
}

// TabletContainer
@reactAutobind
class TabletContainer extends React.Component<InnerProps> {
  //
  render() {
    const { isTranslator, children } = this.props;
    return (
      <Responsive {...Responsive.onlyTablet}>
        { isTranslator ? <TranslationManagerHeader /> : <ManagerHeader /> }
        {children}
      </Responsive>
    );
  }
}

// MobileContainer
@reactAutobind
class MobileContainer extends React.Component<InnerProps> {
  //
  render() {
    const { isTranslator, children } = this.props;
    return (
      <Responsive {...Responsive.onlyMobile}>
        { isTranslator ? <TranslationManagerHeader /> : <ManagerHeader /> }
        {children}
      </Responsive>
    );
  }
}

export default withRouter(ManagerLayoutView);
