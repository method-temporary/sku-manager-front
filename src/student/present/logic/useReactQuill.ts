import { useEffect } from 'react';
import ReactQuill from 'react-quill';


export function useReactQuill(reactQuill: ReactQuill | null) {

  useEffect(() => {
    if (
      reactQuill === undefined ||
      reactQuill === null
    ) {
      return;
    }

    const quillEditor = reactQuill.getEditor();

    quillEditor.on('text-change', () => {
      const charLength = quillEditor.getLength();
      if (charLength > 1000) {
        quillEditor.deleteText(1000, charLength);
      }
    });
  }, [reactQuill]);
}