import { decorate, observable } from 'mobx';
import { AbstractView } from 'react';

export class ExcelView implements AbstractView {
  styleMedia: StyleMedia = {} as StyleMedia;
  document: Document = {} as Document;

  templateFilePath: string = '';
  fileName: string = '';
  param: Map<string, Object> = new Map<string, Object>();

  constructor(excelView?: ExcelView) {
    if (excelView) {
      const param = excelView.param && excelView.param || new Map<string, Object>();
      Object.assign(this, { ...excelView, param });
    }
  }
}

decorate(ExcelView, {
  styleMedia: observable,
  document: observable,

  templateFilePath: observable,
  fileName: observable,
  param: observable,
});
