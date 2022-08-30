import React from 'react';
import { Loader } from '../components/Loader';
import { inject, observer } from 'mobx-react';

import { ReactComponent, reactAutobind } from '@nara.platform/accent';
import { LoaderService } from '../components/Loader/present/logic/LoaderService';
import { Button, Container, Header, Image, Segment } from 'semantic-ui-react';

interface Props {}

interface State {
  runFn: string;
}

interface Injected {
  loaderService: LoaderService;
}

@inject('loaderService')
@observer
@reactAutobind
class LoaderExample extends ReactComponent<Props, State, Injected> {
  //
  state: State = {
    runFn: '',
  };

  constructor(props: Props) {
    super(props);

    this.injected.loaderService.openLoader();
  }

  renderBasicLoader() {
    //
    return (
      <div>
        <Segment>
          <Loader>
            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Loader>
        </Segment>
      </div>
    );
  }

  renderChangeLoaderTextLoader() {
    //
    return (
      <>
        <div>
          <Segment>
            <Loader loaderText="Basic Text">
              <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
            </Loader>
          </Segment>
        </div>
        <div>
          <Segment>
            <Loader loaderText={<span>React Node</span>}>
              <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
            </Loader>
          </Segment>
        </div>
      </>
    );
  }

  renderPageLoader() {
    //
    return (
      <>
        <div>
          <Button onClick={() => this.injected.loaderService.openPageLoader()}>Open Loader</Button>

          <Segment>
            <Loader loaderText={<Button onClick={() => this.injected.loaderService.closeLoader()}>close</Button>}>
              <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
            </Loader>
          </Segment>
        </div>
      </>
    );
  }

  renderMultiLoader() {
    //
    return (
      <>
        <Segment>
          <Button onClick={this.multiLoader}>Multi Loader</Button>

          <p>{this.state.runFn}</p>

          <Loader>
            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Loader>
        </Segment>
      </>
    );
  }

  renderSplitLoader() {
    //
    return (
      <>
        <Button onClick={() => this.injected.loaderService.openPageLoader()}>Open Loader</Button>

        <Segment>
          <p>name: A</p>
          <Button onClick={() => this.closeSplitLoader('A')}>Close A</Button>
          <Loader name="A">
            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Loader>
        </Segment>
        <Segment>
          <p>name: B</p>
          <Button onClick={() => this.closeSplitLoader('B')}>Close B</Button>
          <Loader name="B">
            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Loader>
        </Segment>
        <Segment>
          <p>name: C</p>
          <Button onClick={() => this.closeSplitLoader('C')}>Close C</Button>
          <Loader name="C">
            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Loader>
        </Segment>
        <Segment>
          <p>name: D</p>
          <Button onClick={() => this.closeSplitLoader('D')}>Close D</Button>
          <Loader name="D">
            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Loader>
        </Segment>
      </>
    );
  }

  async multiLoader() {
    //
    this.injected.loaderService.openLoader(true);

    await this.fn1();
    await this.fn2();
    await this.fn3();
    await this.setState({ runFn: '' });

    // this.injected.loaderService.closeLoader(true);
  }

  fn1() {
    //
    this.setState({ runFn: 'Fn1' });
  }

  fn2() {
    //
    this.setState({ runFn: 'Fn2' });
  }

  fn3() {
    //
    this.setState({ runFn: 'Fn3' });
  }

  closeSplitLoader(name: string) {
    //
    this.injected.loaderService.closeLoader(true, name);
  }

  render() {
    //
    return (
      <Container fluid>
        <Button onClick={() => this.injected.loaderService.openLoader()}>Open</Button>

        <Header size="small">Basic Loader</Header>
        {this.renderBasicLoader()}

        <Header size="small">Change Loader Text</Header>
        {this.renderChangeLoaderTextLoader()}

        <Header size="small">Multi Loader</Header>
        <p>여러개의 함수가 끝났을 경우 Loader 종료를 위한 Loader</p>
        {this.renderMultiLoader()}

        <Header size="small">Split Loader</Header>
        {this.renderSplitLoader()}

        <Header size="small">Page Loader</Header>
        {this.renderPageLoader()}
      </Container>
    );
  }
}

export default LoaderExample;
