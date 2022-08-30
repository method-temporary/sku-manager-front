import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { Button, Form, ImageProps } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PolyglotModel } from '../../../../model';
import { Image } from '../../../index';
import PolyglotContext from '../../context/PolyglotContext';
import { getPolyglotToString } from '../../logic/PolyglotLogic';
import { getLanguage, Language } from '../../model/Language';
import { getLanguageType, LanguageTypes } from '../../model/LanguagesType';
import { getImagePath } from 'shared/helper';

interface Props extends ImageProps {
  languageStrings: PolyglotModel;
  uploadFile: (file: File, lang: Language) => void;
  deleteFile?: (lang: Language) => void;
  fileName?: PolyglotModel;
}

@observer
@reactAutobind
class ImageView extends ReactComponent<Props, {}> {
  //
  private fileInputRefs = LanguageTypes.map(() => React.createRef<HTMLInputElement>());

  static contextType = PolyglotContext;
  context!: React.ContextType<typeof PolyglotContext>;

  render() {
    //
    const { languages } = this.context;
    const { uploadFile } = this.props;
    const { children, languageStrings, readOnly, fileName, deleteFile } = this.props;

    return (
      <>
        {languages.map((language, index) => {
          //
          const languageTypeIndex = getLanguageType(language.lang)?.indexingId;
          return (
            <Fragment key={index}>
              <span className="label">{getLanguageType(language.lang)?.text}</span>
              {readOnly ? null : (
                <Button
                  className="file-select-btn"
                  content={(fileName && fileName?.getValue(language.lang)) || '파일찾기'}
                  labelPosition="left"
                  icon="file"
                  disabled={readOnly}
                  onClick={() => {
                    if (
                      languageTypeIndex !== undefined &&
                      this.fileInputRefs &&
                      this.fileInputRefs[languageTypeIndex].current
                    ) {
                      this.fileInputRefs[languageTypeIndex].current?.click();
                    }
                  }}
                />
              )}
              {!readOnly && deleteFile && getPolyglotToString(languageStrings, language.lang) ? (
                <Button
                  style={{ marginTop: '0.5rem', marginBottom: '1rem', padding: '0.78571429em 1.5em' }}
                  icon="delete"
                  disabled={readOnly}
                  onClick={() => deleteFile(getLanguage(language.lang))}
                >
                  삭제
                </Button>
              ) : null}
              <Form.Group>
                <input
                  id="file"
                  type="file"
                  ref={(languageTypeIndex !== undefined && this.fileInputRefs[languageTypeIndex]) || null}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    e.target.files && uploadFile(e.target.files[0], getLanguage(language.lang))
                  }
                  hidden
                />
                {getPolyglotToString(languageStrings, language.lang) ? (
                  <Image src={`${getImagePath()}${getPolyglotToString(languageStrings, language.lang)}`} />
                ) : null}
              </Form.Group>
            </Fragment>
          );
        })}
        {children}
      </>
    );
  }
}

export default ImageView;
