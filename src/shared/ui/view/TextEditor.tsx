import React from 'react';
import ReactQuill from 'react-quill';
import * as Quill from 'quill';

interface HtmlEditorProps {
  modules?: Quill.StringMap;
  formats?: string[];
  onChange?: (content: string) => void;
  value?: string;
  quillRef?: (el: any) => void;
  placeholder?: string;
  theme?: string;
  readOnly?: boolean;
  onlyHtml?: boolean;
  widths?: number;
  heights?: number;
}

const TextEditor: React.FC<HtmlEditorProps> = function HtmlEditor({
  modules,
  formats,
  onChange,
  value,
  quillRef,
  placeholder,
  theme = 'snow',
  readOnly = false,
  onlyHtml = false,
  widths,
  heights,
}) {
  return (
    <ReactQuill
      ref={quillRef}
      theme={theme}
      modules={modules}
      formats={formats}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      // style={{ height: '300px', overflow: 'scroll' }}
    />
  );
};

export default TextEditor;
