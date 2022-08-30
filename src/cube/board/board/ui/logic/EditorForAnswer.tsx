import * as React from 'react';

import { reactAutobind } from '@nara.platform/accent';

import { HtmlEditor } from 'shared/ui';
import { PolyglotModel } from 'shared/model';
import { getPolyglotToAnyString, Language } from 'shared/components/Polyglot';

import AnswerService from '../../../post/present/logic/AnswerService';
import { AnswerModel } from '../../../post/model/AnswerModel';

interface Props {
  answerService?: AnswerService;
  onChangeContentsProps: (name: string, value: string | PolyglotModel) => void;
  answer: AnswerModel;
  value: any;
}

interface States {
  editorHtml: string;
}

@reactAutobind
class EditorForAnswer extends React.Component<Props, States> {
  //
  formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ];

  modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'trike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  handleChange(html: any) {
    //
    const { onChangeContentsProps, value } = this.props;
    if (html && html.length < 65500) {
      const copiedValue = new PolyglotModel(value);
      copiedValue.setValue(Language.En, html);
      copiedValue.setValue(Language.Ko, html);
      copiedValue.setValue(Language.Zh, html);
      onChangeContentsProps('contents.contents', copiedValue);
    } else {
      alert('10000자를 넘을 수 없습니다.');
    }
  }

  render() {
    const { value } = this.props;
    return (
      <HtmlEditor
        modules={this.modules}
        formats={this.formats}
        value={getPolyglotToAnyString(value) || ''}
        onChange={this.handleChange}
      />
    );
  }
}

export default EditorForAnswer;
