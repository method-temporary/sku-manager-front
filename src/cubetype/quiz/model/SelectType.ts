export const quizOptions = [
  { value: 'SingleChoice', text: '단일 객관식' },
  { value: 'MultipleChoice', text: 'Multiple choice' },
  { value: 'ShortAnswer', text: '단답형' },
  { value: 'Essay', text: '서술형' },
];

export const QuillModel = {
  // Quill.js
  formats: [
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
  ],

  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  },
};
