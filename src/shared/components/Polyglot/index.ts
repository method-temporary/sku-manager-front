import PolyglotView from './PolyglotView';
import { InputView } from './sub/Input';
import TextArea from './sub/TextArea';
import { Editor, SimpleEditor } from './sub/Editor';
import Languages from './sub/Languages';
import Default from './sub/Default';
import { ImageView } from './sub/Image';
import QuillView from './sub/Quill';
import FileBoxView from './sub/FileBox';
import PisAgreement from './sub/Aggrement';
import CrossEditor from './sub/CrossEditor';

type PolyglotComp = typeof PolyglotView & {
  Input: typeof InputView;
  TextArea: typeof TextArea;
  Editor: typeof Editor;
  SimpleEditor: typeof SimpleEditor;
  Languages: typeof Languages;
  Default: typeof Default;
  Image: typeof ImageView;
  Quill: typeof QuillView;
  FileBox: typeof FileBoxView;
  PisAgreement: typeof PisAgreement;
  CrossEditor: typeof CrossEditor;
};

const Polyglot = PolyglotView as PolyglotComp;

Polyglot.Input = InputView;
Polyglot.TextArea = TextArea;
Polyglot.Editor = Editor;
Polyglot.SimpleEditor = SimpleEditor;
Polyglot.Languages = Languages;
Polyglot.Default = Default;
Polyglot.Image = ImageView;
Polyglot.Quill = QuillView;
Polyglot.FileBox = FileBoxView;
Polyglot.PisAgreement = PisAgreement;
Polyglot.CrossEditor = CrossEditor;

export default Polyglot;

// component
export { default as PolyglotExcelUploadFailedListModal } from './component/PolyglotExcelUploadFailedListModal';
export { default as PolyglotExcelUploadModal } from './component/PolyglotExcelUploadModal';

// logic
export { default as PolyglotService } from './logic/PolyglotService';
export {
  getDefaultLanguage,
  getPolyglotToAnyString,
  getPolyglotToDefaultString,
  getPolyglotToString,
  isDefaultPolyglotBlank,
  isComparePolyglot,
  isComparePolyglotAnd,
  isPolyglotEmpty,
  isPolyglotBlank,
  parserLanguageTextToFull,
  parserLanguageTextToShort,
  setPolyglotValues,
  setLangSupports,
} from './logic/PolyglotLogic';

// model
export { Language, getLanguage, getLanguageValue } from './model/Language';
export { LanguageTypes, ALL_LANGUAGES, DEFAULT_LANGUAGE, getLanguageType } from './model/LanguagesType';
export { default as LangSupport, langSupportCdo, langSupportDefault } from './model/LangSupport';
