// import { observer } from 'mobx-react';
// import { Segment, Grid, Button, Form, Input } from 'semantic-ui-react';
// import React, { useCallback } from 'react';
//
// interface Props {
//   title: string;
//   onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onClickSearch: () => void;
// }
//
// export const CourseSearchBox = observer((props: Props) => {
//   //
//   const { title, onChangeTitle, onClickSearch } = props;
//
//   const onKeyPressEnter = useCallback(
//     (e: React.KeyboardEvent<HTMLInputElement>) => {
//       if (e.key === 'Enter') {
//         onClickSearch();
//       }
//     },
//     [onClickSearch]
//   );
//
//   return (
//     <Segment>
//       <div className="ui form search-box">
//         <Grid>
//           {/*<colgroup>*/}
//           {/*  <col width="20%" />*/}
//           {/*  <col width="20%" />*/}
//           {/*  <col width="80%" />*/}
//           {/*</colgroup>*/}
//           <Grid.Row>
//             <Grid.Column width={16}>
//               <Form.Group inline>
//                 <label>Title</label>
//                 <Form.Field
//                   control={Input}
//                   width={16}
//                   placeholder="Title을 입력해주세요."
//                   value={title}
//                   onChange={onChangeTitle}
//                   onKeyPress={onKeyPressEnter}
//                 />
//               </Form.Group>
//             </Grid.Column>
//           </Grid.Row>
//         </Grid>
//       </div>
//       <Grid.Column width={16}>
//         <div className="center">
//           <Button primary onClick={onClickSearch}>
//             검색
//           </Button>
//         </div>
//       </Grid.Column>
//     </Segment>
//   );
// });
