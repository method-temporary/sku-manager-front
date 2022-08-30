import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import depot from '@nara.drama/depot';
import { OfficeWebService } from '../../../../cubetype';
import AdditionalInfoForOfficeWebView from '../view/AdditionalInfoForOfficeWebView';

interface Props extends RouteComponentProps {
  cubeType?: string;
  filesMap: Map<string, any>;
  readonly?: boolean;
}

interface Injected {
  officeWebService: OfficeWebService;
}

@inject('officeWebService')
@observer
@reactAutobind
class CubeOfficeWebContainer extends ReactComponent<Props, {}, Injected> {
  //
  onChangeOfficeWebProps(name: string, value: string | Date | boolean | number, nameSub?: string) {
    //
    const { officeWebService } = this.injected;
    if (officeWebService && typeof value === 'object' && nameSub) {
      const stringDate = value.toLocaleDateString().replace('. ', '-').replace('. ', '-').replace('.', '');
      officeWebService.changeOfficeWebProps(name, value, nameSub, stringDate);
    }
    if (officeWebService) officeWebService.changeOfficeWebProps(name, value);
  }

  onChangeOfficeWebHeight(value: string) {
    //
    const { officeWebService } = this.injected;
    let val = value;
    if (value.startsWith('0') && value !== '0') {
      val = value.substr(1);
    } else if (parseInt(value, 10) > 3000) {
      val = '3000';
    }

    if (officeWebService) officeWebService.changeOfficeWebProps('height', parseInt(val, 10));
  }

  getFileBoxIdForEducation(fileBoxId: string) {
    //
    const { officeWebService } = this.injected;
    // const { cubeIntro } = cubeService || {} as CubeIntroService;
    // todo 파일 삭제했을때 로직
    if (officeWebService) {
      officeWebService.changeOfficeWebProps('fileBoxId', fileBoxId);
    }
  }

  findFiles(type: string, fileBoxId: string) {
    const filesMap: Map<string, any> = new Map<string, any>();
    depot.getDepotFiles(fileBoxId).then((files) => {
      filesMap.set(type, files);
      return new Map(filesMap.set(type, files));
    });
    return filesMap;
  }

  render() {
    const { officeWeb } = this.injected.officeWebService;
    const { readonly } = this.props;
    return (
      <AdditionalInfoForOfficeWebView
        onChangeOfficeWebProps={this.onChangeOfficeWebProps}
        onChangeOfficeWebHeight={this.onChangeOfficeWebHeight}
        officeWeb={officeWeb}
        getFileBoxIdForEducation={this.getFileBoxIdForEducation}
        cubeType={this.props.cubeType}
        readonly={readonly}
      />
    );
  }
}

export default withRouter(CubeOfficeWebContainer);
