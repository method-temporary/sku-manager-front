// import React from 'react';
// import { Form, Input, InputProps } from 'semantic-ui-react';
// import PolyglotContext from '../../context/PolyglotContext';
// import { LanguageStrings } from '../../../../model/LanguageStrings';
// import { reactAutobind } from '@nara.platform/accent';
// import Polyglot from '../../index';
// import { getLanguageType } from '../../model/LanguagesType';
// import { deprecated } from 'mobx/lib/utils/utils';
//
// interface Props extends InputProps {
//   languagesStrings: LanguageStrings;
//   index: number;
//   onChangeProps: (index: number, value: any) => void;
//   maxLength?: number;
// }
//
// @reactAutobind
// class IndexableInputView extends React.Component<Props> {
//   //
//   static contextType = PolyglotContext;
//   context!: React.ContextType<typeof PolyglotContext>;
//
//   defaultOnchange(nextValue: string, key: string): void {
//     const { languagesStrings, index, onChangeProps } = this.props;
//     const copiedValue = new LanguageStrings(languagesStrings);
//     copiedValue.setValue(key, nextValue);
//     onChangeProps(index, copiedValue);
//   }
//
//   render() {
//     //
//     const { languages } = this.context;
//     const { languagesStrings, maxLength, placeholder } = this.props;
//
//     return (
//       <>
//         {languages &&
//           languages.map((language, index) => {
//             //
//             return (
//               <React.Fragment key={index}>
//                 {maxLength ? (
//                   <div
//                     className={
//                       languagesStrings.getValue(language).length >= maxLength
//                         ? 'ui right-top-count input error'
//                         : 'ui right-top-count input'
//                     }
//                   >
//                     <span className="label">{getLanguageType(language)?.text}</span>
//                     <span className="count">
//                       <span className="now">{languagesStrings.getValue(language).length}</span>/
//                       <span className="max">{maxLength}</span>
//                     </span>
//                     <Form.Field
//                       control={Input}
//                       width={16}
//                       placeholder={placeholder || ''}
//                       value={languagesStrings.getValue(language)}
//                       maxLength={maxLength - 1}
//                       onChange={(e: any) => this.defaultOnchange(e.target.value, language)}
//                     />
//                   </div>
//                 ) : (
//                   <Form.Field
//                     control={Input}
//                     width={16}
//                     label={language}
//                     placeholder={placeholder || ''}
//                     value={languagesStrings.getValue(language)}
//                     onChange={(e: any) => this.defaultOnchange(e.target.value, language)}
//                   />
//                 )}
//               </React.Fragment>
//             );
//           })}
//       </>
//     );
//   }
// }
//
// export default IndexableInputView;
