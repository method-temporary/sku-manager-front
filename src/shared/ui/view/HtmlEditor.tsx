import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import * as Quill from 'quill';
import { Button, TextArea } from 'semantic-ui-react';

export interface HtmlEditorProps {
  modules?: Quill.StringMap;
  formats?: string[];
  onChange?: (content: string) => void;
  value?: string;
  quillRef?: (el: any) => void;
  placeholder?: string;
  theme?: string;
  readOnly?: boolean;
  onlyHtml?: boolean;
  height?: number;
  quizEditor?: boolean;
  disabled?: boolean;
  editorId?: string;
}

const HtmlEditor: React.FC<HtmlEditorProps> = function HtmlEditor({
  modules,
  formats,
  onChange,
  value,
  quillRef,
  placeholder,
  theme = 'snow',
  readOnly = false,
  onlyHtml = false,
  height,
  quizEditor = false,
  disabled = false,
  editorId,
}) {
  const [isHtml, setIsHtml] = useState<boolean>(false);
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: `${isHtml || onlyHtml ? 'block' : 'none'}` }}>
        <div style={{ height: 48, width: '100%' }} />
        <TextArea
          style={{ height: height || 548, resize: 'vertical' }}
          value={value}
          onChange={(_, data) => {
            if (onChange !== undefined) {
              onChange(data.value as any);
            }
          }}
        />
      </div>
      {!onlyHtml && (
        <div style={{ display: `${!isHtml ? 'block' : 'none'}` }}>
          <ReactQuill
            ref={quillRef}
            theme={readOnly ? 'bubble' : theme}
            modules={modules}
            formats={formats}
            onChange={
              quizEditor
                ? (newValue, delta, source) => {
                    if (source === 'user' && onChange !== undefined) {
                      onChange(newValue);
                    }
                  }
                : onChange
            }
            value={value}
            placeholder={disabled || readOnly ? '' : placeholder}
            readOnly={readOnly || disabled}
            id={editorId}
          />
        </div>
      )}
      {!readOnly && !disabled && (
        <div style={{ position: 'absolute', top: 7, right: 0 }}>
          {!onlyHtml && (
            <Button type="button" onClick={() => setIsHtml(!isHtml)}>{`${isHtml ? 'EDIT' : 'HTML'}`}</Button>
          )}
          {onlyHtml && <Button disabled>HTML</Button>}
        </div>
      )}
    </div>
  );
};

export default HtmlEditor;
