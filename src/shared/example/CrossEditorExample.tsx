import React from 'react';
import { ReactComponent } from '@nara.platform/accent';
import CrossEditor from '../components/CrossEditor';
import { Button } from 'semantic-ui-react';
import CrossEditorService from '../components/CrossEditor/present/logic/CrossEditorService';
import { inject } from 'mobx-react';

interface Props {
  //
}

interface Injected {
  crossEditorService: CrossEditorService;
}

@inject('crossEditorService')
class CrossEditorExample extends ReactComponent<Props, {}, Injected> {
  //
  onClickButton() {
    //
    const { crossEditorService } = this.injected;

    // console.log(crossEditorService.getCrossEditorBodyValue('sample'));
  }

  render() {
    //
    return (
      <div style={{ width: '100%' }}>
        {/*<CrossEditor*/}
        {/*  id="sample"*/}
        {/*  value="sdfasdfasdfasdfsadfasdfajsdkfldasjfl;kaj;eilfajsdkf;aeikofjakf;ajkl;fnae;lfjkakl;fj;aifkja;'fkejfo;i"*/}
        {/*/>*/}
        <Button onClick={() => this.onClickButton()}>ddd</Button>
      </div>
    );
  }
}

export default CrossEditorExample;
