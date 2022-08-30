import * as React from 'react';
import { HtmlEditor } from 'shared/ui';
import { reactAutobind } from '@nara.platform/accent';
import { PostModel } from '../../../post/model/PostModel';

interface Props {
  post: PostModel;
  onChangeContentsProps: (name: string, value: string) => void;
  value: any;
}

interface States {
  editorHtml: string;
}

@reactAutobind
class Editor extends React.Component<Props, States> {
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
    const { onChangeContentsProps } = this.props;
    if (html && html.length < 1000000000000000) {
      onChangeContentsProps('contents.contents', html);
    } else {
      alert('aa.');
    }
  }

  render() {
    const { value } = this.props;
    return (
      <HtmlEditor modules={this.modules} formats={this.formats} value={value || ''} onChange={this.handleChange} />
    );
  }
}

export default Editor;
