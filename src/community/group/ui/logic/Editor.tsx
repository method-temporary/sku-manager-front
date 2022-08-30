import * as React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import ReactQuill from 'react-quill';

interface Props {
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
      onChangeContentsProps('html', html);
    } else {
      alert('html 작성 오류');
    }
  }

  render() {
    const { value } = this.props;
    return (
      <ReactQuill
        theme="snow"
        modules={this.modules}
        formats={this.formats}
        value={value || ''}
        onChange={this.handleChange}
      />
    );
  }
}

export default Editor;
