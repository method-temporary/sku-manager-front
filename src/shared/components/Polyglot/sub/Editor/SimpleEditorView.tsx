import React from 'react';
import PolyglotContext from '../../context/PolyglotContext';
import HtmlEditor, { HtmlEditorProps } from '../../../../ui/view/HtmlEditor';
import SelectType from '../../../../model/SelectType';

interface Props extends HtmlEditorProps {
  name: any;
  value: string;
  onChangeProps?: (name: any, value: any) => void;
  maxLength?: number;
  disabled?: boolean;
}

class SimpleEditorView extends React.Component<Props> {
  //
  HTMLEditorQuillRefs: any = null;

  static contextType = PolyglotContext;
  context!: React.ContextType<typeof PolyglotContext>;

  constructor(props: Props) {
    super(props);

    // this.state = {
    //   valueLength: 0,
    // };
  }

  static defaultProps = {
    maxLength: 0,
  };

  componentDidMount() {
    //
    const { names } = this.context;
    names.push(this.props.name);
  }

  setHtmlEditorLengthLimit() {
    //
    const { maxLength = 0 } = this.props;

    if (!this.props.readOnly && maxLength && this.HTMLEditorQuillRefs) {
      const ref = this.HTMLEditorQuillRefs;

      if (ref) {
        const targetQuillEditor = ref.getEditor();
        targetQuillEditor.on('text-change', (delta: { ops: any }, old: any, source: any) => {
          const charLen = targetQuillEditor.getLength();
          if (charLen > maxLength) {
            targetQuillEditor.deleteText(maxLength, charLen);
          }
        });
      }
    }
  }

  defaultOnchange(text: any): void {
    //
    const { name, onChangeProps } = this.props;

    if (onChangeProps) {
      onChangeProps(name, text);
    }
  }

  render() {
    //
    this.setHtmlEditorLengthLimit();
    const { value, placeholder, maxLength, readOnly, disabled } = this.props;

    return (
      <>
        {/* <div
          className={
            value && maxLength && valueLength >= maxLength
              ? 'ui right-top-count input error'
              : 'ui right-top-count input'
          }
        >
          <span className="count">
            <span className="now">{valueLength || 0}</span>/<span className="max">{maxLength || 0}</span>
          </span>
        </div> */}
        <HtmlEditor
          quillRef={(el: any) => {
            this.HTMLEditorQuillRefs = el;
          }}
          modules={SelectType.modules}
          formats={SelectType.formats}
          placeholder={!readOnly ? placeholder : ''}
          value={value}
          onChange={(html) => this.defaultOnchange(html === '<p><br></p>' ? '' : html)}
          readOnly={readOnly}
          disabled={disabled}
          
        />
      </>
    );
  }
}

export default SimpleEditorView;
