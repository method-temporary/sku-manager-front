import React from 'react';
import { action, observable } from 'mobx';
import { autobind } from '@nara.platform/accent';

@autobind
class CrossEditorService {
  //
  static instance: CrossEditorService;

  @observable
  crossEditorMap: Map<string, any> = new Map<string, any>();

  @action
  setCrossEditor(id: string, crossEditor: any) {
    //
    this.crossEditorMap.set(id, crossEditor);
  }

  @action
  getCrossEditor(id: string) {
    //
    if (!this.isCrossEditorById(id)) {
      return null;
    }

    return this.crossEditorMap.get(id);
  }

  @action
  getCrossEditorBodyValue(id: string) {
    //
    if (!this.isCrossEditorById(id)) {
      return '';
    } else {
      const crossEditor = this.crossEditorMap.get(id);
      return crossEditor.GetBodyValue();
    }
  }

  @action
  setCrossEditorBodyValue(id: string, value: string) {
    //
    if (this.isCrossEditorById(id)) {
      const crossEditor = this.crossEditorMap.get(id);
      crossEditor.SetBodyValue(value);
    }
  }

  @action
  setCrossEditorFocus(id: string) {
    if (this.isCrossEditorById(id)) {
      const crossEditor = this.crossEditorMap.get(id);
      crossEditor.SetFocusEditor(-1);
    }
  }

  private isCrossEditorById(id: string) {
    return !!this.crossEditorMap.get(id);
  }
}

CrossEditorService.instance = new CrossEditorService();
export default CrossEditorService;
