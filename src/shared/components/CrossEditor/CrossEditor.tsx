import * as React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import CrossEditorService from './present/logic/CrossEditorService';
import { inject, observer } from 'mobx-react';
import { axiosApi } from '../../axios/Axios';
import { getCrossEditorImgUploadToJson } from './model/CrossEditorImgUploadModel';
import { adminCrossEditorToolbarList, emojiImagePath } from './present/logic/CrossEditorHelper';
import { EmojiModal } from './present/view/EmijiModal';
import { getDomainPath } from '../../../shared/helper/urlHelper';

interface Props {
  id: string;
  value: string;
  readonly?: boolean;
}

interface Injected {
  crossEditorService: CrossEditorService;
}

@inject('crossEditorService')
@observer
@reactAutobind
class CrossEditor extends ReactComponent<Props, {}, Injected> {
  emojiRef = React.createRef<HTMLDivElement>();
  CrossEditor: any = null;
  state = {
    isOpenEmojiContainer: false,
  };

  componentDidMount() {
    const { id } = this.props;
    this.startEditor(id);
    window.addEventListener('click', this.onClickOutside);
  }

  componentWillUnmount() {
    this.CrossEditor.destroyEditor();
    window.removeEventListener('click', this.onClickOutside);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
    if (prevProps.value !== this.props.value && this.CrossEditor) {
      this.CrossEditor.params.event.OnInitCompleted = this.OnInitCompleted;
    }
  }

  OnInitCompleted(e: any) {
    e.editorTarget.SetBodyValue(this.props.value);
  }

  CE_OnCustomMenu(e: any) {
    const layer = document.getElementById(`${this.props.id}-emoji`);
    if (e.type === 'custommenu_plugin' && e.customMenuID === 'customEmotion') {
      if (layer) {
        if (layer.classList.contains('visible')) {
          layer.classList.remove('visible');
          this.setState({ isOpenEmojiContainer: false });
        } else {
          layer.style.top = e.customMenuY;
          layer.style.left = e.customMenuX;
          layer.classList.add('visible');
          this.setState({ isOpenEmojiContainer: true });
        }
      }
    }
    return layer;
  }

  UploadProc(obj: any) {
    const formData = new FormData();
    formData.append('file', obj.dataObj.imageFile);

    // axiosApi.post('https://ma.mysuni.sk.com/api/images-upload/upload', obj.formData);
    axiosApi.post('/api/images-upload/upload', formData).then((response) => {
      if (response && response.data) {
        obj.complete(getCrossEditorImgUploadToJson(response.data, this.props.id));
      } else {
        obj.complete('upload fail!!');
      }
    });
  }

  startEditor(id: string) {
    this.CrossEditor = new (window as any).NamoSE(id);
    const params = this.getEditorParams();
    this.CrossEditor.params = params;
    this.CrossEditor.EditorStart();

    const { crossEditorService } = this.injected;
    crossEditorService.setCrossEditor(id, this.CrossEditor);
  }

  getEditorParams() {
    //
    const { id, readonly } = this.props;
    const baseURL = getDomainPath();

    return {
      Width: '100%',
      UserLang: 'auto',
      IconColor: 'default',
      FullScreen: false,
      ParentEditor: document.getElementById(`${id}-container`),
      // 에디터를 실행하기 전, 에디터의 웹 경로를 지정 해야만 필수 파일 import 및 서버 로직 처리가 가능합니다.
      // (개발/운영환경간 상이한 도메인에 대한 수정 처리가 필요한 부분)
      // EditorBaseURL: 'http://localhost:8090/extra-editor/',
      EditorBaseURL: `${baseURL}/extra-editor/`,
      event: {
        OnInitCompleted: this.OnInitCompleted,
        UploadProc: this.UploadProc,
        CE_OnCustomMenu: this.CE_OnCustomMenu,
      },
      Readonly: readonly,
      Menu: false,
      SetFocus: false,
      UserToolbar: true,
      InsertOnlyIframeSource: true,
      AddMenu: `customEmotion,plugin,${emojiImagePath},이모지`,
      SupportBrowser: 0,
      AutoInstall: false,
      CreateToolbar: adminCrossEditorToolbarList,
    };
  }

  selectEmoji(emoji: string) {
    this.CrossEditor.InsertValueEx(1, emoji);
    this.onClose();
  }

  onClickOutside(e: any) {
    if (this.emojiRef?.current?.contains(e.target)) {
      return;
    }
    if (e.target.id === 'usermenu_customEmotion') {
      return;
    }
    this.onClose();
  }

  onClose() {
    const layer = document.getElementById(`${this.props.id}-emoji`);

    if (layer) {
      if (layer.className.includes('visible')) {
        layer.classList.remove('visible');
        this.setState({ isOpenEmojiContainer: false });
      }
    }
  }

  render() {
    const { id } = this.props;
    const { isOpenEmojiContainer } = this.state;
    return (
      <>
        <div id={`${id}-container`} />
        <div id={`${id}-emoji`} className="ui bottom right popup transition emoji_popup" ref={this.emojiRef}>
          <EmojiModal selectEmoji={this.selectEmoji} onClose={() => this.onClose()} />
        </div>
        <div className="ce-ui-widget-overlay" style={{ display: isOpenEmojiContainer ? 'block' : 'none' }} />
      </>
    );
  }
}

export default CrossEditor;
